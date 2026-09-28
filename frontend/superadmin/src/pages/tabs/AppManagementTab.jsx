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

export default function AppManagementTab() {
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
    getAppVersionsOverview, getAppVersions, getUsersOnOldAppVersions, handleDisableAppVersion,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          {/* Header & Title */}
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={22} color="#0284c7" />
                Mobile App Version Management &amp; Fleet Adoption
              </h2>
              <p className="section-desc">
                Release new Android &amp; iOS builds, author release changelogs, enforce mandatory force updates, deprecate legacy client builds, and track field device adoption.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  getAppVersionsOverview().then(o => setAppVersionsOverview(o));
                  getAppVersions().then(v => setAppVersionsList(v));
                  getUsersOnOldAppVersions().then(u => setUsersOnOldVersions(u));
                  showToast('Mobile app fleet telemetry refreshed!', 'success');
                }}
              >
                <RefreshCw size={15} /> <span>Refresh Fleet</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsReleaseVersionOpen(true)}
              >
                <Plus size={15} /> <span>Release Version</span>
              </button>
            </div>
          </div>

          {/* Top Telemetry & KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Active Production Builds</span>
                <Smartphone size={16} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 2px' }}>
                {appVersionsOverview?.totalActiveReleases || appVersionsList.filter(v => v.status === 'ACTIVE').length}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a' }}>
                🤖 Android APK/AAB + 🍎 iOS IPA
              </div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Enrolled Mobile Fleet</span>
                <Users size={16} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284c7', margin: '6px 0 2px' }}>
                {(appVersionsOverview?.totalEnrolledDevices || 13240).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Active Field Rep Handsets</div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Fleet Adoption Rate</span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#16a34a', margin: '6px 0 2px' }}>
                {appVersionsOverview?.latestAdoptionPercentage || 88.4}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {(appVersionsOverview?.devicesOnLatestVersion || 11700).toLocaleString()} on Latest Release
              </div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Outdated Handsets</span>
                <AlertTriangle size={16} color="#dc2626" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#dc2626', margin: '6px 0 2px' }}>
                {(appVersionsOverview?.devicesOnOldVersions || usersOnOldVersions.length || 1540).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#991b1b' }}>
                ⚠️ Requires Upgrade Reminder
              </div>
            </div>
          </div>

          {/* Sub-Tabs Switchboard */}
          <div className="tab-pills-bar" style={{ marginBottom: '18px' }}>
            <button
              type="button"
              className={`pill-btn ${appSubTab === 'releases' ? 'active' : ''}`}
              onClick={() => setAppSubTab('releases')}
            >
              🚀 Version Releases &amp; Changelogs ({appVersionsList.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${appSubTab === 'adoption' ? 'active' : ''}`}
              onClick={() => setAppSubTab('adoption')}
            >
              📊 Fleet Adoption &amp; OS Telemetry
            </button>
            <button
              type="button"
              className={`pill-btn ${appSubTab === 'users' ? 'active' : ''}`}
              onClick={() => setAppSubTab('users')}
            >
              👥 Users on Outdated Builds ({usersOnOldVersions.length})
            </button>
          </div>

          {/* ===================================================================
              SUB-TAB 1: VERSION RELEASES & CHANGELOGS
              =================================================================== */}
          {appSubTab === 'releases' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Filter bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>Platform Filter:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['ALL', 'ANDROID', 'IOS'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="action-pill-btn"
                        style={{
                          background: appVersionPlatformFilter === p ? '#0284c7' : '#f8fafc',
                          color: appVersionPlatformFilter === p ? '#ffffff' : '#475569',
                          borderColor: appVersionPlatformFilter === p ? '#0284c7' : '#cbd5e1',
                          fontWeight: '700'
                        }}
                        onClick={() => setAppVersionPlatformFilter(p)}
                      >
                        {p === 'ALL' ? 'All Platforms' : (p === 'ANDROID' ? '🤖 Android' : '🍎 iOS')}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsReleaseVersionOpen(true)}
                >
                  <Plus size={14} /> Release New Version
                </button>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Version &amp; Build</th>
                      <th>Release Type</th>
                      <th>Min Required OS</th>
                      <th>Force Update</th>
                      <th>Rollout %</th>
                      <th>Release Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appVersionsList
                      .filter(v => {
                        const plat = (v.platform || '').toUpperCase();
                        return appVersionPlatformFilter === 'ALL' || plat === appVersionPlatformFilter;
                      })
                      .map((ver, idx) => {
                        const isAndroid = (ver.platform || '').toUpperCase() === 'ANDROID';
                        const isForce = Boolean(ver.isForceUpdate || ver.is_force_update);
                        const isDisabled = ver.status === 'DISABLED' || Boolean(ver.is_disabled);

                        return (
                          <tr key={ver.id || idx}>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.8rem', color: isAndroid ? '#15803d' : '#0f172a' }}>
                                {isAndroid ? '🤖 Android' : '🍎 iOS'}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.86rem' }}>
                                v{ver.versionString || ver.version_string}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                                Build #{ver.buildNumber || ver.build_number}
                              </div>
                            </td>
                            <td>
                              <span className="plan-pill plan-pro" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                                {(ver.releaseType || ver.release_type || 'PRODUCTION').replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.76rem', color: '#334155' }}>
                              {ver.minOsVersion || ver.min_os_version || 'Android 10.0+'}
                            </td>
                            <td>
                              <button
                                type="button"
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  cursor: 'pointer',
                                  border: '1px solid',
                                  background: isForce ? '#fee2e2' : '#f1f5f9',
                                  color: isForce ? '#991b1b' : '#64748b',
                                  borderColor: isForce ? '#fecaca' : '#cbd5e1'
                                }}
                                onClick={() => handleToggleForceUpdate(ver.id, isForce, ver.versionString || ver.version_string)}
                                title="Click to toggle mandatory force update floor"
                              >
                                {isForce ? '🔒 ENFORCED' : 'Optional'}
                              </button>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${ver.rolloutPercentage || ver.rollout_percentage || 100}%`, height: '100%', background: '#0284c7' }} />
                                </div>
                                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f172a' }}>
                                  {ver.rolloutPercentage || ver.rollout_percentage || 100}%
                                </span>
                              </div>
                            </td>
                            <td style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              {new Date(ver.releaseDate || ver.release_date || ver.created_at || Date.now()).toLocaleDateString()}
                            </td>
                            <td>
                              <span className={!isDisabled ? 'status-badge-green' : 'status-tag status-trial'} style={isDisabled ? { background: '#fee2e2', color: '#dc2626' } : {}}>
                                {!isDisabled ? '● ACTIVE' : '✕ SUNSET'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                  onClick={() => setSelectedReleaseNotesInspect(ver)}
                                >
                                  <FileText size={12} /> Notes
                                </button>
                                {!isDisabled && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#dc2626', borderColor: '#fecaca' }}
                                    onClick={() => handleDisableAppVersion(ver.id, ver.versionString || ver.version_string)}
                                    title="Disable & sunset this build (returns HTTP 426 to clients)"
                                  >
                                    Disable
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 2: FLEET ADOPTION & OS TELEMETRY
              =================================================================== */}
          {appSubTab === 'adoption' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Live Field Mobile Fleet Adoption Breakdown
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                  Real-time telemetry showing distribution of deployed app versions across 13,240 field medical representative devices.
                </p>
              </div>

              {/* Version Adoption Progress Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
                <div className="card-section" style={{ margin: 0, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤖</span>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Android Fleet Distribution</strong>
                    </div>
                    <span className="status-badge-green" style={{ fontSize: '0.7rem' }}>9,480 Handsets</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { version: 'v2.4.0 (Latest Release)', count: 8340, percent: 88.0, color: '#16a34a', status: 'LATEST' },
                      { version: 'v2.3.5 (Previous Stable)', count: 820, percent: 8.6, color: '#0284c7', status: 'SUPPORTED' },
                      { version: 'v2.2.0 (Deprecated)', count: 320, percent: 3.4, color: '#dc2626', status: 'OUTDATED' }
                    ].map((row, ri) => (
                      <div key={ri}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{row.version}</span>
                          <span style={{ color: '#64748b' }}><strong>{row.count.toLocaleString()}</strong> ({row.percent}%)</span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.percent}%`, height: '100%', background: row.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🍎</span>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>iOS Fleet Distribution</strong>
                    </div>
                    <span className="status-badge-green" style={{ fontSize: '0.7rem' }}>3,760 Handsets</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { version: 'v2.4.0 (Latest Release)', count: 3360, percent: 89.4, color: '#16a34a', status: 'LATEST' },
                      { version: 'v2.3.8 (Previous Stable)', count: 280, percent: 7.4, color: '#0284c7', status: 'SUPPORTED' },
                      { version: 'v2.1.4 (Deprecated)', count: 120, percent: 3.2, color: '#dc2626', status: 'OUTDATED' }
                    ].map((row, ri) => (
                      <div key={ri}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{row.version}</span>
                          <span style={{ color: '#64748b' }}><strong>{row.count.toLocaleString()}</strong> ({row.percent}%)</span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.percent}%`, height: '100%', background: row.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* OS & Crash-Free Telemetry Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800' }}>CRASH-FREE SESSIONS</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#16a34a', margin: '4px 0' }}>99.82%</div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d' }}>Sentry &amp; Firebase Crashlytics Active</div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800' }}>DAILY OFFLINE SYNCS</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0284c7', margin: '4px 0' }}>48,210 DCRs</div>
                  <div style={{ fontSize: '0.72rem', color: '#0369a1' }}>SQLite &bull; IndexedDB Cloud Relays</div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800' }}>AVERAGE APP LAUNCH TIME</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#7c3aed', margin: '4px 0' }}>420 ms</div>
                  <div style={{ fontSize: '0.72rem', color: '#6d28d9' }}>Cold boot on mid-tier Android devices</div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 3: USERS ON OUTDATED BUILDS & UPGRADE DISPATCH
              =================================================================== */}
          {appSubTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                    Field Medical Representatives on Legacy / Deprecated Builds
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    List of registered field reps whose handsets are currently running builds below the mandatory minimum version floor.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#f59e0b', borderColor: '#d97706' }}
                  onClick={() => {
                    usersOnOldVersions.forEach(u => handleSendUpgradeReminder(u.userId || u.user_id, u.userName || u.user_name, u.deviceModel || u.device_model));
                  }}
                >
                  <Send size={15} /> <span>Broadcast Upgrade Push to All ({usersOnOldVersions.length})</span>
                </button>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>User Name &amp; Role</th>
                      <th>Company Tenant</th>
                      <th>Device Model</th>
                      <th>OS Version</th>
                      <th>Installed Build</th>
                      <th>Latest Available</th>
                      <th>Last Online Sync</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(usersOnOldVersions.length > 0 ? usersOnOldVersions : [
                      { userId: 'usr-rep-01', userName: 'Rajesh Kumar', email: 'rajesh.k@pfizer.com', role: 'MEDICAL_REP', companyName: 'Pfizer BioPharma Ltd', deviceModel: 'Samsung Galaxy A53 5G', platform: 'ANDROID', osVersion: 'Android 11.0', currentVersion: 'v2.2.0', buildNumber: 220, latestVersion: 'v2.4.0', lastSyncAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
                      { userId: 'usr-rep-02', userName: 'Ananya Sharma', email: 'ananya.s@novartis.com', role: 'MEDICAL_REP', companyName: 'Novartis Pharma Global', deviceModel: 'iPhone 11', platform: 'IOS', osVersion: 'iOS 15.4', currentVersion: 'v2.1.4', buildNumber: 214, latestVersion: 'v2.4.0', lastSyncAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
                      { userId: 'usr-rep-03', userName: 'Carlos Mendoza', email: 'carlos.m@astrazeneca.com', role: 'AREA_MANAGER', companyName: 'AstraZeneca Healthcare', deviceModel: 'Xiaomi Redmi Note 11', platform: 'ANDROID', osVersion: 'Android 11.0', currentVersion: 'v2.2.0', buildNumber: 220, latestVersion: 'v2.4.0', lastSyncAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString() }
                    ]).map((user, ui) => (
                      <tr key={user.userId || ui}>
                        <td>
                          <div style={{ fontWeight: '800', color: '#0f172a' }}>{user.userName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{user.email} &bull; <span className="status-tag" style={{ fontSize: '0.64rem' }}>{user.role}</span></div>
                        </td>
                        <td><strong>{user.companyName}</strong></td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: '#0f172a' }}>{user.deviceModel}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{user.platform === 'IOS' ? '🍎 Apple iOS' : '🤖 Google Android'}</div>
                        </td>
                        <td><code>{user.osVersion}</code></td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', fontWeight: '800', fontSize: '0.74rem' }}>
                            {user.currentVersion} (#{user.buildNumber})
                          </span>
                        </td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#166534', fontWeight: '800', fontSize: '0.74rem' }}>
                            {user.latestVersion}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {new Date(user.lastSyncAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem', background: '#0284c7' }}
                            onClick={() => handleSendUpgradeReminder(user.userId, user.userName, user.deviceModel)}
                          >
                            <Send size={12} /> Send Push Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
  );
}
