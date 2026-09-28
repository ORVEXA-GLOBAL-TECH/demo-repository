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
import CreateCompanyModal from '../../components/CreateCompanyModal';
import TenantAdminManagerPanel from '../../components/TenantAdminManagerPanel';
import { DEFAULT_SOVEREIGN_REGISTRY } from '../../data/sovereignRegistry';

export default function CommunicationsTab() {
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
    getGlobalAnnouncements, getNotificationOverview, getNotificationChannels, getAnnouncementAcknowledgments, handleTestDispatchAnnouncement, handleTogglePinAnnouncement,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          {/* Header & Title */}
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone size={22} color="#f59e0b" />
                Platform Notification Management &amp; Global Announcements
              </h2>
              <p className="section-desc">
                Broadcast platform-wide maintenance windows, new feature changelogs, security advisories, mobile version updates, platform policies, and terms updates.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  getGlobalAnnouncements().then(a => setAnnouncementsList(a));
                  getNotificationOverview().then(o => setNotificationOverview(o));
                  getNotificationChannels().then(c => setNotificationChannelsList(c));
                  getAnnouncementAcknowledgments().then(k => setAnnouncementAcksList(k));
                  showToast('Notification channels & announcements stream refreshed', 'success');
                }}
              >
                <RefreshCw size={15} /> <span>Refresh Feed</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsPublishAnnouncementOpen(true)}
              >
                <Plus size={15} /> <span>Publish Announcement</span>
              </button>
            </div>
          </div>

          {/* Top Telemetry & KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Active Announcements</span>
                <Megaphone size={16} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 2px' }}>
                {notificationOverview?.publishedCount || announcementsList.filter(a => a.status === 'PUBLISHED').length}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#0284c7' }}>
                📌 {notificationOverview?.pinnedBannersCount || announcementsList.filter(a => a.isPinnedBanner).length} Pinned Top Banners
              </div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Total Platform Reach</span>
                <Users size={16} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284c7', margin: '6px 0 2px' }}>
                {(notificationOverview?.totalDispatched || 72890).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a' }}>Dispatched Across All Tenants</div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Average Read Rate</span>
                <CheckCircle2 size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#16a34a', margin: '6px 0 2px' }}>
                {notificationOverview?.readRatePercent || 82.4}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {(notificationOverview?.totalRead || 41805).toLocaleString()} Unique Reads
              </div>
            </div>

            <div className="card-section" style={{ margin: 0, padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>Policy Acknowledgment Rate</span>
                <ShieldCheck size={16} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#7c3aed', margin: '6px 0 2px' }}>
                {notificationOverview?.acknowledgmentRatePercent || 94.2}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#6d28d9' }}>
                {(notificationOverview?.totalAcknowledged || 7120).toLocaleString()} Verified Accepts
              </div>
            </div>
          </div>

          {/* Sub-Tabs Switchboard */}
          <div className="tab-pills-bar" style={{ marginBottom: '18px' }}>
            <button
              type="button"
              className={`pill-btn ${commSubTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setCommSubTab('announcements')}
            >
              📢 All Published Announcements ({announcementsList.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${commSubTab === 'pinned' ? 'active' : ''}`}
              onClick={() => setCommSubTab('pinned')}
            >
              📌 Active Global Banners ({announcementsList.filter(a => a.isPinnedBanner).length})
            </button>
            <button
              type="button"
              className={`pill-btn ${commSubTab === 'channels' ? 'active' : ''}`}
              onClick={() => setCommSubTab('channels')}
            >
              ⚡ Delivery Channels &amp; Gateways
            </button>
            <button
              type="button"
              className={`pill-btn ${commSubTab === 'acks' ? 'active' : ''}`}
              onClick={() => setCommSubTab('acks')}
            >
              ⚖️ Policy &amp; Terms Acknowledgment Ledger
            </button>
          </div>

          {/* ===================================================================
              SUB-TAB 1: ALL ANNOUNCEMENTS & FILTERS
              =================================================================== */}
          {commSubTab === 'announcements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Filter Controls Bar */}
              <div className="card-section" style={{ margin: 0, padding: '14px 18px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>Announcement Type:</span>
                    <select
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.76rem' }}
                      value={announcementTypeFilter}
                      onChange={(e) => setAnnouncementTypeFilter(e.target.value)}
                    >
                      <option value="ALL">All Announcement Types</option>
                      <option value="MAINTENANCE">🛠️ Maintenance Notice</option>
                      <option value="NEW_FEATURE">✨ New Feature Announcement</option>
                      <option value="SECURITY">🛡️ Security Announcement</option>
                      <option value="VERSION_UPDATE">🚀 Version Update</option>
                      <option value="PLATFORM_POLICY">📜 Platform Policy</option>
                      <option value="TERMS_UPDATE">⚖️ Terms Update</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: '700' }}>Priority:</span>
                    <select
                      className="form-control"
                      style={{ height: '32px', fontSize: '0.76rem' }}
                      value={announcementPriorityFilter}
                      onChange={(e) => setAnnouncementPriorityFilter(e.target.value)}
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="INFO">Info</option>
                      <option value="WARNING">Warning</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Showing <strong>{
                    announcementsList.filter(a => {
                      if (announcementTypeFilter !== 'ALL' && a.type !== announcementTypeFilter) return false;
                      if (announcementPriorityFilter !== 'ALL' && a.priority !== announcementPriorityFilter) return false;
                      return true;
                    }).length
                  }</strong> of {announcementsList.length} Announcements
                </div>
              </div>

              {/* Announcements Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                {announcementsList
                  .filter(a => {
                    if (announcementTypeFilter !== 'ALL' && a.type !== announcementTypeFilter) return false;
                    if (announcementPriorityFilter !== 'ALL' && a.priority !== announcementPriorityFilter) return false;
                    return true;
                  })
                  .map((ann) => {
                    const typeColors = {
                      MAINTENANCE: { bg: '#fffbeb', border: '#fef3c7', text: '#b45309', icon: '🛠️' },
                      NEW_FEATURE: { bg: '#eff6ff', border: '#dbeafe', text: '#1d4ed8', icon: '✨' },
                      SECURITY: { bg: '#fef2f2', border: '#fee2e2', text: '#b91c1c', icon: '🛡️' },
                      VERSION_UPDATE: { bg: '#faf5ff', border: '#f3e8ff', text: '#7e22ce', icon: '🚀' },
                      PLATFORM_POLICY: { bg: '#fff7ed', border: '#ffedd5', text: '#c2410c', icon: '📜' },
                      TERMS_UPDATE: { bg: '#f0fdf4', border: '#dcfce7', text: '#15803d', icon: '⚖️' }
                    };
                    const theme = typeColors[ann.type] || { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', icon: '📢' };

                    return (
                      <div
                        key={ann.id}
                        className="card-section"
                        style={{
                          margin: 0,
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderLeft: `4px solid ${theme.text}`,
                          position: 'relative'
                        }}
                      >
                        {ann.isPinnedBanner && (
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📌 Pinned Banner
                          </div>
                        )}

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.1rem' }}>{theme.icon}</span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: theme.bg,
                                color: theme.text,
                                border: `1px solid ${theme.border}`
                              }}
                            >
                              {ann.type.replace('_', ' ')}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: '800',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: ann.priority === 'CRITICAL' ? '#fee2e2' : (ann.priority === 'HIGH' ? '#ffedd5' : '#f1f5f9'),
                                color: ann.priority === 'CRITICAL' ? '#991b1b' : (ann.priority === 'HIGH' ? '#9a3412' : '#475569')
                              }}
                            >
                              {ann.priority}
                            </span>
                          </div>

                          <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.4 }}>
                            {ann.title}
                          </h4>

                          <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                            {ann.summary || ann.content.slice(0, 160) + '...'}
                          </p>

                          {/* Channels & Audience tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                            <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                              Audience: <strong>{ann.targetAudience.replace('_', ' ')}</strong>
                            </span>
                            {(ann.channels || []).map((ch, chi) => (
                              <span key={chi} style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                                {ch.replace('_', ' ')}
                              </span>
                            ))}
                            {ann.requiresAcknowledgment && (
                              <span style={{ fontSize: '0.68rem', background: '#ede9fe', color: '#6d28d9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                ✍️ Mandatory Acknowledgment
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer & Engagement Stats */}
                        <div style={{ paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.72rem', color: '#64748b' }}>
                            <div>
                              Sent: <strong>{(ann.totalSent || 0).toLocaleString()}</strong> &bull; Reads: <strong>{(ann.totalRead || 0).toLocaleString()}</strong>
                              {ann.requiresAcknowledgment && (
                                <span> &bull; Acks: <strong style={{ color: '#7c3aed' }}>{ann.totalAcknowledged || 0}</strong></span>
                              )}
                            </div>
                            <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => setSelectedAnnouncementInspect(ann)}
                              >
                                <Eye size={12} /> Inspect
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => handleTestDispatchAnnouncement(ann.id, ann.title)}
                              >
                                <Send size={12} /> Test Send
                              </button>
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{
                                  padding: '3px 8px',
                                  fontSize: '0.72rem',
                                  color: ann.isPinnedBanner ? '#b45309' : '#475569',
                                  background: ann.isPinnedBanner ? '#fef3c7' : '#f8fafc'
                                }}
                                onClick={() => handleTogglePinAnnouncement(ann.id)}
                              >
                                {ann.isPinnedBanner ? 'Unpin' : '📌 Pin Banner'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#dc2626', borderColor: '#fecaca' }}
                                onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 2: ACTIVE PINNED GLOBAL BANNERS
              =================================================================== */}
          {commSubTab === 'pinned' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Pinned Live Header Banners
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                  These announcements are permanently pinned to the top navigation header across all web and mobile tenant workspaces.
                </p>
              </div>

              {announcementsList.filter(a => a.isPinnedBanner).length === 0 ? (
                <div className="card-section" style={{ margin: 0, padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  No announcements currently pinned as global banners. Click &quot;Pin Banner&quot; on any announcement to pin it.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {announcementsList.filter(a => a.isPinnedBanner).map((ann) => (
                    <div
                      key={ann.id}
                      style={{
                        padding: '16px 20px',
                        background: ann.priority === 'CRITICAL' ? '#fef2f2' : (ann.type === 'MAINTENANCE' ? '#fffbeb' : '#eff6ff'),
                        border: ann.priority === 'CRITICAL' ? '1px solid #fecaca' : (ann.type === 'MAINTENANCE' ? '1px solid #fde68a' : '1px solid #bfdbfe'),
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span style={{ fontSize: '1.4rem' }}>
                          {ann.type === 'MAINTENANCE' ? '🛠️' : (ann.type === 'SECURITY' ? '🛡️' : '📢')}
                        </span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{ann.title}</strong>
                            <span className="status-badge-green" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>● LIVE PINNED</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#334155' }}>
                            {ann.summary || ann.content}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem' }}
                          onClick={() => setSelectedAnnouncementInspect(ann)}
                        >
                          <Eye size={13} /> View Banner
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.74rem', color: '#dc2626' }}
                          onClick={() => handleTogglePinAnnouncement(ann.id)}
                        >
                          Unpin Banner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 3: DELIVERY CHANNELS & GATEWAYS
              =================================================================== */}
          {commSubTab === 'channels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                  Platform Notification Dispatch Pipelines &amp; Gateway Health
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                  Real-time cluster status for WebSocket live streams, AWS SES transactional emails, Firebase mobile push, and Twilio SMS.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {(notificationChannelsList.length > 0 ? notificationChannelsList : [
                  { channelKey: 'IN_APP_WEBSOCKET', name: 'In-App Live WebSocket Broadcast', provider: 'Socket.io Cluster', status: 'OPERATIONAL', latencyMs: 12, throughput: '1,420 msgs/sec', activeSubscribers: 14850, description: 'Instant header banner and modal alerts dispatched directly to active web sessions.' },
                  { channelKey: 'EMAIL_RELAY', name: 'Transactional Email Dispatcher', provider: 'AWS SES + SMTP Gateway', status: 'OPERATIONAL', latencyMs: 110, throughput: '350 emails/min', activeSubscribers: 14850, description: 'Formatted HTML email broadcasts sent to company administrators and user inboxes.' },
                  { channelKey: 'MOBILE_PUSH', name: 'Mobile SFA Push Notification Relay', provider: 'Firebase Cloud Messaging (FCM) & APNs', status: 'OPERATIONAL', latencyMs: 45, throughput: '2,800 pushes/sec', activeSubscribers: 13200, description: 'Native mobile notifications triggering lock-screen updates for field Medical Reps.' },
                  { channelKey: 'SMS_GATEWAY', name: 'Urgent Security & Lockout SMS', provider: 'Twilio Cloud Telephony', status: 'OPERATIONAL', latencyMs: 85, throughput: '60 SMS/min', activeSubscribers: 420, description: 'High-priority SMS alerts for critical infrastructure downtime and 2FA lockouts.' }
                ]).map((ch) => (
                  <div key={ch.channelKey} className="card-section" style={{ margin: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{ch.name}</strong>
                        <span className="status-badge-green" style={{ fontSize: '0.68rem' }}>● {ch.status}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: '700', marginBottom: '6px' }}>
                        {ch.provider}
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                        {ch.description}
                      </p>
                    </div>

                    <div style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Avg Latency:</span> <strong>{ch.latencyMs}ms</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Throughput:</span> <strong>{ch.throughput}</strong>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: '#64748b' }}>Subscribers:</span> <strong>{ch.activeSubscribers.toLocaleString()} endpoints</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 4: COMPLIANCE ACKNOWLEDGMENT LEDGER
              =================================================================== */}
          {commSubTab === 'acks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0f172a' }}>
                    Statutory Policy &amp; Terms Acknowledgment Ledger
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    Immutable forensic log of tenant administrators and compliance officers digitally signing and accepting terms and platform policies.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => getAnnouncementAcknowledgments().then(k => setAnnouncementAcksList(k))}
                >
                  <RefreshCw size={14} /> Refresh Audit Stream
                </button>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Acknowledgment ID</th>
                      <th>Announcement / Policy Title</th>
                      <th>Acknowledged By</th>
                      <th>Role</th>
                      <th>Company Tenant</th>
                      <th>IP Address</th>
                      <th>Timestamp</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(announcementAcksList.length > 0 ? announcementAcksList : [
                      { id: 'ack-001', announcementTitle: 'Mandatory Two-Factor Authentication (2FA) Policy Activation', userEmail: 'admin@pfizerbiopharma.com', userName: 'Vikram Malhotra', role: 'COMPANY_ADMIN', companyName: 'Pfizer BioPharma Ltd', ipAddress: '142.250.190.46', acknowledgedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
                      { id: 'ack-002', announcementTitle: 'Mandatory Two-Factor Authentication (2FA) Policy Activation', userEmail: 'admin@novartispharma.com', userName: 'Elena Rostova', role: 'COMPANY_ADMIN', companyName: 'Novartis Pharma Global', ipAddress: '194.230.145.22', acknowledgedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
                      { id: 'ack-003', announcementTitle: 'Master Subscription Agreement (MSA) & Terms of Service 2026 Revision', userEmail: 'admin@pfizerbiopharma.com', userName: 'Vikram Malhotra', role: 'COMPANY_ADMIN', companyName: 'Pfizer BioPharma Ltd', ipAddress: '142.250.190.46', acknowledgedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString() },
                      { id: 'ack-004', announcementTitle: 'Platform Data Privacy & Statutory Audit Compliance Policy Update', userEmail: 'auditor@astrazeneca.com', userName: 'Dr. James Sterling', role: 'AUDITOR', companyName: 'AstraZeneca Healthcare', ipAddress: '51.148.172.90', acknowledgedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString() }
                    ]).map((ack, i) => (
                      <tr key={i}>
                        <td><code>{ack.id}</code></td>
                        <td><strong>{ack.announcementTitle}</strong></td>
                        <td>
                          <div><strong>{ack.userName}</strong></div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{ack.userEmail}</div>
                        </td>
                        <td>
                          <span className="status-tag" style={{ fontSize: '0.68rem' }}>{ack.role}</span>
                        </td>
                        <td><strong>{ack.companyName}</strong></td>
                        <td><code>{ack.ipAddress}</code></td>
                        <td>{new Date(ack.acknowledgedAt).toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="status-badge-green" style={{ fontSize: '0.72rem' }}>
                            ✓ ACCEPTED
                          </span>
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
