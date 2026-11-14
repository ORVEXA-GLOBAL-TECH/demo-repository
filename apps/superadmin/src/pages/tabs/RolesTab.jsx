import React, { useMemo } from 'react';
import {
  Building2, Globe2, Users, UserCheck, CreditCard, DollarSign, AlertTriangle,
  Server, ShieldCheck, Activity, Plus, Search, Filter, CheckCircle2, XCircle, Clock,
  PauseCircle, UserCog, FileText, ToggleLeft, ToggleRight, Database, Lock, Layers, Key,
  LogOut, RefreshCw, ExternalLink, ChevronRight, Sparkles, ArrowUpRight, Settings,
  HardDrive, HelpCircle, Mail, Smartphone, MapPin, Calendar, Percent, CheckCircle, Inbox,
  Radio, BarChart3, LifeBuoy, Megaphone, AlertOctagon, Eye, Sliders, ShieldAlert, Download,
  Trash2, RotateCcw, UserX, UserCheck2, Send, SlidersHorizontal, Flame, Check, X, Coins,
  ArrowRightLeft, Compass, Timer, Edit, Save, CheckSquare, CalendarPlus, UserPlus, Info,
  PlayCircle, StopCircle, TrendingUp, TrendingDown, RefreshCcw, Award, Zap, Bell, Cpu,
  Code, Terminal, Copy, CheckCheck, Archive, FolderArchive, FileSpreadsheet, FileArchive,
  Shield, History, AlertCircle, Play
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function RolesTab() {
  // All state and handlers come from DashboardContext (zero prop drilling)
  const ctx = useDashboard();

  // Destructure everything from context into local scope
  const {
    companies, setCompanies, admins, setAdmins, platformUsers, setPlatformUsers,
    plans, setPlans, invoices, setInvoices, systemAlerts, setSystemAlerts,
    recentActivities, setRecentActivities, supportTickets, setSupportTickets,
    announcements, setAnnouncements, sovereignRegistry, setSovereignRegistry,
    dynamicBillingStats, activeTab, setActiveTab, globalSearchQuery, setGlobalSearchQuery,
    globalSearchResults, isGlobalSearchFocused, setIsGlobalSearchFocused,
    showToast, toast,
    selectedCompany, setSelectedCompany, isCreateCompanyOpen, setIsCreateCompanyOpen,
    isEditCompanyOpen, setIsEditCompanyOpen, isDeleteCompanyOpen, setIsDeleteCompanyOpen,
    companySearchQuery, setCompanySearchQuery, companyStatusFilter, setCompanyStatusFilter,
    companyPlanFilter, setCompanyPlanFilter, isLoadingCompanies, setIsLoadingCompanies,
    isTAMOpen, setIsTAMOpen, tamTargetCompany, setTAMTargetCompany,
    impersonatedCompany, setImpersonatedCompany,
    isPlatformUserModalOpen, setIsPlatformUserModalOpen,
    selectedPlatformUser, setSelectedPlatformUser,
    platformUserSearchQuery, setPlatformUserSearchQuery,
    platformUserRoleFilter, setPlatformUserRoleFilter,
    isLoadingPlatformUsers, setIsLoadingPlatformUsers,
    isCreatePlanOpen, setIsCreatePlanOpen, isEditPlanOpen, setIsEditPlanOpen,
    isDeletePlanOpen, setIsDeletePlanOpen, deletingPlan, setDeletingPlan,
    newPlanForm, setNewPlanForm, editingPlanForm, setEditingPlanForm,
    subscriptions, setSubscriptions, subscriptionSearchQuery, setSubscriptionSearchQuery,
    subscriptionStatusFilter, setSubscriptionStatusFilter,
    billingSubTab, setBillingSubTab,
    isUpgradeDowngradeOpen, setIsUpgradeDowngradeOpen,
    upgradeTargetCompany, setUpgradeTargetCompany, upgradeForm, setUpgradeForm,
    isRenewSubOpen, setIsRenewSubOpen, renewTargetCompany, setRenewTargetCompany, renewForm, setRenewForm,
    isConfigDatesOpen, setIsConfigDatesOpen, configTargetCompany, setConfigTargetCompany,
    configDatesForm, setConfigDatesForm, isProcessExpiriesOpen, setIsProcessExpiriesOpen,
    processExpiriesResult, setProcessExpiriesResult,
    billingOverview, setBillingOverview, billingTimeframe, setBillingTimeframe,
    revenueMetricType, setRevenueMetricType, isBillingMoreOpen, setIsBillingMoreOpen,
    addonsList, setAddonsList, usageQuotasList, setUsageQuotasList,
    isAssignAddonOpen, setIsAssignAddonOpen, assignAddonForm, setAssignAddonForm,
    invoicesList, setInvoicesList, paymentsList, setPaymentsList, refundsList, setRefundsList,
    subscriptionHistoryList, setSubscriptionHistoryList, billingContactsList, setBillingContactsList,
    billingSearchQuery, setBillingSearchQuery, invoiceStatusFilter, setInvoiceStatusFilter,
    isProcessRefundOpen, setIsProcessRefundOpen, refundForm, setRefundForm,
    isEditBillingContactOpen, setIsEditBillingContactOpen, editBillingContactForm, setEditBillingContactForm,
    globalSettings, setGlobalSettings, isSavingGlobalSettings, setIsSavingGlobalSettings,
    selectedOverrideCompanyId, setSelectedOverrideCompanyId, companyOverrideData, setCompanyOverrideData,
    companyOverrideForm, setCompanyOverrideForm, isSavingCompanyOverride, setIsSavingCompanyOverride,
    roleTemplates, setRoleTemplates, selectedRoleKey, setSelectedRoleKey, isSavingRoleTemplate, setIsSavingRoleTemplate,
    platformAnalytics, setPlatformAnalytics, analyticsTimeframe, setAnalyticsTimeframe,
    systemHealth, setSystemHealth, isHealthRefreshing, setIsHealthRefreshing,
    healthSubTab, setHealthSubTab, systemApisData, setSystemApisData,
    apiCategoryFilter, setApiCategoryFilter, apiMethodFilter, setApiMethodFilter,
    apiSearchQuery, setApiSearchQuery, isApisLoading, setIsApisLoading,
    pingTestModal, setPingTestModal, databaseTelemetryData, setDatabaseTelemetryData,
    isDbTelemetryLoading, setIsDbTelemetryLoading, tableSearchQuery, setTableSearchQuery,
    tableDetailsModal, setTableDetailsModal, backendLogsData, setBackendLogsData,
    logLevelFilter, setLogLevelFilter, logServiceFilter, setLogServiceFilter,
    logSearchQuery, setLogSearchQuery, isAutoStreamLogs, setIsAutoStreamLogs,
    isLogsLoading, setIsLogsLoading, isBackupRunning, setIsBackupRunning,
    isRetryingFailedJobs, setIsRetryingFailedJobs, diagnosticModal, setDiagnosticModal,
    selectedHealthService, setSelectedHealthService,
    securitySubTab, setSecuritySubTab, securityPolicies, setSecurityPolicies,
    isSavingSecurityPolicies, setIsSavingSecurityPolicies,
    activeSessionsList, setActiveSessionsList, activeSessionsSearch, setActiveSessionsSearch,
    activeSessionsTenantFilter, setActiveSessionsTenantFilter, securityThreatAlerts, setSecurityThreatAlerts,
    auditLogsList, setAuditLogsList, auditSearchQuery, setAuditSearchQuery,
    auditCompanyFilter, setAuditCompanyFilter, auditActionFilter, setAuditActionFilter, selectedAuditDiff, setSelectedAuditDiff,
    ticketsOverview, setTicketsOverview, ticketsList, setTicketsList,
    ticketSearchQuery, setTicketSearchQuery, ticketStatusFilter, setTicketStatusFilter,
    ticketPriorityFilter, setTicketPriorityFilter, ticketCompanyFilter, setTicketCompanyFilter,
    ticketCategoryFilter, setTicketCategoryFilter, selectedTicketInspect, setSelectedTicketInspect,
    isResolveTicketOpen, setIsResolveTicketOpen, resolveTicketForm, setResolveTicketForm,
    isCreateTicketOpen, setIsCreateTicketOpen, createTicketForm, setCreateTicketForm,
    commSubTab, setCommSubTab, announcementsList, setAnnouncementsList,
    notificationOverview, setNotificationOverview, notificationChannelsList, setNotificationChannelsList,
    announcementAcksList, setAnnouncementAcksList, announcementTypeFilter, setAnnouncementTypeFilter,
    announcementPriorityFilter, setAnnouncementPriorityFilter,
    isPublishAnnouncementOpen, setIsPublishAnnouncementOpen, publishAnnouncementForm, setPublishAnnouncementForm,
    selectedAnnouncementInspect, setSelectedAnnouncementInspect,
    isEditAnnouncementOpen, setIsEditAnnouncementOpen, editingAnnouncementForm, setEditingAnnouncementForm,
    appSubTab, setAppSubTab, appVersionsOverview, setAppVersionsOverview,
    appVersionsList, setAppVersionsList, appVersionPlatformFilter, setAppVersionPlatformFilter,
    usersOnOldVersions, setUsersOnOldVersions, isReleaseVersionOpen, setIsReleaseVersionOpen,
    newReleaseForm, setNewReleaseForm, selectedReleaseNotesInspect, setSelectedReleaseNotesInspect,
    contentSubTab, setContentSubTab, contentOverview, setContentOverview,
    contentArticlesList, setContentArticlesList, contentSearchQuery, setContentSearchQuery,
    contentCategoryFilter, setContentCategoryFilter, isCreateArticleOpen, setIsCreateArticleOpen,
    newArticleForm, setNewArticleForm, selectedArticleInspect, setSelectedArticleInspect,
    privacyPolicyData, setPrivacyPolicyData, termsConditionsData, setTermsConditionsData,
    supportInfoData, setSupportInfoData, isSavingLegalPolicy, setIsSavingLegalPolicy,
    isEditCountryOpen, setIsEditCountryOpen, editCountryForm, setEditCountryForm,
    isSavingCountry, setIsSavingCountry, isAddCountryOpen, setIsAddCountryOpen,
    fxRatesTable, setFxRatesTable, isSyncingFx, setIsSyncingFx,
    integrationsList, setIntegrationsList, apiKeysList, setApiKeysList,
    webhooksList, setWebhooksList, apiClientsList, setApiClientsList,
    failedApiRequestsList, setFailedApiRequestsList, liveApiLogsList, setLiveApiLogsList,
    dataSubTab, setDataSubTab, dataManagementOverview, setDataManagementOverview,
    dataExportsList, setDataExportsList, dataArchivesList, setDataArchivesList,
    retentionPoliciesList, setRetentionPoliciesList, dataRestoreRequestsList, setDataRestoreRequestsList,
    dataDeletionRequestsList, setDataDeletionRequestsList,
    isEmergencyConfirmOpen, setIsEmergencyConfirmOpen, pendingEmergencyAction, setPendingEmergencyAction,
    maintenanceConfig, setMaintenanceConfig, emergencyConfig, setEmergencyConfig,
    usageLimitsData, setUsageLimitsData, isEditingGlobalLimits, setIsEditingGlobalLimits, globalLimitsForm, setGlobalLimitsForm,
    configVersionsList, setConfigVersionsList, platformIncidentsList, setPlatformIncidentsList,
    dualApprovalsList, setDualApprovalsList, dataQualityIssuesList, setDataQualityIssuesList,
    fleetDevicesList, setFleetDevicesList, myAccountSubTab, setMyAccountSubTab,
    // Handlers
    handleCreateCompany, handleUpdateCompany, handleDeleteCompany,
    handleToggleTenantStatus, handleRestoreTenant, handleResetAdminPassword,
    handleAssignAdmin, handleExtendSubscription, handleImpersonate, handleEndImpersonate,
    handleUpdateUsageLimits, handleGetGlobalLimits, handleUpdateGlobalLimits,
    handleGetMaintenanceConfig, handleUpdateMaintenanceConfig,
    handleGetEmergencyConfig, handleTriggerEmergency, handleGetActivityFeed,
    handleGetPlatformUsers, handleCreatePlatformUser, handleUpdatePlatformUser,
    handleDeletePlatformUser, handleToggleUserStatus, handleResetUserPassword,
    handleResetAccount, handleForceLogout, handleToggleUserLock, handleUpdateUserPermissions,
    handleGetUserActivity, handleGetUserLoginHistory,
    handleGetCountries, handleCreateCountry, handleUpdateCountry, handleDeleteCountry,
    handleSyncFxRates, handleGetFxRatesTable, handleSyncFxRatesTable, handleSaveFxRate,
    handleGetSubscriptions, handleCreatePlan, handleUpdatePlan, handleDeletePlan,
    handleUpgradeDowngrade, handleRenewSubscription, handleConfigDates, handleProcessExpiries,
    handleGetAuditLogs, handleCreateAuditLog, handleGetSystemAlerts, handleCreateSystemAlert,
    handleDeleteSystemAlert, handleGetGlobalSettings, handleSaveGlobalSettings,
    handleGetCompanySettings, handleUpdateCompanyOverrides, handleResetCompanyOverrides,
    handleGetRoleTemplates, handleSaveRoleTemplate, handleGetPlatformAnalytics,
    handleGetSystemHealth, handleTriggerBackup, handleRetryFailedJobs, handleRunDiagnostic,
    handleLoadSystemApis, handlePingApi, handleLoadDatabaseTelemetry, handleGetTableDetails,
    handleLoadBackendLogs, handleClearLogs, handleSendTestLog,
    handleGetSecurityPolicies, handleSaveSecurityPolicies, handleGetActiveSessions,
    handleTerminateSession, handleTerminateAllSessions, handleGetSecurityAlerts, handleResolveAlert,
    handleGetDataManagement, handleGetExports, handleTriggerExport, handleGetArchives,
    handleArchiveData, handleGetRetentionPolicies, handleUpdateRetentionPolicy,
    handleGetRestoreRequests, handleSubmitRestoreRequest, handleReviewRestoreRequest,
    handleGetDeletionRequests, handleSubmitDeletionRequest, handleConfirmDeletion,
    handleGetApiManagement, handleGetApiKeys, handleGenerateApiKey, handleRevokeApiKey,
    handleGetApiClients, handleCreateApiClient, handleGetWebhooks, handleCreateWebhook,
    handleTestWebhook, handleGetFailedRequests, handleRetryFailedRequest,
    handleGetLiveApiLogs, handleGetIntegrationAccess, handleToggleIntegrationAccess,
    handleGetNotificationOverview, handleGetAnnouncements, handleCreateAnnouncement,
    handleUpdateAnnouncement, handleTogglePin, handleDeleteAnnouncement,
    handleTestDispatch, handleGetChannels, handleGetAcks, handleAcknowledge,
    handleGetAppVersions, handleReleaseVersion, handleToggleForceUpdate,
    handleDisableVersion, handleGetUsersOnOldVersions, handleSendUpgradeReminder,
    handleGetContent, handleCreateArticle, handleUpdateArticle, handleDeleteArticle,
    handleGetLegalPolicy, handleSaveLegalPolicy,
    handleGetTickets, handleCreateTicket, handleUpdateTicket, handleResolveTicket,
    handleDeleteTicket, handleGetBillingOverview, handleGetInvoices, handleGetPayments,
    handleRetryPayment, handleGetRefunds, handleProcessRefund, handleGetSubHistory,
    handleGetBillingContacts, handleUpdateBillingContact, handleGetAddons, handleAssignAddon,
    handleGetQuotas, handleGetConfigVersions, handleRollbackConfig,
    handleGetIncidents, handleCreateIncident, handleUpdateIncidentStatus,
    handleGetDualApprovals, handleRequestApproval, handleApprove,
    handleGetDataQuality, handleMergeRecords, handleGetFleetDevices, handleRemoteLogout,
    handleExportBackendLogs, fetchCompanies, loadAllData,
    getTierMonthlyRate, toLocalInputDateTime,
    handleToggleRolePermission,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Role Templates &amp; RBAC Permissions Matrix</h2>
              <p className="section-desc">Super Admin defines what each role can do across all companies and platform modules.</p>
            </div>
            {selectedRoleKey !== 'SUPER_ADMIN' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSaveRoleTemplate(selectedRoleKey)}
                disabled={isSavingRoleTemplate}
              >
                <Save size={16} /> {isSavingRoleTemplate ? 'Saving...' : `Save ${selectedRoleKey} Permissions`}
              </button>
            )}
          </div>

          {/* Strict Security Guardrail Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
            border: '1px solid #fecdd3',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <ShieldAlert size={26} color="#e11d48" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', color: '#9f1239', fontSize: '0.88rem' }}>
                Strict Platform RBAC Guardrail Active
              </div>
              <div style={{ fontSize: '0.78rem', color: '#be123c', marginTop: '2px' }}>
                Super Admin defines what each role can do. Company Admins are strictly prohibited from modifying Super Admin permissions, altering platform-wide policies, or elevating tenant roles.
              </div>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {roleTemplates.map(role => {
              const isSelected = selectedRoleKey === role.roleKey;
              const isMaster = role.roleKey === 'SUPER_ADMIN';
              return (
                <button
                  key={role.roleKey}
                  type="button"
                  className="action-pill-btn"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    background: isSelected ? (isMaster ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#0284c7') : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    borderColor: isSelected ? 'transparent' : '#cbd5e1',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={() => setSelectedRoleKey(role.roleKey)}
                >
                  {isMaster ? '👑 ' : ''}{role.roleName?.split('(')[0] || role.roleKey}
                </button>
              );
            })}
          </div>

          {/* Active Role Matrix Card */}
          {(() => {
            const activeRoleObj = roleTemplates.find(r => r.roleKey === selectedRoleKey) || roleTemplates[0];
            if (!activeRoleObj) return null;
            const perms = activeRoleObj.permissions || {};
            const isMaster = activeRoleObj.roleKey === 'SUPER_ADMIN';

            const permissionCategories = [
              {
                title: '🏢 Platform & Tenant Governance',
                items: [
                  { key: 'platform.view_all_tenants', label: 'View All Tenant Companies', desc: 'Can view full cross-company list and metrics' },
                  { key: 'platform.manage_tenants', label: 'Provision & Edit Companies', desc: 'Create, edit, suspend, or delete company accounts' },
                  { key: 'platform.global_settings', label: 'Configure Global Platform Settings', desc: 'Platform-wide date formats, timezone, and security policies' },
                  { key: 'platform.role_templates', label: 'Define Role Templates & RBAC', desc: 'Super Admin permission matrix control' },
                  { key: 'platform.emergency_killswitch', label: 'Execute Emergency Kill-Switch', desc: 'Trigger tenant lockouts and maintenance mode' },
                  { key: 'platform.manage_billing', label: 'Manage SaaS Plans & Billing', desc: 'Create plans, upgrade/downgrade tiers, and renew subscriptions' },
                  { key: 'platform.impersonate_admin', label: 'Audited Impersonation', desc: 'Login as tenant company admin for remote support' }
                ]
              },
              {
                title: '👥 User & Admin Identity Governance',
                items: [
                  { key: 'users.create_admin', label: 'Create Company Admins', desc: 'Provision executive administrator accounts' },
                  { key: 'users.edit_admin', label: 'Edit Admin Profiles & Territories', desc: 'Modify names, contact info, and territory assignments' },
                  { key: 'users.toggle_status', label: 'Activate / Deactivate Accounts', desc: 'Toggle user active/inactive status' },
                  { key: 'users.reset_password', label: 'Reset User Passwords', desc: 'Generate secure temporary password credentials' },
                  { key: 'users.force_logout', label: 'Force Session Logout', desc: 'Revoke active JWT tokens instantly across devices' },
                  { key: 'users.lock_unlock', label: 'Lock / Unlock Accounts', desc: 'Lock compromised accounts with audit reasons' },
                  { key: 'users.change_permissions', label: 'Modify User Permissions', desc: 'Grant or revoke functional feature flags' }
                ]
              },
              {
                title: '💊 Pharma Sales & Field Operations',
                items: [
                  { key: 'catalog.manage', label: 'Manage Product Catalog & Pricing', desc: 'Create and update pharmaceutical SKU catalog' },
                  { key: 'doctors.manage', label: 'Manage Healthcare Professionals (Doctors)', desc: 'Register doctors, clinic locations, and specialties' },
                  { key: 'chemists.manage', label: 'Manage Chemists & Pharmacies', desc: 'Maintain pharmacy list and drug license registries' },
                  { key: 'dcr.view_all', label: 'Review & Approve Daily Call Reports (DCR)', desc: 'Inspect MR call logs, samples given, and feedback' },
                  { key: 'orders.view_all', label: 'Review & Approve Booking Orders (POB)', desc: 'Process chemist orders and stockist dispatches' },
                  { key: 'field_tracking.view_live', label: 'Live GPS Field Tracking & Telemetry', desc: 'Monitor field MR real-time routes and pings' }
                ]
              },
              {
                title: '🔒 Audit, Security & Compliance',
                items: [
                  { key: 'platform.view_audit_logs', label: 'Inspect Immutable Platform Audit Logs', desc: 'Full timestamped audit trail of all actions' },
                  { key: 'users.view_login_history', label: 'View Admin Login History & IP Geolocation', desc: 'Device fingerprint and security history logs' },
                  { key: 'export.download_reports', label: 'Export Data & Compliance Reports', desc: 'Download CSV and Excel operational data' }
                ]
              }
            ];

            return (
              <div className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div>
                    <h3 className="card-header-title" style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                      {activeRoleObj.roleName}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                      {activeRoleObj.description}
                    </p>
                  </div>
                  {isMaster ? (
                    <span className="status-tag" style={{ background: '#fef3c7', color: '#92400e', fontWeight: '800', border: '1px solid #fde68a' }}>
                      🔒 Master Role - Immutable Platform Authority
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSaveRoleTemplate(activeRoleObj.roleKey)}
                      disabled={isSavingRoleTemplate}
                    >
                      <Save size={15} /> {isSavingRoleTemplate ? 'Saving...' : 'Save Permissions'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                  {permissionCategories.map((cat, cIdx) => (
                    <div key={cIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
                        {cat.title}
                      </h4>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {cat.items.map(item => {
                          const isAllowed = isMaster ? true : Boolean(perms[item.key]);
                          const isSuperAdminOnlyControl = item.key.startsWith('platform.') && activeRoleObj.roleKey !== 'SUPER_ADMIN';

                          return (
                            <div
                              key={item.key}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px'
                              }}
                            >
                              <div style={{ paddingRight: '12px' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>
                                  {item.label}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                                  {item.desc}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isMaster || isSuperAdminOnlyControl}
                                onClick={() => handleToggleRolePermission(activeRoleObj.roleKey, item.key)}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '16px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  border: 'none',
                                  cursor: (isMaster || isSuperAdminOnlyControl) ? 'not-allowed' : 'pointer',
                                  background: isAllowed ? '#10b981' : '#e2e8f0',
                                  color: isAllowed ? '#ffffff' : '#64748b',
                                  minWidth: '70px',
                                  textAlign: 'center',
                                  opacity: isSuperAdminOnlyControl ? 0.6 : 1
                                }}
                                title={isSuperAdminOnlyControl ? 'Super Admin only control - Company Admin restricted' : ''}
                              >
                                {isAllowed ? 'ALLOWED' : 'DENIED'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
  );
}
