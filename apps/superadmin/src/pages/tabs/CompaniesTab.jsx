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

export default function CompaniesTab() {
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
    companySubTab, setCompanySubTab, setImpersonateTarget, setIsImpersonateOpen, handleOpenResetUserPassword, handleOpenDeleteUser, handleViewCompany, handleOpenEditCompany, handleOpenSubscriptionModal, handleOpenExtendSubscription, setAdminManagerTenant, handleOpenResetAdminPassword, handleImpersonateCompany, handleSetCompanyStatus, handleRestoreCompany, handleOpenDeleteCompany,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${companySubTab === 'all' ? 'active' : ''}`} onClick={() => setCompanySubTab('all')}>
              All Pharma Companies ({companies.length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'active' ? 'active' : ''}`} onClick={() => setCompanySubTab('active')}>
              🟢 Active ({companies.filter(c => c.status === 'ACTIVE').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'trial' ? 'active' : ''}`} onClick={() => setCompanySubTab('trial')}>
              🟣 Trials &amp; Demos ({companies.filter(c => c.status === 'TRIAL' || c.plan === 'FREE_TRIAL').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'suspended' ? 'active' : ''}`} onClick={() => setCompanySubTab('suspended')}>
              🟡 Suspended ({companies.filter(c => c.status === 'SUSPENDED').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'deactivated' ? 'active' : ''}`} onClick={() => setCompanySubTab('deactivated')}>
              ⚪ Deactivated ({companies.filter(c => c.status === 'DEACTIVATED' || c.status === 'INACTIVE').length})
            </button>
            <button type="button" className={`sub-nav-pill ${companySubTab === 'admins' ? 'active' : ''}`} onClick={() => setCompanySubTab('admins')}>
              🛡️ Company Admins ({admins.length})
            </button>
          </div>

          <div className="pane-action-bar">
            <div className="search-box-large">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by company name, jurisdiction, code..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setIsCreateCompanyOpen(true)}>
              <Plus size={16} /> Create / Provision Tenant
            </button>
          </div>

          {companySubTab === 'admins' ? (
            <div className="saas-table-container">
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Admin Name &amp; Email</th>
                    <th>Assigned Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(adm => (
                    <tr key={adm.id}>
                      <td>
                        <div className="admin-profile-cell">
                          <div className="admin-avatar">{adm.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="admin-name">{adm.name}</div>
                            <div className="admin-email">{adm.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{adm.company}</strong></td>
                      <td><span className="plan-pill plan-pro">{adm.role}</span></td>
                      <td><span className="status-tag status-active">{adm.status}</span></td>
                      <td>{adm.lastLogin}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cluster">
                          <button
                            type="button"
                            className="action-pill-btn"
                            style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                            onClick={() => {
                              setImpersonateTarget(adm);
                              setIsImpersonateOpen(true);
                            }}
                          >
                            <Eye size={13} /> Impersonate
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn"
                            onClick={() => handleOpenResetUserPassword(adm)}
                          >
                            Reset Pwd
                          </button>
                          <button
                            type="button"
                            className="action-pill-btn red"
                            onClick={() => handleOpenDeleteUser(adm)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="saas-table-container">
              {companies.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <Building2 size={40} color="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#1e293b' }}>No Companies Enrolled Yet</div>
                  <p style={{ fontSize: '0.84rem', margin: '6px auto 0', color: '#64748b' }}>
                    Click "Create / Provision Tenant" above to onboard your first organization.
                  </p>
                </div>
              ) : (
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company &amp; Code</th>
                      <th>Country</th>
                      <th>Plan Tier</th>
                      <th>Total Users</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Start &amp; End Period</th>
                      <th style={{ textAlign: 'right' }}>Super Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(c => {
                        if (companySubTab === 'all') return true;
                        if (companySubTab === 'active') return c.status === 'ACTIVE';
                        if (companySubTab === 'trial') return c.status === 'TRIAL' || c.plan === 'FREE_TRIAL';
                        if (companySubTab === 'suspended') return c.status === 'SUSPENDED';
                        if (companySubTab === 'deactivated') return c.status === 'DEACTIVATED' || c.status === 'INACTIVE';
                        return true;
                      })
                      .filter(c =>
                        c.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
                        c.country.toLowerCase().includes(globalSearchQuery.toLowerCase())
                      )
                      .map((company) => (
                        <tr key={company.id}>
                          <td>
                            <div className="comp-name-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {company.logoUrl ? (
                                <img
                                  src={company.logoUrl}
                                  alt={company.name}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    objectFit: 'contain',
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    padding: '2px',
                                    flexShrink: 0
                                  }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <span className="comp-flag">{company.flag}</span>
                              )}
                              <div>
                                <div className="comp-name-text">{company.name}</div>
                                <div className="comp-code-sub">{company.code}</div>
                              </div>
                            </div>
                          </td>
                          <td><strong>{company.country}</strong></td>
                          <td><span className={`plan-pill plan-${company.plan.toLowerCase()}`}>{company.plan}</span></td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: '#1e293b' }}>
                              <Users size={14} color="#6366f1" /> {company.usersCount || company.user_count || 0} Users
                            </span>
                          </td>
                          <td><strong>{company.mrr}</strong></td>
                          <td>
                            <span className={`status-tag status-${company.status.toLowerCase()}`}>
                              {company.status === 'ACTIVE' ? '🟢 Active' : company.status === 'TRIAL' ? '🟣 Trial' : company.status === 'SUSPENDED' ? '🟡 Suspended' : '⚪ Deactivated'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.74rem', color: '#334155' }}>
                            <div>Expires: <strong>{company.renewalDate}</strong></div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cluster">
                              {/* 1. View Company */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleViewCompany(company)}
                                title="View Company Profile & Telemetry"
                              >
                                <Eye size={12} /> View
                              </button>

                              {/* 2. Edit Company */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenEditCompany(company)}
                                title="Edit Company Details"
                              >
                                <Edit size={12} /> Edit
                              </button>

                              {/* 3. Change Subscription */}
                              <button
                                type="button"
                                className="action-pill-btn primary"
                                onClick={() => handleOpenSubscriptionModal(company)}
                                title="Change Subscription Plan & Pricing"
                              >
                                <CreditCard size={12} /> Plan
                              </button>

                              {/* 4. Extend Subscription */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenExtendSubscription(company)}
                                title="Extend Trial / Subscription Duration"
                              >
                                <CalendarPlus size={12} /> Extend
                              </button>

                              {/* 5. Manage Tenant Admins — opens full Admin Manager Panel */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => setAdminManagerTenant({ id: company.id, name: company.name, logo_url: company.logoUrl, country_code: company.countryCode })}
                                title="Manage Admin Accounts for this Tenant"
                                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(14,165,233,0.15))', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.35)' }}
                              >
                                <UserCog size={12} /> Manage Admins
                              </button>

                              {/* 6. Reset Admin Password */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                onClick={() => handleOpenResetAdminPassword(company)}
                                title="Reset Company Admin Password"
                              >
                                <Key size={12} /> Pwd
                              </button>

                              {/* 7. Impersonate Admin */}
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                onClick={() => handleImpersonateCompany(company)}
                                title="Impersonate / Login as Company Admin"
                              >
                                <ShieldCheck size={12} /> Login
                              </button>

                              {/* 8. Activate / Suspend / Deactivate / Restore Status Controls */}
                              {company.status === 'ACTIVE' && (
                                <>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#b45309' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'SUSPENDED', company.name)}
                                    title="Suspend Company Tenant"
                                  >
                                    <StopCircle size={12} /> Suspend
                                  </button>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#64748b' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'DEACTIVATED', company.name)}
                                    title="Deactivate Company Tenant"
                                  >
                                    Deactivate
                                  </button>
                                </>
                              )}

                              {company.status === 'SUSPENDED' && (
                                <>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#16a34a' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'ACTIVE', company.name)}
                                    title="Activate Company Tenant"
                                  >
                                    <PlayCircle size={12} /> Activate
                                  </button>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    style={{ color: '#64748b' }}
                                    onClick={() => handleSetCompanyStatus(company.id, 'DEACTIVATED', company.name)}
                                    title="Deactivate Company Tenant"
                                  >
                                    Deactivate
                                  </button>
                                </>
                              )}

                              {(company.status === 'DEACTIVATED' || company.status === 'INACTIVE') && (
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#16a34a', borderColor: '#86efac', background: '#f0fdf4' }}
                                  onClick={() => handleRestoreCompany(company.id, company.name)}
                                  title="Restore Company Tenant to Active Status"
                                >
                                  <RotateCcw size={12} /> Restore
                                </button>
                              )}

                              {/* 9. Permanent Purge / Delete */}
                              <button
                                type="button"
                                className="action-pill-btn red"
                                onClick={() => handleOpenDeleteCompany(company)}
                                title="Permanently Delete Tenant"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
  );
}
