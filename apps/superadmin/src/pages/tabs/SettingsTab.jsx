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

export default function SettingsTab() {
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
    handleSaveCompanyOverrides, handleSelectOverrideCompany, handleSaveUsageLimits, isSavingUsageLimits, globalUsageLimits, setGlobalUsageLimits, selectedLimitCompanyId, handleSelectLimitCompany, handleSaveTenantUsageLimits, isSavingTenantLimits, tenantLimitForm, setTenantLimitForm, handleSaveMaintenanceMode, isSavingMaintenanceMode, maintenanceModeConfig, setMaintenanceModeConfig, emergencyControlsConfig, handleOpenEmergencyModal, newBlockedIpInput, setNewBlockedIpInput,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Global Platform Configuration</h2>
              <p className="section-desc">Super Admin controls platform-wide policies. Companies inherit these defaults unless explicitly overridden.</p>
            </div>
          </div>

          {/* Section 1: Platform-Wide Global Defaults */}
          <div className="card-section" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} color="#0284c7" /> Platform Global Defaults
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>Base parameters applied across all tenant organizations</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveGlobalSettings}
                disabled={isSavingGlobalSettings}
              >
                <Save size={16} /> {isSavingGlobalSettings ? 'Saving...' : 'Save Global Defaults'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Date Format */}
              <div className="form-group">
                <label className="form-label">Platform Date Format</label>
                <select
                  className="form-control"
                  value={globalSettings.dateFormat}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Standard - e.g. 2026-09-20)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK / India / Europe - e.g. 20/09/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard - e.g. 09/20/2026)</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 20-09-2026)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="form-group">
                <label className="form-label">Platform Timezone</label>
                <select
                  className="form-control"
                  value={globalSettings.timezone}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30 - India)</option>
                  <option value="America/New_York">America/New_York (EST/EDT - US East)</option>
                  <option value="America/Chicago">America/Chicago (CST/CDT - US Central)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT - US West)</option>
                  <option value="Europe/London">Europe/London (GMT/BST - UK)</option>
                  <option value="Europe/Paris">Europe/Paris (CET - Central Europe)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST +4:00 - UAE / GCC)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST +9:00 - Japan)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST +10:00)</option>
                </select>
              </div>

              {/* Default Currency */}
              <div className="form-group">
                <label className="form-label">Platform Default Currency</label>
                <select
                  className="form-control"
                  value={globalSettings.currency}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="AED">AED (AED) - UAE Dirham</option>
                  <option value="SGD">SGD ($) - Singapore Dollar</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                </select>
              </div>

              {/* Language */}
              <div className="form-group">
                <label className="form-label">Platform Language</label>
                <select
                  className="form-control"
                  value={globalSettings.language}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (Español - es)</option>
                  <option value="fr">French (Français - fr)</option>
                  <option value="de">German (Deutsch - de)</option>
                  <option value="hi">Hindi (हिन्दी - hi)</option>
                  <option value="ar">Arabic (العربية - ar)</option>
                </select>
              </div>

              {/* Session Timeout */}
              <div className="form-group">
                <label className="form-label">Default Session Timeout</label>
                <select
                  className="form-control"
                  value={globalSettings.sessionTimeoutMinutes}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))}
                >
                  <option value={15}>15 Minutes (Strict Financial/Pharma)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Standard Enterprise)</option>
                  <option value={120}>2 Hours</option>
                  <option value={480}>8 Hours (Full Working Shift)</option>
                </select>
              </div>

              {/* Max File Size Limit */}
              <div className="form-group">
                <label className="form-label">Default Max File Upload Size</label>
                <select
                  className="form-control"
                  value={globalSettings.fileLimits?.maxFileSizeMB || 25}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    fileLimits: { ...(prev.fileLimits || {}), maxFileSizeMB: Number(e.target.value) }
                  }))}
                >
                  <option value={10}>10 MB</option>
                  <option value={25}>25 MB (Standard Attachment)</option>
                  <option value={50}>50 MB</option>
                  <option value={100}>100 MB (High Definition Clinical Docs)</option>
                </select>
              </div>
            </div>

            {/* Default Working Days */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Default Working Days Schedule</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const isChecked = (globalSettings.defaultWorkingDays || []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      className="action-pill-btn"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: isChecked ? '#0284c7' : '#f8fafc',
                        color: isChecked ? '#ffffff' : '#64748b',
                        borderColor: isChecked ? '#0284c7' : '#cbd5e1',
                        fontWeight: '600'
                      }}
                      onClick={() => {
                        const cur = globalSettings.defaultWorkingDays || [];
                        const updated = isChecked ? cur.filter(d => d !== day) : [...cur, day];
                        setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: updated }));
                      }}
                    >
                      {isChecked ? '✓ ' : ''}{day}
                    </button>
                  );
                })}
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: '8px' }}>
                  Quick Presets:
                </span>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }))}
                >
                  Mon-Fri
                </button>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }))}
                >
                  Mon-Sat
                </button>
                <button
                  type="button"
                  className="action-pill-btn"
                  onClick={() => setGlobalSettings(prev => ({ ...prev, defaultWorkingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }))}
                >
                  All 7 Days
                </button>
              </div>
            </div>

            {/* Notification, Security & Password Policy Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {/* Notifications */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} color="#0284c7" /> Default Notification Channels
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    { key: 'email', label: 'Transactional Email Dispatch' },
                    { key: 'inApp', label: 'Real-Time In-App Alert Badges' },
                    { key: 'sms', label: 'SMS Gateway Broadcasts' },
                    { key: 'push', label: 'Mobile Rep Push Telemetry' },
                    { key: 'weeklyDigest', label: 'Automated Weekly Digest' },
                    { key: 'criticalAlerts', label: 'High-Priority Security Alerts' }
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(globalSettings.notificationSettings?.[item.key])}
                        onChange={(e) => setGlobalSettings(prev => ({
                          ...prev,
                          notificationSettings: { ...(prev.notificationSettings || {}), [item.key]: e.target.checked }
                        }))}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Policy */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} color="#dc2626" /> Default Security Policy
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.securityPolicy?.enforce2FA)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), enforce2FA: e.target.checked }
                      }))}
                    />
                    <span>Enforce Mandatory 2FA for Administrators</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.securityPolicy?.allowMultipleSessions)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), allowMultipleSessions: e.target.checked }
                      }))}
                    />
                    <span>Allow Concurrent Multi-Device Sessions</span>
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Max Failed Login Lockout:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.securityPolicy?.maxLoginAttempts || 5}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), maxLoginAttempts: Number(e.target.value) }
                      }))}
                    >
                      <option value={3}>3 Attempts</option>
                      <option value={5}>5 Attempts</option>
                      <option value={10}>10 Attempts</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Lockout Duration:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.securityPolicy?.lockoutDurationMinutes || 15}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        securityPolicy: { ...(prev.securityPolicy || {}), lockoutDurationMinutes: Number(e.target.value) }
                      }))}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.86rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={16} color="#d97706" /> Default Password Policy
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Min Password Length:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.passwordPolicy?.minLength || 8}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), minLength: Number(e.target.value) }
                      }))}
                    >
                      <option value={8}>8 Characters</option>
                      <option value={10}>10 Characters</option>
                      <option value={12}>12 Characters</option>
                      <option value={14}>14 Characters</option>
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireUppercase)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireUppercase: e.target.checked }
                      }))}
                    />
                    <span>Require Uppercase Letters (A-Z)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireNumbers)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireNumbers: e.target.checked }
                      }))}
                    />
                    <span>Require Numbers (0-9)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(globalSettings.passwordPolicy?.requireSpecialChars)}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), requireSpecialChars: e.target.checked }
                      }))}
                    />
                    <span>Require Special Characters (!@#$)</span>
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>Password Expiry Cycle:</span>
                    <select
                      className="form-control"
                      style={{ width: '130px', padding: '4px 8px', fontSize: '0.76rem' }}
                      value={globalSettings.passwordPolicy?.expiryDays || 90}
                      onChange={(e) => setGlobalSettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...(prev.passwordPolicy || {}), expiryDays: Number(e.target.value) }
                      }))}
                    >
                      <option value={30}>Every 30 Days</option>
                      <option value={60}>Every 60 Days</option>
                      <option value={90}>Every 90 Days</option>
                      <option value={180}>Every 180 Days</option>
                      <option value={0}>Never Expire</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Company-Specific Overrides Inspector & Manager */}
          <div className="card-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={20} color="#7c3aed" /> Company-Specific Configuration Overrides
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Configure granular exceptions for specific tenant organizations
                </p>
              </div>

              {selectedOverrideCompanyId && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="action-pill-btn"
                    style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
                    onClick={handleResetCompanyOverrides}
                    disabled={isSavingCompanyOverride}
                  >
                    <RotateCcw size={13} /> Reset to Global Defaults
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveCompanyOverrides}
                    disabled={isSavingCompanyOverride}
                  >
                    <Save size={15} /> {isSavingCompanyOverride ? 'Saving...' : 'Save Company Overrides'}
                  </button>
                </div>
              )}
            </div>

            {/* Select Target Company */}
            <div className="form-group" style={{ maxWidth: '420px', marginBottom: '18px' }}>
              <label className="form-label">Select Pharmaceutical Company</label>
              <select
                className="form-control"
                value={selectedOverrideCompanyId}
                onChange={(e) => handleSelectOverrideCompany(e.target.value)}
              >
                <option value="">-- Choose a company to inspect or override --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.country}) - Plan: {c.plan}
                  </option>
                ))}
              </select>
            </div>

            {selectedOverrideCompanyId && companyOverrideData ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                    {companyOverrideData.companyName}
                  </span>
                  {companyOverrideData.hasOverrides ? (
                    <span className="status-tag status-trial" style={{ background: '#fef3c7', color: '#b45309' }}>
                      ⚡ Custom Company Overrides Active
                    </span>
                  ) : (
                    <span className="status-badge-green" style={{ background: '#ecfdf5', color: '#059669' }}>
                      ✓ Inheriting Platform Global Defaults
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {/* Timezone Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomTimezone}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomTimezone: e.target.checked }))}
                      />
                      <span>Override Company Timezone</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomTimezone}
                      value={companyOverrideForm.timezone}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>

                  {/* Currency Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomCurrency}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomCurrency: e.target.checked }))}
                      />
                      <span>Override Operating Currency</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomCurrency}
                      value={companyOverrideForm.currency}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="AED">AED (AED) - UAE Dirham</option>
                      <option value="SGD">SGD ($) - Singapore Dollar</option>
                    </select>
                  </div>

                  {/* Date Format Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomDateFormat}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomDateFormat: e.target.checked }))}
                      />
                      <span>Override Date Format</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomDateFormat}
                      value={companyOverrideForm.dateFormat}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, dateFormat: e.target.value }))}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 20/09/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-20)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/20/2026)</option>
                    </select>
                  </div>

                  {/* Session Timeout Override */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        checked={companyOverrideForm.hasCustomSessionTimeout}
                        onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, hasCustomSessionTimeout: e.target.checked }))}
                      />
                      <span>Override Inactivity Session Timeout</span>
                    </label>
                    <select
                      className="form-control"
                      disabled={!companyOverrideForm.hasCustomSessionTimeout}
                      value={companyOverrideForm.sessionTimeoutMinutes}
                      onChange={(e) => setCompanyOverrideForm(prev => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))}
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                      <option value={120}>2 Hours</option>
                      <option value={480}>8 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                <SlidersHorizontal size={36} color="#cbd5e1" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: '0.86rem' }}>Select a pharmaceutical company above to view and customize its configuration overrides.</p>
              </div>
            )}
          </div>

          {/* Section 3: Platform Baseline Usage Limits & Quotas */}
          <div className="card-section" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={20} color="#2563eb" /> Platform Baseline Usage Limits &amp; Tenant Quotas
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Configure platform baseline limits for users, API usage, report generation, GPS retention, and file storage
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveUsageLimits}
                disabled={isSavingUsageLimits}
              >
                <Save size={15} /> {isSavingUsageLimits ? 'Saving Limits...' : 'Save Usage Limits'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Max Users Per Tenant Baseline</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={globalUsageLimits.maxUsersPerTenant || 50}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, maxUsersPerTenant: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily API Calls Quota / Tenant</label>
                <input
                  type="number"
                  min="100"
                  className="form-control"
                  value={globalUsageLimits.dailyApiCallsQuota || 10000}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, dailyApiCallsQuota: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly DCR / Analytics Reports Quota</label>
                <input
                  type="number"
                  min="10"
                  className="form-control"
                  value={globalUsageLimits.monthlyReportsQuota || 500}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, monthlyReportsQuota: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GPS History Retention (Days)</label>
                <input
                  type="number"
                  min="7"
                  className="form-control"
                  value={globalUsageLimits.gpsHistoryRetentionDays || 90}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, gpsHistoryRetentionDays: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Single File Upload (MB)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={globalUsageLimits.maxFileUploadMB || 50}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, maxFileUploadMB: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Storage Quota / Tenant (GB)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={globalUsageLimits.maxStorageQuotaGB || 100}
                  onChange={(e) => setGlobalUsageLimits(prev => ({ ...prev, maxStorageQuotaGB: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Sub-section: Specific Tenant Usage Limit Overrides */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                🏢 Per-Company Usage Limit Overrides
              </h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1', minWidth: '260px', margin: 0 }}>
                  <label className="form-label">Select Company</label>
                  <select
                    className="form-control"
                    value={selectedLimitCompanyId}
                    onChange={(e) => handleSelectLimitCompany(e.target.value)}
                  >
                    <option value="">-- Choose Company to Override Limits --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.plan})</option>
                    ))}
                  </select>
                </div>

                {selectedLimitCompanyId && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveTenantUsageLimits}
                    disabled={isSavingTenantLimits}
                  >
                    <Save size={14} /> {isSavingTenantLimits ? 'Saving Tenant Limits...' : 'Save Tenant Limits'}
                  </button>
                )}
              </div>

              {selectedLimitCompanyId && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '14px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Max Users</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.maxUsers}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, maxUsers: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Daily API Calls</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.dailyApiCalls}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, dailyApiCalls: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Monthly Reports</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.monthlyReports}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, monthlyReports: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>GPS Retention (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.gpsRetentionDays}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, gpsRetentionDays: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>File Upload MB</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.maxFileUploadMB}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, maxFileUploadMB: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.74rem' }}>Storage Quota GB</label>
                    <input
                      type="number"
                      className="form-control"
                      value={tenantLimitForm.storageQuotaGB}
                      onChange={(e) => setTenantLimitForm(prev => ({ ...prev, storageQuotaGB: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: 3-Tier Maintenance Mode Control Center */}
          <div className="card-section" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertOctagon size={20} color="#dc2626" /> 3-Tier Granular Maintenance Mode Control Center
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Super Admin can put the entire platform, specific functional modules, or specific companies into maintenance mode
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#dc2626' }}
                onClick={handleSaveMaintenanceMode}
                disabled={isSavingMaintenanceMode}
              >
                <Save size={15} /> {isSavingMaintenanceMode ? 'Saving Maintenance Settings...' : 'Save Maintenance Config'}
              </button>
            </div>

            {/* Level 1: Entire Platform Maintenance */}
            <div style={{ background: maintenanceModeConfig.platformMaintenance ? '#fef2f2' : '#f8fafc', border: `1px solid ${maintenanceModeConfig.platformMaintenance ? '#fca5a5' : '#cbd5e1'}`, borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: maintenanceModeConfig.platformMaintenance ? '#991b1b' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🚨 Level 1: Platform-Wide Maintenance Mode
                </h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.84rem', color: maintenanceModeConfig.platformMaintenance ? '#dc2626' : '#475569' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(maintenanceModeConfig.platformMaintenance)}
                    onChange={(e) => setMaintenanceModeConfig(prev => ({ ...prev, platformMaintenance: e.target.checked }))}
                  />
                  <span>{maintenanceModeConfig.platformMaintenance ? 'PLATFORM MAINTENANCE ACTIVE' : 'Platform Maintenance Inactive'}</span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Maintenance Banner Message for Users</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Platform is undergoing scheduled maintenance..."
                    value={maintenanceModeConfig.maintenanceMessage || ''}
                    onChange={(e) => setMaintenanceModeConfig(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Completion Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={maintenanceModeConfig.estimatedEndDateTime || ''}
                    onChange={(e) => setMaintenanceModeConfig(prev => ({ ...prev, estimatedEndDateTime: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">IP Whitelist Bypass (Comma Separated IPs)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="127.0.0.1, 192.168.1.1"
                    value={maintenanceModeConfig.ipWhitelistBypass || ''}
                    onChange={(e) => setMaintenanceModeConfig(prev => ({ ...prev, ipWhitelistBypass: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Level 2: Specific Module Maintenance */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                🧩 Level 2: Module-Specific Maintenance Toggles
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { key: 'doctorGeofencing', label: 'Doctor Geofencing / GPS', icon: MapPin },
                  { key: 'dcrReports', label: 'DCR & Analytics Reports', icon: FileText },
                  { key: 'chemistOrdersPOB', label: 'Chemist Orders & POB', icon: Inbox },
                  { key: 'sampleInventory', label: 'Sample Inventory Dispatches', icon: HardDrive },
                  { key: 'aiStudioOCR', label: 'AI Studio & OCR Scanner', icon: Sparkles },
                  { key: 'integrationsApi', label: 'Integrations & External APIs', icon: Terminal },
                  { key: 'analytics', label: 'BI Analytics & Dashboards', icon: BarChart3 }
                ].map(mod => {
                  const isActive = Boolean(maintenanceModeConfig.moduleMaintenance?.[mod.key]);
                  const IconComp = mod.icon;
                  return (
                    <div
                      key={mod.key}
                      style={{
                        background: isActive ? '#fff1f2' : '#f8fafc',
                        border: `1px solid ${isActive ? '#fecdd3' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconComp size={16} color={isActive ? '#e11d48' : '#64748b'} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: isActive ? '#9f1239' : '#334155' }}>
                          {mod.label}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setMaintenanceModeConfig(prev => ({
                          ...prev,
                          moduleMaintenance: {
                            ...(prev.moduleMaintenance || {}),
                            [mod.key]: e.target.checked
                          }
                        }))}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 3: Specific Company Maintenance Isolation */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                🏢 Level 3: Company-Specific Maintenance Isolation
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '12px' }}>
                Put an individual tenant organization into maintenance mode while leaving the rest of the platform operational.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                {companies.map(c => {
                  const isCompMaint = Boolean(maintenanceModeConfig.companyMaintenance?.[c.id]);
                  return (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: '600', color: isCompMaint ? '#dc2626' : '#334155' }}>{c.name}</span>
                      <input
                        type="checkbox"
                        checked={isCompMaint}
                        onChange={(e) => setMaintenanceModeConfig(prev => ({
                          ...prev,
                          companyMaintenance: {
                            ...(prev.companyMaintenance || {}),
                            [c.id]: e.target.checked
                          }
                        }))}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Disaster & Emergency Controls Center */}
          <div className="card-section" style={{ marginTop: '24px', border: '2px solid #ef4444', background: 'linear-gradient(135deg, #fef2f2, #fff1f2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b' }}>
                  <AlertOctagon size={22} color="#dc2626" /> Disaster &amp; Emergency Controls Command Center (Strictly Restricted)
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#7f1d1d', margin: '2px 0 0' }}>
                  High-level emergency controls to instantly freeze platform logins, revoke sessions, isolate compromised companies, block IPs, or disable integrations. All actions enforce audit reason guardrails.
                </p>
              </div>
              <span style={{ background: '#dc2626', color: '#ffffff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                🛡️ FORENSIC AUDIT ENFORCED
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Action 1: Disable Login Globally */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>🛑 Disable Login Globally</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: emergencyControlsConfig.disableLoginGlobally ? '#fee2e2' : '#ecfdf5', color: emergencyControlsConfig.disableLoginGlobally ? '#dc2626' : '#047857' }}>
                      {emergencyControlsConfig.disableLoginGlobally ? 'FROZEN' : 'ACTIVE'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Immediately prevents all users and admins across all companies from logging into the platform.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: emergencyControlsConfig.disableLoginGlobally ? '#16a34a' : '#dc2626', marginTop: '12px', width: '100%', fontSize: '0.8rem' }}
                  onClick={() => handleOpenEmergencyModal('DISABLE_LOGIN_GLOBALLY', emergencyControlsConfig.disableLoginGlobally ? 'Restore Login Globally' : 'Disable Login Globally')}
                >
                  {emergencyControlsConfig.disableLoginGlobally ? '🟢 Restore Global Login' : '🛑 Freeze Global Login'}
                </button>
              </div>

              {/* Action 2: Force Logout All Users */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>⚡ Force Logout All Users</strong>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Invalidates all active user session tokens across all pharmaceutical companies, forcing immediate re-authentication.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#dc2626', marginTop: '12px', width: '100%', fontSize: '0.8rem' }}
                  onClick={() => handleOpenEmergencyModal('FORCE_LOGOUT_ALL', 'Force Logout All Users Across Platform')}
                >
                  ⚡ Force Logout All Sessions
                </button>
              </div>

              {/* Action 3: Disable API Access Globally */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>🔌 Disable API Access Globally</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: emergencyControlsConfig.disableApiAccess ? '#fee2e2' : '#ecfdf5', color: emergencyControlsConfig.disableApiAccess ? '#dc2626' : '#047857' }}>
                      {emergencyControlsConfig.disableApiAccess ? 'SUSPENDED' : 'ACTIVE'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Suspends all external REST and GraphQL API traffic on API gateway endpoints.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: emergencyControlsConfig.disableApiAccess ? '#16a34a' : '#dc2626', marginTop: '12px', width: '100%', fontSize: '0.8rem' }}
                  onClick={() => handleOpenEmergencyModal('DISABLE_API_ACCESS', emergencyControlsConfig.disableApiAccess ? 'Restore API Access' : 'Disable API Access Globally')}
                >
                  {emergencyControlsConfig.disableApiAccess ? '🟢 Enable API Gateway' : '🔌 Suspend API Gateway'}
                </button>
              </div>

              {/* Action 4: Disable Integrations */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>🔗 Cut Off Integrations &amp; Webhooks</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: emergencyControlsConfig.disableIntegrations ? '#fee2e2' : '#ecfdf5', color: emergencyControlsConfig.disableIntegrations ? '#dc2626' : '#047857' }}>
                      {emergencyControlsConfig.disableIntegrations ? 'CUT OFF' : 'CONNECTED'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Instantly severs external CRM, ERP, and webhook sync triggers platform-wide.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: emergencyControlsConfig.disableIntegrations ? '#16a34a' : '#dc2626', marginTop: '12px', width: '100%', fontSize: '0.8rem' }}
                  onClick={() => handleOpenEmergencyModal('DISABLE_INTEGRATIONS', emergencyControlsConfig.disableIntegrations ? 'Restore Integrations' : 'Cut Off All Integrations')}
                >
                  {emergencyControlsConfig.disableIntegrations ? '🟢 Restore Integrations' : '🔗 Cut Off Integrations'}
                </button>
              </div>

              {/* Action 5: Revoke All API Keys */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>🔑 Revoke All Developer API Keys</strong>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Permanently revokes all generated developer API keys and secret bearer tokens.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#dc2626', marginTop: '12px', width: '100%', fontSize: '0.8rem' }}
                  onClick={() => handleOpenEmergencyModal('REVOKE_ALL_API_KEYS', 'Revoke All Developer API Keys')}
                >
                  🔑 Shred All API Keys
                </button>
              </div>

              {/* Action 6: Block Suspicious Device / IP */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px' }}>
                <strong style={{ fontSize: '0.86rem', color: '#991b1b' }}>🛡️ Block Suspicious Device / IP</strong>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 8px' }}>
                  Blacklist malicious IP addresses or compromised user-agent devices.
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 192.168.1.105"
                    style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                    value={newBlockedIpInput}
                    onChange={(e) => setNewBlockedIpInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ background: '#dc2626', fontSize: '0.74rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      if (!newBlockedIpInput.trim()) return;
                      handleOpenEmergencyModal('BLOCK_IP', `Block Suspicious IP (${newBlockedIpInput.trim()})`, newBlockedIpInput.trim());
                    }}
                  >
                    Block IP
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-section: Compromised Company Isolation */}
            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #fca5a5' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#991b1b', marginBottom: '8px' }}>
                🏢 Compromised Tenant Company Lockdown &amp; Isolation
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#7f1d1d', marginBottom: '10px' }}>
                Select a compromised tenant company to freeze its operations immediately without affecting other tenants.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {companies.map(c => {
                  const isFrozen = (emergencyControlsConfig.compromisedCompanies || []).includes(c.id) || (emergencyControlsConfig.compromisedCompanies || []).includes(c.name);
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: isFrozen ? '#fee2e2' : '#ffffff',
                        border: `1px solid ${isFrozen ? '#ef4444' : '#cbd5e1'}`,
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: isFrozen ? '#991b1b' : '#0f172a' }}>{c.name}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{c.code} &bull; {c.country}</div>
                      </div>
                      <button
                        type="button"
                        className="action-pill-btn"
                        style={{ background: isFrozen ? '#16a34a' : '#dc2626', color: '#ffffff', border: 'none', fontSize: '0.7rem', padding: '3px 8px' }}
                        onClick={() => handleOpenEmergencyModal('FREEZE_COMPANY', isFrozen ? `Unfreeze Company (${c.name})` : `Freeze Compromised Company (${c.name})`, c.id, c.name)}
                      >
                        {isFrozen ? 'Unfreeze' : 'Freeze'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
  );
}
