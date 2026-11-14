// Alleviare Platform on Azure: Container Apps (API + web), ACR, Log Analytics, Key Vault.
// Database = PostgreSQL on Supabase (ADR-0001); its JDBC URL/password are passed as secure parameters.
// NOTE: written against the public Bicep schemas but NOT yet deployed or validated with `az bicep build`.
targetScope = 'resourceGroup'

@description('Short lowercase prefix, 3-12 chars, used in resource names')
@minLength(3)
@maxLength(12)
param prefix string

param location string = resourceGroup().location

@description('Image tag to deploy (e.g. the git commit SHA)')
param imageTag string = 'latest'

@secure()
param jwtSecret string

@description('JDBC URL, e.g. jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require')
@secure()
param databaseUrl string

param databaseUser string = 'postgres'

@secure()
param databasePassword string

@description('Public URL of the web app (for CORS), e.g. https://<web-fqdn>. Leave empty on first deploy, then redeploy.')
param webOrigin string = ''

@description('First-run provisioning: when bootstrapAdminEmail is set, the API creates this company and administrator if they do not exist yet.')
param bootstrapCompanyCode string = ''
param bootstrapCompanyName string = ''
param bootstrapCurrency string = 'USD'
param bootstrapTimezone string = 'UTC'
param bootstrapAdminEmail string = ''

@secure()
param bootstrapAdminPassword string = ''

@description('Roles that may only use the web portal, comma-separated (empty = all roles may use the mobile app)')
param webOnlyRoles string = ''

var bootstrapOn = !empty(bootstrapAdminEmail)
var bootstrapEnv = bootstrapOn ? [
  { name: 'BOOTSTRAP_ENABLED', value: 'true' }
  { name: 'BOOTSTRAP_COMPANY_CODE', value: bootstrapCompanyCode }
  { name: 'BOOTSTRAP_COMPANY_NAME', value: bootstrapCompanyName }
  { name: 'BOOTSTRAP_CURRENCY', value: bootstrapCurrency }
  { name: 'BOOTSTRAP_TIMEZONE', value: bootstrapTimezone }
  { name: 'BOOTSTRAP_ADMIN_EMAIL', value: bootstrapAdminEmail }
  { name: 'BOOTSTRAP_ADMIN_PASSWORD', secretRef: 'bootstrap-admin-password' }
] : []
var unique = uniqueString(resourceGroup().id)
var acrName = toLower('${prefix}acr${unique}')

resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${prefix}-logs'
  location: location
  properties: { sku: { name: 'PerGB2018' }, retentionInDays: 30 }
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false }
}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${prefix}-id'
  location: location
}

// AcrPull for the apps' managed identity
resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, identity.id, 'acrpull')
  scope: acr
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
  }
}

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${prefix}-kv-${take(unique, 6)}'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: { family: 'A', name: 'standard' }
    enableRbacAuthorization: true
    enableSoftDelete: true
  }
}

var secretsUser = '4633458b-17de-40c2-b2c7-d5e5ee63f3b2' // Key Vault Secrets User
resource kvAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(kv.id, identity.id, 'kvsecrets')
  scope: kv
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', secretsUser)
  }
}

resource kvJwt 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'jwt-secret'
  properties: { value: jwtSecret }
}
resource kvDbUrl 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'database-url'
  properties: { value: databaseUrl }
}
resource kvDbPassword 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'database-password'
  properties: { value: databasePassword }
}

resource kvBootstrapPassword 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (bootstrapOn) {
  parent: kv
  name: 'bootstrap-admin-password'
  properties: { value: bootstrapAdminPassword }
}

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${prefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logs.properties.customerId
        sharedKey: logs.listKeys().primarySharedKey
      }
    }
  }
}

resource api 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-api'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  dependsOn: [ acrPull, kvAccess, kvJwt, kvDbUrl, kvDbPassword, kvBootstrapPassword ]
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: { external: true, targetPort: 8080, transport: 'auto' }
      registries: [ { server: acr.properties.loginServer, identity: identity.id } ]
      secrets: concat([
        { name: 'jwt-secret', keyVaultUrl: kvJwt.properties.secretUri, identity: identity.id }
        { name: 'database-url', keyVaultUrl: kvDbUrl.properties.secretUri, identity: identity.id }
        { name: 'database-password', keyVaultUrl: kvDbPassword.properties.secretUri, identity: identity.id }
      ], bootstrapOn ? [
        { name: 'bootstrap-admin-password', keyVaultUrl: kvBootstrapPassword.properties.secretUri, identity: identity.id }
      ] : [])
    }
    template: {
      containers: [
        {
          name: 'api'
          image: '${acr.properties.loginServer}/alleviare-api:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: concat([
            { name: 'JWT_SECRET', secretRef: 'jwt-secret' }
            { name: 'DATABASE_URL', secretRef: 'database-url' }
            { name: 'DATABASE_USER', value: databaseUser }
            { name: 'DATABASE_PASSWORD', secretRef: 'database-password' }
            { name: 'CORS_ALLOWED_ORIGINS', value: webOrigin }
            { name: 'WEB_ONLY_ROLES', value: webOnlyRoles }
          ], bootstrapEnv)
          probes: [
            { type: 'Liveness', httpGet: { path: '/actuator/health', port: 8080 }, initialDelaySeconds: 30 }
            { type: 'Readiness', httpGet: { path: '/actuator/health', port: 8080 }, initialDelaySeconds: 20 }
          ]
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 5, rules: [ { name: 'http', http: { metadata: { concurrentRequests: '50' } } } ] }
    }
  }
}

resource web 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-web'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  dependsOn: [ acrPull ]
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: { external: true, targetPort: 3001, transport: 'auto' }
      registries: [ { server: acr.properties.loginServer, identity: identity.id } ]
    }
    template: {
      containers: [
        {
          name: 'web'
          image: '${acr.properties.loginServer}/alleviare-web:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 3 }
    }
  }
}

output acrName string = acr.name
output acrLoginServer string = acr.properties.loginServer
output apiUrl string = 'https://${api.properties.configuration.ingress.fqdn}'
output webUrl string = 'https://${web.properties.configuration.ingress.fqdn}'
