export type CompanyTier = "Enterprise Elite" | "Global Sovereign" | "BioTech Pro" | "Clinical Scale";
export type CompanyStatus = "Active" | "Trial" | "Suspended" | "Expired" | "Under Audit" | "Pending Setup";

export interface PharmaCompany {
  id: string;
  name: string;
  code: string;
  logo: string;
  foundedYear: number;
  headquarters: string;
  primaryContact: {
    name: string;
    email: string;
    role: string;
    phone: string;
  };
  licenses: {
    fdaEstablishmentId: string;
    emaGmpCert: string;
    cdscoLicense: string;
    whoGdpVerified: boolean;
    expiryDate: string;
  };
  stats: {
    activeSkus: number;
    activeBatches: number;
    hospitalsSupplied: number;
    complianceScore: number;
    annualGmv: string;
    coldChainAlerts: number;
  };
  tier: CompanyTier;
  status: CompanyStatus;
  joinedDate: string;
  usersCount: number;
  activeUsersCount: number;
  companyAdminsCount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  subscriptionStatus: "Active" | "Expiring Soon" | "Expired";
  daysUntilExpiry: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  enabledModules: {
    coldChainIot: boolean;
    aiPharmacovigilance: boolean;
    crossBorderClearance: boolean;
    apiIntegrations: boolean;
    customAuditVault: boolean;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  companyName: string;
  twoFactorEnabled: boolean;
}

export type DrugCategory = "Oncology" | "Immunology" | "Rare Disease" | "Cardiovascular" | "Vaccines" | "Neurology" | "Anti-Infective";
export type DrugSchedule = "Schedule H (Rx)" | "Schedule X" | "Biologic" | "OTC" | "Controlled Substance";
export type DrugStage = "Commercial" | "Phase III Clinical" | "R&D Formulation" | "Regulatory Review" | "Recalled";

export interface DrugProduct {
  id: string;
  companyId: string;
  companyName: string;
  brandName: string;
  genericName: string;
  skuCode: string;
  category: DrugCategory;
  dosageForm: string;
  activeIngredient: string;
  schedule: DrugSchedule;
  storageCondition: "2°C - 8°C (Cold Chain)" | "-20°C (Frozen)" | "-80°C (Ultra-Cryo)" | "15°C - 25°C (Controlled Room)";
  fdaNdaNumber: string;
  pricePerUnit: number;
  currency: string;
  stockInUnits: number;
  reservedUnits: number;
  stage: DrugStage;
  releaseDate: string;
  batchYieldStandard: string;
}

export type BatchStatus = "In Transit (Compliant)" | "Quarantine" | "In Production" | "Released / Distributed" | "Excursion Warning" | "Recalled";

export interface BatchRecord {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  companyId: string;
  companyName: string;
  manufactureDate: string;
  expiryDate: string;
  quantityUnits: number;
  destination: string;
  currentLocation: string;
  status: BatchStatus;
  currentTemp: number;
  targetTempMin: number;
  targetTempMax: number;
  sensorId: string;
  telemetryLogs: {
    timestamp: string;
    temperature: number;
    humidity: number;
    batteryPct: number;
    status: "Normal" | "Warning" | "Critical";
  }[];
  qaOfficer: string;
  releaseDate?: string;
  quarantineReason?: string;
}

export type PartnerType = "Tier-1 Apex Hospital" | "Regional Distributor" | "Government Health Org" | "Clinical Research Center" | "Central Stockist";

export interface PartnerEntity {
  id: string;
  name: string;
  type: PartnerType;
  country: string;
  city: string;
  assignedCompanies: string[];
  licenseNumber: string;
  gdpCertified: boolean;
  creditLimit: string;
  utilizedCredit: string;
  activeOrdersCount: number;
  rating: number;
  status: "Verified Active" | "Verification Pending" | "Suspended";
  contactPerson: string;
  contactEmail: string;
}

export type AdrSeverity = "Life-Threatening" | "Severe" | "Moderate" | "Mild";
export type AdrStatus = "Triaged" | "Under Medical Review" | "FDA MedWatch Filed" | "Closed / Resolved" | "Under QA Investigation";

export interface AdverseEventReport {
  id: string;
  reportCode: string;
  companyId: string;
  companyName: string;
  productId: string;
  productName: string;
  batchNumber: string;
  reporterType: "Healthcare Professional" | "Hospital QA" | "Patient Direct" | "Clinical Trial Monitor";
  severity: AdrSeverity;
  patientAgeGroup: string;
  eventDescription: string;
  dateReported: string;
  status: AdrStatus;
  causalityScore: "Definite" | "Probable" | "Possible" | "Unlikely";
  assignedInvestigator: string;
  regulatorySubmissionDeadline: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  companyId: string;
  companyName: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: "Batch Control" | "Company Onboarding" | "Product SKU" | "Pharmacovigilance" | "RBAC & Security" | "License Verification";
  details: string;
  ipAddress: string;
  eSignatureHash: string;
  severity: "Info" | "Security" | "Compliance Alert" | "Critical Action";
}

export interface SubscriptionPlan {
  id: string;
  companyId: string;
  companyName: string;
  tier: CompanyTier;
  billingCycle: "Annual" | "Quarterly" | "Monthly";
  mrr: number;
  contractRenewal: string;
  slaUptime: string;
  coldChainSensorsQuota: number;
  sensorsUsed: number;
  activeUsersQuota: number;
  usersUsed: number;
  storageGb: number;
  autoRenew: boolean;
  paymentStatus: "Paid" | "Pending" | "Failed";
  subscriptionStatus: "Active" | "Expiring Soon" | "Expired";
}
