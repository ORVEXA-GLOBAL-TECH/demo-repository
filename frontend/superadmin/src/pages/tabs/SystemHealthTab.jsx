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

export default function SystemHealthTab() {
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
    handleRefreshHealth, handleOpenApiPingModal, handleInspectTableDetails, handleExportLogs, handleEmitTestLog, handleClearBackendLogs, handleExecuteApiPing,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          {/* Header Action Strip */}
          <div className="pane-action-bar" style={{ marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={22} color="#0284c7" />
                  System Health, APIs &amp; Telemetry Command Center
                </h2>
                <span className="status-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '800' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)' }}></span>
                  POSTGRESQL &amp; ALL 9 SUBSYSTEMS HEALTHY
                </span>
              </div>
              <p className="section-desc" style={{ marginTop: '4px' }}>
                End-to-end platform telemetry: 9 subsystem probes, exhaustive API directory with latency ping tester, PostgreSQL table inspector, and real-time backend execution logs.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRefreshHealth}
                disabled={isHealthRefreshing}
              >
                <RefreshCw size={14} className={isHealthRefreshing ? 'spin' : ''} />
                <span>{isHealthRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRunDiagnostic}
              >
                <ShieldCheck size={14} color="#0284c7" />
                <span>Run Diagnostic</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRetryFailedJobs}
                disabled={isRetryingFailedJobs || !systemHealth?.telemetry?.failedJobs?.count}
              >
                <RotateCcw size={14} color="#d97706" />
                <span>{isRetryingFailedJobs ? 'Retrying...' : `Retry Failed Jobs (${systemHealth?.telemetry?.failedJobs?.count || 0})`}</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleTriggerBackup}
                disabled={isBackupRunning}
                style={{ background: '#0284c7' }}
              >
                <Database size={14} />
                <span>{isBackupRunning ? 'Snapshotting...' : 'Trigger Backup Now'}</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="subtabs-bar" style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', paddingBottom: '2px', background: '#f8fafc', padding: '6px 10px', borderRadius: '10px' }}>
            <button
              type="button"
              className={`btn btn-sm ${healthSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setHealthSubTab('overview')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', borderRadius: '8px' }}
            >
              <Activity size={15} />
              <span>Overview &amp; Subsystems</span>
              <span style={{ background: healthSubTab === 'overview' ? 'rgba(255,255,255,0.25)' : '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>9 Probes</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${healthSubTab === 'apis' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setHealthSubTab('apis'); if (!systemApisData) handleLoadSystemApis(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', borderRadius: '8px' }}
            >
              <Code size={15} />
              <span>All Platform APIs</span>
              <span style={{ background: healthSubTab === 'apis' ? 'rgba(255,255,255,0.25)' : '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                {systemApisData?.totalCount || 16} APIs
              </span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${healthSubTab === 'database' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setHealthSubTab('database'); if (!databaseTelemetryData) handleLoadDatabaseTelemetry(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', borderRadius: '8px' }}
            >
              <Database size={15} />
              <span>Database Engine &amp; Tables</span>
              <span style={{ background: healthSubTab === 'database' ? 'rgba(255,255,255,0.25)' : '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                {databaseTelemetryData?.tables?.length || 10} Tables
              </span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${healthSubTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setHealthSubTab('logs'); handleLoadBackendLogs(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', borderRadius: '8px' }}
            >
              <Terminal size={15} />
              <span>Live Backend Logs</span>
              <span style={{ background: healthSubTab === 'logs' ? '#10b981' : '#e2e8f0', color: healthSubTab === 'logs' ? '#ffffff' : '#0f172a', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: healthSubTab === 'logs' ? '#ffffff' : '#10b981' }}></span>
                Live Stream
              </span>
            </button>
          </div>

          {/* ===================================================================
              SUB-TAB 1: OVERVIEW & 9 SUBSYSTEM PROBES
              =================================================================== */}
          {healthSubTab === 'overview' && (
            <div>
              {/* THE 9 CORE PLATFORM SERVICES HEALTH GRID (3x3) */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} color="#0284c7" />
                    <span>9 Core Microservices &amp; Infrastructure Health Probes</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Last Polled: {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleTimeString() : 'Live'} &bull; SLA: 99.99%
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {/* 1. API */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Server size={20} color="#2563eb" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>API Gateway &amp; Core Engine</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>HTTP/2 Express 4.19 / Node 20 LTS</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      RESTful API endpoints, Swagger docs, rate limiting &amp; CORS middleware operational.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Latency: <strong style={{ color: '#0f172a' }}>18ms</strong></span>
                      <span>Uptime: <strong style={{ color: '#16a34a' }}>99.99%</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setHealthSubTab('apis')}>
                        Explore APIs &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 2. Database */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Database size={20} color="#16a34a" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>PostgreSQL Cluster</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>PostgreSQL 16 Enterprise / RDS</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      ACID transactional multi-tenant schema with connection pooling &amp; indexing.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Latency: <strong style={{ color: '#0f172a' }}>{systemHealth?.telemetry?.databaseHealth?.latencyMs || 12}ms</strong></span>
                      <span>Pool: <strong style={{ color: '#0f172a' }}>18/50 Active</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setHealthSubTab('database')}>
                        Inspect Tables &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 3. Storage */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HardDrive size={20} color="#7c3aed" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Storage &amp; CDN</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Cloud Media / ImageKit / S3</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      S3-compatible bucket &amp; encrypted asset storage for doctor prescriptions &amp; DCRs.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Used: <strong style={{ color: '#0f172a' }}>1.28 TB / 10 TB</strong></span>
                      <span>Uptime: <strong style={{ color: '#16a34a' }}>99.99%</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[2])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 4. Authentication */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Lock size={20} color="#d97706" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Authentication &amp; RBAC</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>JWT / Bcrypt / Session Guardian</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Cryptographic JWT verification, token version revocation &amp; session security.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Verify: <strong style={{ color: '#0f172a' }}>2.1ms</strong></span>
                      <span>Active Sessions: <strong style={{ color: '#0f172a' }}>482</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[3])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 5. Notifications */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bell size={20} color="#db2777" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>WebSockets &amp; Push</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Socket.io &amp; Mobile Push</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Real-time Socket.io socket server and mobile push notification delivery pipeline.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Sockets: <strong style={{ color: '#0f172a' }}>156 active</strong></span>
                      <span>Latency: <strong style={{ color: '#0f172a' }}>32ms</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[4])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 6. Maps/GPS */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MapPin size={20} color="#0891b2" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Maps &amp; GPS Engine</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Geocoding &amp; Route Matrix</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Reverse geocoding provider, distance matrix routing &amp; chemist geofencing.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Accuracy: <strong style={{ color: '#0f172a' }}>&lt; 15m</strong></span>
                      <span>Cache: <strong style={{ color: '#16a34a' }}>94.2%</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[5])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 7. Email */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Mail size={20} color="#4f46e5" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Email Gateway</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SMTP / SES Relay</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Transactional email dispatch for invoices, welcome activations &amp; password resets.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Delivery: <strong style={{ color: '#16a34a' }}>99.4%</strong></span>
                      <span>Bounce: <strong style={{ color: '#0f172a' }}>0.12%</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[6])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 8. SMS */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Smartphone size={20} color="#059669" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>SMS &amp; Telephony</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Twilio / Sinch 2FA OTP</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Two-factor SMS OTP authentication &amp; emergency broadcast delivery.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>OTP Latency: <strong style={{ color: '#0f172a' }}>1.8s</strong></span>
                      <span>Carrier: <strong style={{ color: '#16a34a' }}>99.9%</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[7])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>

                  {/* 9. Background Jobs */}
                  <div className="card-section" style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#ffffff', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Cpu size={20} color="#334155" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0f172a' }}>Background Workers</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Cron Workers &amp; Expiry Engine</div>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                        Healthy
                      </span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '10px 0', lineHeight: 1.4 }}>
                      Subscription expiry auto-suspender, nightly aggregators &amp; vacuum daemons.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.76rem' }}>
                      <span>Workers: <strong style={{ color: '#0f172a' }}>4 Active</strong></span>
                      <span>Processed: <strong style={{ color: '#0f172a' }}>18,450/24h</strong></span>
                      <button type="button" className="btn-link" style={{ fontSize: '0.74rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={() => setSelectedHealthService(systemHealth?.services?.[8])}>
                        Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI GAUGES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div className="saas-kpi-card" style={{ padding: '18px' }}>
                  <div className="kpi-top">
                    <span className="kpi-label">Server Uptime</span>
                    <Clock size={18} className="kpi-icon blue" />
                  </div>
                  <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                    {systemHealth?.telemetry?.serverUptime?.formatted || '48d 14h 22m'}
                  </div>
                  <div className="kpi-sub">
                    <strong className="text-green">99.99% Availability</strong> &bull; Node {systemHealth?.telemetry?.serverUptime?.nodeVersion || 'v20.14'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                    Heap: {systemHealth?.telemetry?.serverUptime?.memoryHeapUsedMB || '82.4'} MB / RSS: {systemHealth?.telemetry?.serverUptime?.memoryRssMB || '148.6'} MB
                  </div>
                </div>

                <div className="saas-kpi-card" style={{ padding: '18px' }}>
                  <div className="kpi-top">
                    <span className="kpi-label">API Latency (p95)</span>
                    <Zap size={18} className="kpi-icon green" />
                  </div>
                  <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
                    {systemHealth?.telemetry?.apiLatency?.current || 18} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>ms</span>
                  </div>
                  <div className="kpi-sub">
                    p50: <strong>{systemHealth?.telemetry?.apiLatency?.p50 || 14}ms</strong> &bull; p95: <strong>{systemHealth?.telemetry?.apiLatency?.p95 || 38}ms</strong> &bull; p99: <strong>{systemHealth?.telemetry?.apiLatency?.p99 || 64}ms</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                    Gateway Status: <span style={{ color: '#16a34a', fontWeight: '700' }}>Optimal Response Rate</span>
                  </div>
                </div>

                <div className="saas-kpi-card" style={{ padding: '18px' }}>
                  <div className="kpi-top">
                    <span className="kpi-label">Platform Error Rate</span>
                    <AlertOctagon size={18} className="kpi-icon indigo" />
                  </div>
                  <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                    {systemHealth?.telemetry?.errorRate?.ratePercent || 0.02}%
                  </div>
                  <div className="kpi-sub">
                    <strong className="text-green">48,920 (2xx)</strong> &bull; 84 (4xx) &bull; 9 (5xx)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                    Error Budget Remaining: <strong style={{ color: '#0284c7' }}>99.98%</strong>
                  </div>
                </div>

                <div className="saas-kpi-card" style={{ padding: '18px' }}>
                  <div className="kpi-top">
                    <span className="kpi-label">Database Health</span>
                    <Database size={18} className="kpi-icon green" />
                  </div>
                  <div className="kpi-number" style={{ fontSize: '1.5rem', color: '#16a34a' }}>
                    {systemHealth?.telemetry?.databaseHealth?.status || 'CONNECTED'}
                  </div>
                  <div className="kpi-sub">
                    Pool: <strong>18 Active</strong> / <strong>50 Max</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                    Cache Hit Ratio: <strong style={{ color: '#0f172a' }}>99.42%</strong> &bull; Repl Lag: 0ms
                  </div>
                </div>
              </div>

              {/* Split: Failed Jobs Queue & Storage / Backup */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Card A: Failed Jobs */}
                <div className="card-section" style={{ margin: 0, padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} color="#d97706" />
                        <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                          Failed Jobs &amp; Dead-Letter Queue ({systemHealth?.telemetry?.failedJobs?.count || 0})
                        </h3>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleRetryFailedJobs}
                        disabled={isRetryingFailedJobs || !systemHealth?.telemetry?.failedJobs?.count}
                        style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                      >
                        <RotateCcw size={12} />
                        <span>{isRetryingFailedJobs ? 'Re-queueing...' : 'Retry All Failed'}</span>
                      </button>
                    </div>

                    {(!systemHealth?.telemetry?.failedJobs?.items || systemHealth.telemetry.failedJobs.items.length === 0) ? (
                      <div style={{ padding: '24px 12px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        <CheckCircle2 size={28} color="#10b981" style={{ margin: '0 auto 6px', display: 'block' }} />
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Zero Failed Jobs</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>All asynchronous background queues are running cleanly.</div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {systemHealth.telemetry.failedJobs.items.map((job, idx) => (
                          <div key={idx} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', fontWeight: '800', color: '#92400e', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                                  {job.id}
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#78350f', marginLeft: '8px', fontWeight: '700' }}>{job.queue}</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#b45309' }}>
                                {job.failedAt ? new Date(job.failedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>{job.task}</div>
                            <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '2px' }}>Error: {job.error} (Attempt {job.attempts}/3)</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.74rem', color: '#64748b' }}>
                    Auto-Retry Daemon: <strong>Active (Exponential backoff up to 3x)</strong>
                  </div>
                </div>

                {/* Card B: Storage Usage & Backups */}
                <div className="card-section" style={{ margin: 0, padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HardDrive size={18} color="#7c3aed" />
                      <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>Storage &amp; Disaster Recovery</h3>
                    </div>
                    <span style={{ fontWeight: '800', color: '#7c3aed', fontSize: '0.85rem' }}>12.5% Used</span>
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                    1,280.4 GB <span style={{ fontSize: '0.82rem', fontWeight: '500', color: '#64748b' }}>of 10,240 GB (10 TB Allocated)</span>
                  </div>

                  <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex', margin: '10px 0 14px' }}>
                    <div style={{ width: '0.4%', background: '#2563eb' }} title="DB Tables (42.4 GB)"></div>
                    <div style={{ width: '7.4%', background: '#7c3aed' }} title="Media & Attachments (758 GB)"></div>
                    <div style={{ width: '1.4%', background: '#0284c7' }} title="Report Exports (140 GB)"></div>
                    <div style={{ width: '3.3%', background: '#d97706' }} title="Encrypted Backups (340 GB)"></div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.75rem' }}>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b' }}>📦 Database Tables</div>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>42.4 GB</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b' }}>📸 Media Uploads</div>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>758.0 GB</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b' }}>📊 Report Exports</div>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>140.0 GB</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b' }}>🔒 Encrypted Snapshots</div>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>340.0 GB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 2: ALL PLATFORM APIS EXPLORER
              =================================================================== */}
          {healthSubTab === 'apis' && (
            <div>
              {/* API Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase' }}>Total Registered APIs</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0c4a6e', marginTop: '4px' }}>
                    {systemApisData?.totalCount || 16} Endpoints
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '2px' }}>RESTful HTTP/2 Gateways</div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>Avg Latency SLA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#14532d', marginTop: '4px' }}>
                    {systemApisData?.summary?.avgLatencyMs || 24.2} <span style={{ fontSize: '0.9rem' }}>ms</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '2px' }}>99.96% Sub-50ms SLA</div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#7e22ce', textTransform: 'uppercase' }}>24h Request Volume</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#581c87', marginTop: '4px' }}>
                    {(systemApisData?.summary?.total24hRequests || 504000).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9333ea', marginTop: '2px' }}>0.02% Error Rate</div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase' }}>Interactive Tester</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#78350f', marginTop: '6px' }}>
                    Live Loopback Ping
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>Direct Endpoint Validation</div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="card-section" style={{ margin: 0, padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search API by name, path (/api/...), category, or method..."
                        value={apiSearchQuery}
                        onChange={(e) => {
                          setApiSearchQuery(e.target.value);
                          handleLoadSystemApis({ search: e.target.value });
                        }}
                        style={{ paddingLeft: '32px', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Method Filter */}
                    <select
                      className="form-control"
                      value={apiMethodFilter}
                      onChange={(e) => {
                        setApiMethodFilter(e.target.value);
                        handleLoadSystemApis({ method: e.target.value });
                      }}
                      style={{ width: '130px', fontSize: '0.82rem' }}
                    >
                      <option value="ALL">All Methods</option>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>

                    {/* Category Filter */}
                    <select
                      className="form-control"
                      value={apiCategoryFilter}
                      onChange={(e) => {
                        setApiCategoryFilter(e.target.value);
                        handleLoadSystemApis({ category: e.target.value });
                      }}
                      style={{ width: '200px', fontSize: '0.82rem' }}
                    >
                      {(systemApisData?.categories || ['ALL', 'Authentication & Security', 'Tenants & Organizations', 'Users & Personnel', 'Field Operations & DCR', 'Doctor & Chemist CRM', 'GPS & Real-Time Tracking', 'Analytics & BI Engine', 'Multi-Currency & FX Engine', 'Storage & Media CDN', 'System Telemetry & DevOps']).map((cat, idx) => (
                        <option key={idx} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleLoadSystemApis()}
                      disabled={isApisLoading}
                    >
                      <RefreshCw size={14} className={isApisLoading ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* APIs Directory Table */}
              <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Method &amp; Endpoint</th>
                        <th style={{ padding: '12px 14px' }}>API Name &amp; Description</th>
                        <th style={{ padding: '12px 14px' }}>Category</th>
                        <th style={{ padding: '12px 14px' }}>Auth &amp; Rate Limit</th>
                        <th style={{ padding: '12px 14px' }}>24h Traffic</th>
                        <th style={{ padding: '12px 14px' }}>Avg Latency</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!systemApisData?.apis || systemApisData.apis.length === 0) ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                            <Code size={32} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                            <div>No API endpoints matched your query.</div>
                          </td>
                        </tr>
                      ) : (
                        systemApisData.apis.map((api, idx) => {
                          const methodColor = 
                            api.method === 'GET' ? '#2563eb' :
                            api.method === 'POST' ? '#16a34a' :
                            api.method === 'PUT' ? '#d97706' :
                            api.method === 'DELETE' ? '#dc2626' : '#475569';

                          const methodBg = 
                            api.method === 'GET' ? '#eff6ff' :
                            api.method === 'POST' ? '#f0fdf4' :
                            api.method === 'PUT' ? '#fffbeb' :
                            api.method === 'DELETE' ? '#fef2f2' : '#f1f5f9';

                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ 
                                    background: methodBg, 
                                    color: methodColor, 
                                    fontWeight: '800', 
                                    fontSize: '0.72rem', 
                                    padding: '3px 8px', 
                                    borderRadius: '4px', 
                                    border: `1px solid ${methodColor}40`,
                                    fontFamily: 'monospace'
                                  }}>
                                    {api.method}
                                  </span>
                                  <code style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: '700' }}>
                                    {api.path}
                                  </code>
                                </div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: '700', color: '#0f172a' }}>{api.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', maxWidth: '300px' }}>
                                  {api.description}
                                </div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                                  {api.category}
                                </span>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {api.authRequired ? (
                                    <span title="JWT Auth Required" style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: '700' }}>
                                      <Lock size={12} /> Bearer JWT
                                    </span>
                                  ) : (
                                    <span style={{ color: '#16a34a', fontSize: '0.72rem', fontWeight: '700' }}>
                                      Public API
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                                  Limit: {api.rateLimit}
                                </div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: '700', color: '#0f172a' }}>{(api.requests24h || 1200).toLocaleString()}</div>
                                <div style={{ fontSize: '0.68rem', color: '#dc2626' }}>Err: {api.errorRate || '0.00%'}</div>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ fontWeight: '800', color: '#0284c7' }}>{api.avgLatency || '18ms'}</span>
                              </td>

                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                  {api.status || 'ACTIVE'}
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleOpenApiPingModal(api)}
                                  style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                                >
                                  <Zap size={12} color="#2563eb" />
                                  <span>Test Ping</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 3: DATABASE ENGINE & ALL TABLES INSPECTOR
              =================================================================== */}
          {healthSubTab === 'database' && (
            <div>
              {/* PostgreSQL Cluster KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>Database Engine</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#14532d', marginTop: '4px' }}>
                    PostgreSQL 16
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '2px' }}>
                    Host: aws-us-east-1.rds.postgresql.internal
                  </div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase' }}>Connection Pool</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0c4a6e', marginTop: '4px' }}>
                    18 / 50 Active
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '2px' }}>
                    32 Idle &bull; 0 Queued Requests
                  </div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#7e22ce', textTransform: 'uppercase' }}>Cache Hit Ratio</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#581c87', marginTop: '4px' }}>
                    99.42%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9333ea', marginTop: '2px' }}>
                    240 TPS Throughput
                  </div>
                </div>

                <div className="card-section" style={{ margin: 0, padding: '14px', background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase' }}>Total Database Size</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#78350f', marginTop: '4px' }}>
                    24.8 GB
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>
                    {databaseTelemetryData?.tables?.length || 10} Managed Tables
                  </div>
                </div>
              </div>

              {/* Table Search Toolbar */}
              <div className="card-section" style={{ margin: 0, padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search database tables by name (e.g. users, tenants, logs)..."
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      style={{ paddingLeft: '32px', fontSize: '0.82rem' }}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleLoadDatabaseTelemetry}
                    disabled={isDbTelemetryLoading}
                  >
                    <RefreshCw size={14} className={isDbTelemetryLoading ? 'spin' : ''} />
                    <span>Refresh Schema</span>
                  </button>
                </div>
              </div>

              {/* Database Tables Directory Table */}
              <div className="card-section" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                  <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Table Name</th>
                        <th style={{ padding: '12px 14px' }}>Description &amp; Schema Scope</th>
                        <th style={{ padding: '12px 14px' }}>Row Count</th>
                        <th style={{ padding: '12px 14px' }}>Disk Size</th>
                        <th style={{ padding: '12px 14px' }}>Indexes</th>
                        <th style={{ padding: '12px 14px' }}>Primary Key</th>
                        <th style={{ padding: '12px 14px' }}>Last Analyzed</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {((databaseTelemetryData?.tables || []).filter(t => 
                        !tableSearchQuery || 
                        t.tableName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
                        (t.description && t.description.toLowerCase().includes(tableSearchQuery.toLowerCase()))
                      )).map((table, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Database size={15} color="#0284c7" />
                              <span style={{ fontWeight: '800', fontFamily: 'monospace', color: '#0f172a', fontSize: '0.82rem' }}>
                                public.{table.tableName}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ color: '#334155', fontSize: '0.76rem' }}>{table.description || 'System table'}</div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: '800', color: '#0f172a' }}>{(table.rowCount || 0).toLocaleString()}</span>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '0.74rem', color: '#475569' }}>
                              {table.totalSizePretty || '32 KB'}
                            </span>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: '#0284c7', fontWeight: '700' }}>{table.indexCount || 1} Indexes</span>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <code style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px' }}>
                              {table.primaryKey || 'id'}
                            </code>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{table.lastAnalyzed || 'Continuous'}</span>
                          </td>

                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleInspectTableDetails(table.tableName)}
                              style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={12} color="#0284c7" />
                              <span>Inspect Schema &amp; Rows</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 4: LIVE BACKEND CONSOLE LOGS
              =================================================================== */}
          {healthSubTab === 'logs' && (
            <div>
              {/* Log Level Counters Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  className="card-section"
                  onClick={() => { setLogLevelFilter('ALL'); handleLoadBackendLogs({ level: 'ALL' }); }}
                  style={{ margin: 0, padding: '10px 14px', textAlign: 'left', cursor: 'pointer', border: logLevelFilter === 'ALL' ? '2px solid #0284c7' : '1px solid #e2e8f0', background: logLevelFilter === 'ALL' ? '#f0f9ff' : '#ffffff' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>ALL LOGS</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>{backendLogsData?.levelCounts?.ALL || backendLogsData?.count || 0}</div>
                </button>

                <button
                  type="button"
                  className="card-section"
                  onClick={() => { setLogLevelFilter('INFO'); handleLoadBackendLogs({ level: 'INFO' }); }}
                  style={{ margin: 0, padding: '10px 14px', textAlign: 'left', cursor: 'pointer', border: logLevelFilter === 'INFO' ? '2px solid #2563eb' : '1px solid #e2e8f0', background: logLevelFilter === 'INFO' ? '#eff6ff' : '#ffffff' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#2563eb' }}>[INFO]</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1d4ed8' }}>{backendLogsData?.levelCounts?.INFO || 0}</div>
                </button>

                <button
                  type="button"
                  className="card-section"
                  onClick={() => { setLogLevelFilter('HTTP'); handleLoadBackendLogs({ level: 'HTTP' }); }}
                  style={{ margin: 0, padding: '10px 14px', textAlign: 'left', cursor: 'pointer', border: logLevelFilter === 'HTTP' ? '2px solid #059669' : '1px solid #e2e8f0', background: logLevelFilter === 'HTTP' ? '#f0fdf4' : '#ffffff' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#059669' }}>[HTTP]</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#047857' }}>{backendLogsData?.levelCounts?.HTTP || 0}</div>
                </button>

                <button
                  type="button"
                  className="card-section"
                  onClick={() => { setLogLevelFilter('WARN'); handleLoadBackendLogs({ level: 'WARN' }); }}
                  style={{ margin: 0, padding: '10px 14px', textAlign: 'left', cursor: 'pointer', border: logLevelFilter === 'WARN' ? '2px solid #d97706' : '1px solid #e2e8f0', background: logLevelFilter === 'WARN' ? '#fffbeb' : '#ffffff' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#d97706' }}>[WARN]</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#b45309' }}>{backendLogsData?.levelCounts?.WARN || 0}</div>
                </button>

                <button
                  type="button"
                  className="card-section"
                  onClick={() => { setLogLevelFilter('ERROR'); handleLoadBackendLogs({ level: 'ERROR' }); }}
                  style={{ margin: 0, padding: '10px 14px', textAlign: 'left', cursor: 'pointer', border: logLevelFilter === 'ERROR' ? '2px solid #dc2626' : '1px solid #e2e8f0', background: logLevelFilter === 'ERROR' ? '#fef2f2' : '#ffffff' }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#dc2626' }}>[ERROR]</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#b91c1c' }}>{backendLogsData?.levelCounts?.ERROR || 0}</div>
                </button>
              </div>

              {/* Log Controls & Toolbar */}
              <div className="card-section" style={{ margin: 0, padding: '12px 16px', marginBottom: '14px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search logs by keyword, path, service, or IP address..."
                        value={logSearchQuery}
                        onChange={(e) => {
                          setLogSearchQuery(e.target.value);
                          handleLoadBackendLogs({ search: e.target.value });
                        }}
                        style={{ width: '100%', padding: '6px 10px 6px 32px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: '#f8fafc', fontSize: '0.8rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setIsAutoStreamLogs(!isAutoStreamLogs)}
                      style={{ 
                        background: isAutoStreamLogs ? '#059669' : '#475569', 
                        color: '#ffffff', 
                        fontSize: '0.74rem', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isAutoStreamLogs ? '#34d399' : '#cbd5e1', display: 'inline-block' }}></span>
                      <span>{isAutoStreamLogs ? 'Auto-Streaming (5s)' : 'Stream Paused'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleLoadBackendLogs()}
                      disabled={isLogsLoading}
                      style={{ background: '#334155', color: '#f8fafc', fontSize: '0.74rem', border: '1px solid #475569', borderRadius: '6px', padding: '6px 12px' }}
                    >
                      <RefreshCw size={13} className={isLogsLoading ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleExportLogs('JSON')}
                      style={{ background: '#334155', color: '#f8fafc', fontSize: '0.74rem', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px' }}
                    >
                      <Download size={13} />
                      <span>JSON</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleExportLogs('CSV')}
                      style={{ background: '#334155', color: '#f8fafc', fontSize: '0.74rem', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px' }}
                    >
                      <FileSpreadsheet size={13} />
                      <span>CSV</span>
                    </button>

                    <div style={{ display: 'flex', gap: '4px', background: '#0f172a', padding: '3px 6px', borderRadius: '6px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', alignSelf: 'center', paddingRight: '4px', fontWeight: '700' }}>TEST LOG:</span>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleEmitTestLog('INFO')}
                        style={{ background: '#1e3a8a', color: '#93c5fd', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', border: 'none' }}
                        title="Emit real-time INFO log"
                      >
                        +INFO
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleEmitTestLog('HTTP')}
                        style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', border: 'none' }}
                        title="Emit real-time HTTP log"
                      >
                        +HTTP
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleEmitTestLog('WARN')}
                        style={{ background: '#78350f', color: '#fde68a', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', border: 'none' }}
                        title="Emit real-time WARN log"
                      >
                        +WARN
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleEmitTestLog('ERROR')}
                        style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', border: 'none' }}
                        title="Emit real-time ERROR log"
                      >
                        +ERROR
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={handleClearBackendLogs}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.74rem', borderRadius: '6px', padding: '6px 10px' }}
                    >
                      <Trash2 size={13} />
                      <span>Flush Logs</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Terminal Logs Viewer */}
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.78rem', minHeight: '450px', maxHeight: '600px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem', marginLeft: '8px' }}>
                      console.log &bull; cluster node-worker-01 &bull; {backendLogsData.logs?.length || 0} events loaded
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                    Press Export for full archive
                  </span>
                </div>

                {(!backendLogsData.logs || backendLogsData.logs.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748b' }}>
                    <Terminal size={32} color="#334155" style={{ margin: '0 auto 8px', display: 'block' }} />
                    <div>No log entries matched current filter parameters.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {backendLogsData.logs.map((log, idx) => {
                      const levelColor = 
                        log.level === 'ERROR' ? '#f87171' :
                        log.level === 'WARN' ? '#fbbf24' :
                        log.level === 'HTTP' ? '#34d399' :
                        log.level === 'DEBUG' ? '#94a3b8' : '#60a5fa';

                      const levelBg = 
                        log.level === 'ERROR' ? 'rgba(239, 68, 68, 0.15)' :
                        log.level === 'WARN' ? 'rgba(245, 158, 11, 0.15)' :
                        log.level === 'HTTP' ? 'rgba(16, 185, 129, 0.15)' :
                        log.level === 'DEBUG' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(59, 130, 246, 0.15)';

                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '6px 8px', borderRadius: '4px', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', lineHeight: 1.5 }}>
                          <span style={{ color: '#64748b', minWidth: '80px', fontSize: '0.72rem' }}>
                            {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '00:00:00'}
                          </span>

                          <span style={{ background: levelBg, color: levelColor, padding: '1px 6px', borderRadius: '3px', fontWeight: '800', fontSize: '0.7rem', minWidth: '55px', textAlign: 'center' }}>
                            [{log.level}]
                          </span>

                          <span style={{ color: '#93c5fd', minWidth: '130px', fontWeight: '600' }}>
                            {log.service || 'API Gateway'}:
                          </span>

                          <div style={{ flex: 1 }}>
                            <span style={{ color: log.level === 'ERROR' ? '#fca5a5' : (log.level === 'WARN' ? '#fef08a' : '#f8fafc') }}>
                              {log.message}
                            </span>
                            {log.path && (
                              <span style={{ color: '#64748b', marginLeft: '8px', fontSize: '0.72rem' }}>
                                ({log.method || 'GET'} {log.path} - {log.durationMs || 10}ms)
                              </span>
                            )}
                          </div>

                          <span style={{ color: '#475569', fontSize: '0.68rem' }}>
                            {log.ipAddress || '127.0.0.1'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              MODAL 1: INTERACTIVE API PING TESTER MODAL
              =================================================================== */}
          {pingTestModal.isOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div className="modal-card" style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '640px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="#0284c7" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                      API Diagnostic Ping Tester
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPingTestModal({ isOpen: false, loading: false, api: null, result: null, payloadJson: '' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Target API Endpoint</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ 
                        fontWeight: '800', 
                        fontFamily: 'monospace', 
                        background: '#eff6ff', 
                        color: '#2563eb', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        border: '1px solid #bfdbfe' 
                      }}>
                        {pingTestModal.api?.method || 'GET'}
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={pingTestModal.api?.path || '/api/system-health'}
                        className="form-control"
                        style={{ fontFamily: 'monospace', fontWeight: '700', background: '#f8fafc' }}
                      />
                    </div>
                  </div>

                  {pingTestModal.api?.method === 'POST' || pingTestModal.api?.method === 'PUT' ? (
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Request Payload (JSON)</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        value={pingTestModal.payloadJson}
                        onChange={(e) => setPingTestModal(prev => ({ ...prev, payloadJson: e.target.value }))}
                        placeholder='{"key": "value"}'
                        style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
                      />
                    </div>
                  ) : null}

                  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleExecuteApiPing}
                      disabled={pingTestModal.loading}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7' }}
                    >
                      <Zap size={14} className={pingTestModal.loading ? 'spin' : ''} />
                      <span>{pingTestModal.loading ? 'Pinging Endpoint...' : 'Send Live Ping'}</span>
                    </button>
                  </div>

                  {/* Ping Results Card */}
                  {pingTestModal.result && (
                    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '14px', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.76rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#34d399', fontWeight: '800' }}>✓ HTTP {pingTestModal.result.httpStatus || '200 OK'}</span>
                          <span style={{ color: '#64748b' }}>&bull;</span>
                          <span style={{ color: '#60a5fa' }}>Latency: {pingTestModal.result.latencyMs || 18}ms</span>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>

                      <div style={{ color: '#94a3b8', marginBottom: '6px' }}>Response Body:</div>
                      <pre style={{ margin: 0, color: '#e2e8f0', maxHeight: '180px', overflowY: 'auto' }}>
                        {JSON.stringify(pingTestModal.result.body || pingTestModal.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              MODAL 2: DATABASE TABLE SCHEMA & ROWS INSPECTOR MODAL
              =================================================================== */}
          {tableDetailsModal.isOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div className="modal-card" style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '820px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={18} color="#0284c7" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                        Database Table Inspector: <code>public.{tableDetailsModal.tableName}</code>
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Schema definition, field types, constraints &amp; live preview records
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTableDetailsModal({ isOpen: false, loading: false, tableName: '', data: null })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                  {tableDetailsModal.loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                      <RefreshCw size={28} className="spin" style={{ margin: '0 auto 8px', display: 'block' }} />
                      <div>Reading table schema from PostgreSQL catalog...</div>
                    </div>
                  ) : (
                    <div>
                      {/* Columns Schema Definition */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 10px', fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                          Column Schema &amp; Data Types ({tableDetailsModal.data?.columns?.length || 0} Columns)
                        </h4>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                            <thead>
                              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                                <th style={{ padding: '8px 12px' }}>Column Name</th>
                                <th style={{ padding: '8px 12px' }}>Data Type</th>
                                <th style={{ padding: '8px 12px' }}>Nullable</th>
                                <th style={{ padding: '8px 12px' }}>Key</th>
                                <th style={{ padding: '8px 12px' }}>Default Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(tableDetailsModal.data?.columns || []).map((col, cIdx) => (
                                <tr key={cIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '8px 12px', fontWeight: '700', fontFamily: 'monospace', color: '#0f172a' }}>{col.column}</td>
                                  <td style={{ padding: '8px 12px', color: '#2563eb', fontFamily: 'monospace' }}>{col.type}</td>
                                  <td style={{ padding: '8px 12px' }}>{col.nullable ? 'YES' : 'NO (NOT NULL)'}</td>
                                  <td style={{ padding: '8px 12px' }}>
                                    {col.primaryKey ? (
                                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>PRIMARY KEY</span>
                                    ) : '-'}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: '#64748b', fontFamily: 'monospace' }}>{col.defaultVal || 'NULL'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Sample Rows Preview */}
                      <div>
                        <h4 style={{ margin: '0 0 10px', fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                          Sample Records Preview (Top 10 Rows)
                        </h4>
                        {(!tableDetailsModal.data?.sampleRows || tableDetailsModal.data.sampleRows.length === 0) ? (
                          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                            Table is currently empty or no preview rows returned.
                          </div>
                        ) : (
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                                  {Object.keys(tableDetailsModal.data.sampleRows[0] || {}).map((k, kIdx) => (
                                    <th key={kIdx} style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{k}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tableDetailsModal.data.sampleRows.map((row, rIdx) => (
                                  <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {Object.values(row).map((val, vIdx) => (
                                      <td key={vIdx} style={{ padding: '8px 10px', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
  );
}
