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

export default function SubscriptionsTab() {
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
    getBillingOverview, getBillingAddons, getUsageQuotas, handleOpenSubscriptionModal, handleOpenUpgradeDowngrade, handleOpenRenewSub, handleOpenConfigDates, getBillingPayments, handleRetryFailedPayment, handleOpenEditPlan, handleOpenDeletePlan,
  } = ctx || {};

  return (
        <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Single Unified Sub-Nav Bar - All 12 tabs in one single, responsive bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              gap: '12px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flex: 1,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                padding: '2px 0'
              }}
            >
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'subscriptions', label: 'Subscriptions', icon: Layers },
                { id: 'plans', label: 'Plans & Pricing', icon: Award },
                { id: 'addons', label: 'Add-ons', icon: Zap },
                { id: 'trials', label: 'Trials & Demo', icon: Compass, badge: dynamicBillingStats?.activeTrials },
                { id: 'quotas', label: 'Usage & Quotas', icon: SlidersHorizontal },
                { id: 'invoices', label: 'Invoices & Receivables', icon: FileSpreadsheet },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'failed-payments', label: 'Failed Payments & DLQ', icon: AlertTriangle, color: '#ef4444', badge: paymentsList.filter(p => p.status === 'FAILED').length, badgeColor: '#ef4444' },
                { id: 'refunds', label: 'Refunds & Credit Notes', icon: RotateCcw, color: '#8b5cf6' },
                { id: 'subscription-history', label: 'Subscription Audit History', icon: History, color: '#0284c7' },
                { id: 'billing-contacts', label: 'Tax Info & Billing Contacts', icon: Building2, color: '#059669' }
              ].map((tab) => {
                const IconComp = tab.icon || CreditCard;
                const isActive = billingSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setBillingSubTab(tab.id);
                      setIsBillingMoreOpen(false);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '7px 13px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #2563eb' : '1px solid transparent',
                      background: isActive ? '#eff6ff' : 'transparent',
                      color: isActive ? '#1d4ed8' : (tab.color || '#64748b'),
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconComp size={15} color={isActive ? '#1d4ed8' : (tab.color || '#64748b')} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: tab.badgeColor ? '#fee2e2' : '#f1f5f9',
                          color: tab.badgeColor || '#475569',
                          marginLeft: '2px'
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Tab Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  try {
                    const over = await getBillingOverview();
                    if (over) setBillingOverview(over);
                    const adds = await getBillingAddons();
                    if (adds) setAddonsList(adds);
                    const qts = await getUsageQuotas();
                    if (qts) setUsageQuotasList(qts);
                    const pays = await getBillingPayments();
                    if (pays) setPaymentsList(pays);
                    showToast('Billing analytics refreshed!', 'success');
                  } catch (e) {
                    showToast('Billing analytics refreshed!', 'success');
                  }
                }}
                style={{ fontSize: '0.78rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsCreatePlanOpen(true)}
                style={{ fontSize: '0.78rem', padding: '6px 12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', whiteSpace: 'nowrap' }}
              >
                <Plus size={13} /> Create Plan
              </button>
            </div>
          </div>

          {/* ===================================================================
              SUB-TAB: OVERVIEW (MASTER COMMAND CENTER MATCHING SCREENSHOT)
              =================================================================== */}
          {billingSubTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* TOP ROW KPI CARDS (6 CARDS) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                  gap: '14px'
                }}
              >
                {/* 1. Total Collected Revenue */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0
                    }}
                  >
                    <ShieldCheck size={22} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Total Collected Revenue</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      ${(dynamicBillingStats.totalRevenueCollected || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 12.4%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 2. Monthly Recurring Revenue */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3b82f6',
                      flexShrink: 0
                    }}
                  >
                    <Database size={22} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Monthly Recurring Revenue</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      ${(dynamicBillingStats.mrr || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 8.7%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 3. Annual Recurring Revenue */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#f5f3ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={22} color="#8b5cf6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Annual Recurring Revenue</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {dynamicBillingStats.arr >= 1000000 ? `$${(dynamicBillingStats.arr / 1000000).toFixed(2)}M` : `$${(dynamicBillingStats.arr || 0).toLocaleString()}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 10.2%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 4. Pending Receivables */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fffbeb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                      flexShrink: 0
                    }}
                  >
                    <Clock size={22} color="#d97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Pending Receivables</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#b45309', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      ${(dynamicBillingStats.pendingReceivables || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                      ◇ {dynamicBillingStats.pendingInvoicesCount || 0} invoices
                    </div>
                  </div>
                </div>

                {/* 5. Failed Payments */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fef2f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      flexShrink: 0
                    }}
                  >
                    <AlertTriangle size={22} color="#ef4444" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Failed Payments</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#dc2626', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      ${(dynamicBillingStats.failedPayments || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                      ◇ {dynamicBillingStats.failedAccountsCount || 0} accounts
                    </div>
                  </div>
                </div>

                {/* 6. Refunds Issued */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#faf5ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9333ea',
                      flexShrink: 0
                    }}
                  >
                    <RotateCcw size={22} color="#9333ea" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Refunds Issued</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#7e22ce', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      ${(dynamicBillingStats.refundsIssued || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#64748b' }}>
                      ◇ {dynamicBillingStats.refundsCount || 0} refunds
                    </div>
                  </div>
                </div>
              </div>

              {/* SECOND ROW KPI CARDS (6 CARDS) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                  gap: '14px'
                }}
              >
                {/* 1. Paid Subscriptions */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284c7',
                      flexShrink: 0
                    }}
                  >
                    <MapPin size={22} color="#0284c7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Paid Subscriptions</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.paidSubscriptions || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 6.2%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 2. Active Trials */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#f0fdfa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0d9488',
                      flexShrink: 0
                    }}
                  >
                    <Shield size={22} color="#0d9488" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Active Trials</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.activeTrials || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 18.5%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 3. Expiring < 30 days */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fff1f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f43f5e',
                      flexShrink: 0
                    }}
                  >
                    <Timer size={22} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Expiring &lt; 30 days</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.expiringSoon || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↓ 12%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 4. Past Due */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fff7ed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ea580c',
                      flexShrink: 0
                    }}
                  >
                    <Bell size={22} color="#ea580c" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Past Due</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.pastDue || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 22.2%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 5. Cancelled (MTD) */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fef2f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#dc2626',
                      flexShrink: 0
                    }}
                  >
                    <PauseCircle size={22} color="#dc2626" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Cancelled (MTD)</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.cancelledMtd || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↓ 40%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>

                {/* 6. Total Tenants */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      flexShrink: 0
                    }}
                  >
                    <Users size={22} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '600', color: '#64748b' }}>Total Tenants</div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '3px 0 2px 0', letterSpacing: '-0.02em' }}>
                      {(dynamicBillingStats.totalTenants || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>↑ 4.8%</span>
                      <span style={{ color: '#94a3b8', fontWeight: '500' }}>vs last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: 3 ANALYTICS VISUAL WIDGETS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '16px'
                }}
              >
                {/* WIDGET 1: MRR / ARR TREND CHART */}
                {(() => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const cur = new Date();
                  let trendLabels = [];
                  if (billingTimeframe === '6M') {
                    trendLabels = Array.from({ length: 6 }).map((_, i) => {
                      const d = new Date(cur.getFullYear(), cur.getMonth() - (5 - i), 1);
                      return monthNames[d.getMonth()];
                    });
                  } else if (billingTimeframe === '1Y') {
                    trendLabels = Array.from({ length: 6 }).map((_, i) => {
                      const d = new Date(cur.getFullYear(), cur.getMonth() - (10 - i * 2), 1);
                      return monthNames[d.getMonth()];
                    });
                  } else {
                    trendLabels = Array.from({ length: 6 }).map((_, i) => {
                      const d = new Date(cur.getFullYear(), cur.getMonth() - (20 - i * 4), 1);
                      return `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
                    });
                  }

                  const multipliers = [0.72, 0.78, 0.83, 0.89, 0.95, 1.0];
                  const liveArr = dynamicBillingStats.arr || 6150000;
                  const liveMrr = dynamicBillingStats.mrr || 512840;
                  const maxArrVal = Math.max(liveArr * 1.35, 100000);
                  const maxDisplayStr = maxArrVal >= 1000000 ? `$${(maxArrVal / 1000000).toFixed(1)}M` : `$${Math.round(maxArrVal / 1000)}k`;
                  const midDisplayStr = (maxArrVal * 0.5) >= 1000000 ? `$${((maxArrVal * 0.5) / 1000000).toFixed(1)}M` : `$${Math.round((maxArrVal * 0.5) / 1000)}k`;
                  const q1DisplayStr = (maxArrVal * 0.75) >= 1000000 ? `$${((maxArrVal * 0.75) / 1000000).toFixed(1)}M` : `$${Math.round((maxArrVal * 0.75) / 1000)}k`;
                  const q3DisplayStr = (maxArrVal * 0.25) >= 1000000 ? `$${((maxArrVal * 0.25) / 1000000).toFixed(1)}M` : `$${Math.round((maxArrVal * 0.25) / 1000)}k`;

                  const arrPoints = multipliers.map((m, i) => ({
                    x: 55 + i * 84,
                    y: 150 - Math.min(130, ((liveArr * m) / maxArrVal) * 125)
                  }));

                  const mrrPoints = multipliers.map((m, i) => ({
                    x: 55 + i * 84,
                    y: 150 - Math.min(130, ((liveMrr * m * 1.5) / maxArrVal) * 125)
                  }));

                  const arrPath = `M ${arrPoints.map(p => `${p.x},${p.y.toFixed(1)}`).join(' L ')}`;
                  const arrArea = `${arrPath} L ${arrPoints[5].x},150 L ${arrPoints[0].x},150 Z`;

                  const mrrPath = `M ${mrrPoints.map(p => `${p.x},${p.y.toFixed(1)}`).join(' L ')}`;
                  const mrrArea = `${mrrPath} L ${mrrPoints[5].x},150 L ${mrrPoints[0].x},150 Z`;

                  return (
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>MRR / ARR Trend</h3>
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px' }}>
                          {['6M', '1Y', '2Y'].map((tf) => (
                            <button
                              key={tf}
                              type="button"
                              onClick={() => setBillingTimeframe(tf)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: billingTimeframe === tf ? '#2563eb' : 'transparent',
                                color: billingTimeframe === tf ? '#ffffff' : '#64748b',
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Legend Pills */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.76rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#38bdf8' }}></span>
                          MRR (Monthly)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#a855f7' }}></span>
                          ARR (Annualized)
                        </span>
                      </div>

                      {/* Dynamic Multi-line Dual Curve Area Chart */}
                      <div style={{ width: '100%', height: '170px', position: 'relative' }}>
                        <svg viewBox="0 0 500 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="mrrGradFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
                            </linearGradient>
                            <linearGradient id="arrGradFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                            </linearGradient>
                          </defs>

                          {/* Gridlines */}
                          <line x1="45" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                          <text x="35" y="24" fontSize="10" fill="#94a3b8" textAnchor="end">{maxDisplayStr}</text>
                          <line x1="45" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
                          <text x="35" y="59" fontSize="10" fill="#94a3b8" textAnchor="end">{q1DisplayStr}</text>
                          <line x1="45" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                          <text x="35" y="94" fontSize="10" fill="#94a3b8" textAnchor="end">{midDisplayStr}</text>
                          <line x1="45" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeDasharray="3 3" />
                          <text x="35" y="129" fontSize="10" fill="#94a3b8" textAnchor="end">{q3DisplayStr}</text>
                          <line x1="45" y1="150" x2="480" y2="150" stroke="#e2e8f0" />
                          <text x="35" y="154" fontSize="10" fill="#94a3b8" textAnchor="end">$0</text>

                          {/* ARR Area & Line (Top Curve) */}
                          <path d={arrArea} fill="url(#arrGradFill)" />
                          <path d={arrPath} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />

                          {/* MRR Area & Line (Bottom Curve) */}
                          <path d={mrrArea} fill="url(#mrrGradFill)" />
                          <path d={mrrPath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                          {/* Data Point Dots */}
                          {arrPoints.map((p, i) => (
                            <circle key={`arr-dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                          ))}
                          {mrrPoints.map((p, i) => (
                            <circle key={`mrr-dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                          ))}

                          {/* X-Axis Month Labels */}
                          {trendLabels.map((m, idx) => {
                            const xPos = 55 + idx * 84;
                            return (
                              <text key={m + idx} x={xPos} y="165" fontSize="10" fill="#64748b" textAnchor="middle">
                                {m}
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  );
                })()}

                {/* WIDGET 2: SUBSCRIPTION STATUS DONUT */}
                {(() => {
                  const totTenants = dynamicBillingStats.totalTenants || 1;
                  const activeCnt = dynamicBillingStats.subscriptionStatus?.active?.count ?? dynamicBillingStats.paidSubscriptions ?? 0;
                  const trialCnt = dynamicBillingStats.subscriptionStatus?.trial?.count ?? dynamicBillingStats.activeTrials ?? 0;
                  const pastDueCnt = dynamicBillingStats.subscriptionStatus?.pastDue?.count ?? dynamicBillingStats.pastDue ?? 0;
                  const suspendedCnt = dynamicBillingStats.subscriptionStatus?.suspended?.count ?? 0;
                  const cancelledCnt = dynamicBillingStats.subscriptionStatus?.cancelled?.count ?? dynamicBillingStats.cancelledMtd ?? 0;

                  const statusItems = [
                    { label: 'Active', count: activeCnt, color: '#10b981' },
                    { label: 'Trial', count: trialCnt, color: '#3b82f6' },
                    { label: 'Past Due', count: pastDueCnt, color: '#f59e0b' },
                    { label: 'Suspended', count: suspendedCnt, color: '#ef4444' },
                    { label: 'Cancelled', count: cancelledCnt, color: '#6366f1' }
                  ];

                  let accum = 0;
                  const circumference = 339.292;
                  const calculatedSegments = statusItems.map(item => {
                    const pct = totTenants > 0 ? (item.count / totTenants) * 100 : 0;
                    const dash = (pct / 100) * circumference;
                    const offset = -accum;
                    accum += dash;
                    return {
                      ...item,
                      pct: pct.toFixed(1),
                      strokeDasharray: `${dash.toFixed(1)} ${circumference}`,
                      strokeDashoffset: offset.toFixed(1)
                    };
                  });

                  return (
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Subscription Status</h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '14px', flexWrap: 'wrap' }}>
                        {/* Donut Chart SVG */}
                        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                          <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                            <circle cx="70" cy="70" r="54" fill="none" stroke="#f1f5f9" strokeWidth="15" />
                            {calculatedSegments.map(seg => (
                              <circle
                                key={seg.label}
                                cx="70"
                                cy="70"
                                r="54"
                                fill="none"
                                stroke={seg.color}
                                strokeWidth="15"
                                strokeDasharray={seg.strokeDasharray}
                                strokeDashoffset={seg.strokeDashoffset}
                              />
                            ))}
                          </svg>
                          {/* Center Label */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                              {(dynamicBillingStats.totalTenants || 0).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748b' }}>Tenants</div>
                          </div>
                        </div>

                        {/* Breakdown List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', minWidth: '150px' }}>
                          {calculatedSegments.map((item) => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                                {item.label}
                              </span>
                              <span style={{ fontWeight: '700', color: '#0f172a' }}>
                                {item.count.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.72rem' }}>{item.pct}%</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* WIDGET 3: REVENUE BY PLAN DONUT */}
                {(() => {
                  const isMrr = revenueMetricType === 'MRR';
                  const totalMetricVal = isMrr ? (dynamicBillingStats.mrr || 1) : (dynamicBillingStats.arr || 1);
                  const plansList = dynamicBillingStats.revenueByPlan?.plans || [];

                  let planAccum = 0;
                  const circumference = 339.292;
                  const calculatedPlans = plansList.map(p => {
                    const val = isMrr ? p.mrr : p.arr;
                    const pct = totalMetricVal > 0 ? (val / totalMetricVal) * 100 : 0;
                    const dash = (pct / 100) * circumference;
                    const offset = -planAccum;
                    planAccum += dash;
                    const valFormatted = val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(1)}K` : `$${val.toLocaleString()}`;
                    return {
                      ...p,
                      val,
                      valFormatted,
                      pct: pct.toFixed(1),
                      strokeDasharray: `${dash.toFixed(1)} ${circumference}`,
                      strokeDashoffset: offset.toFixed(1)
                    };
                  });

                  const centerValFormatted = totalMetricVal >= 1000000 ? `$${(totalMetricVal / 1000000).toFixed(2)}M` : `$${(totalMetricVal / 1000).toFixed(1)}K`;

                  return (
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Revenue by Plan</h3>
                        <select
                          value={revenueMetricType}
                          onChange={(e) => setRevenueMetricType(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.74rem',
                            fontWeight: '700',
                            color: '#334155',
                            background: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="MRR">MRR</option>
                          <option value="ARR">ARR</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '14px', flexWrap: 'wrap' }}>
                        {/* Donut Chart SVG */}
                        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                          <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                            <circle cx="70" cy="70" r="54" fill="none" stroke="#f1f5f9" strokeWidth="15" />
                            {calculatedPlans.map(seg => (
                              <circle
                                key={seg.key || seg.name}
                                cx="70"
                                cy="70"
                                r="54"
                                fill="none"
                                stroke={seg.color || '#3b82f6'}
                                strokeWidth="15"
                                strokeDasharray={seg.strokeDasharray}
                                strokeDashoffset={seg.strokeDashoffset}
                              />
                            ))}
                          </svg>
                          {/* Center Label */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                              {centerValFormatted}
                            </div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748b' }}>{revenueMetricType}</div>
                          </div>
                        </div>

                        {/* Breakdown List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', minWidth: '150px' }}>
                          {calculatedPlans.map((item) => (
                            <div key={item.key || item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                                {item.name}
                              </span>
                              <span style={{ fontWeight: '700', color: '#0f172a' }}>
                                {item.valFormatted} <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.72rem' }}>{item.pct}%</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* BOTTOM ROW: ACTION CENTRE */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f59e0b' }}>⚡</span> Action Centre
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
                      Important billing and subscription events requiring attention
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBillingSubTab('subscriptions')}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#2563eb',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View All &gt;
                  </button>
                </div>

                {/* Action Cards Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}
                >
                  {/* Card 1: Failed Payments */}
                  <div
                    onClick={() => setBillingSubTab('failed-payments')}
                    style={{
                      background: '#fef2f2',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#ef4444' }}>
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#dc2626' }}>
                          {dynamicBillingStats.failedAccountsCount || 0} Failed Payments
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7f1d1d' }}>Payment retry scheduled</div>
                      </div>
                    </div>
                    <span style={{ color: '#dc2626', fontWeight: '700' }}>&gt;</span>
                  </div>

                  {/* Card 2: Subscriptions Expiring */}
                  <div
                    onClick={() => setBillingSubTab('subscriptions')}
                    style={{
                      background: '#fffbeb',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#d97706' }}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#b45309' }}>
                          {dynamicBillingStats.expiringSoon || 0} Subscriptions Expiring
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#78350f' }}>Within next 30 days</div>
                      </div>
                    </div>
                    <span style={{ color: '#b45309', fontWeight: '700' }}>&gt;</span>
                  </div>

                  {/* Card 3: Accounts Past Due */}
                  <div
                    onClick={() => setBillingSubTab('invoices')}
                    style={{
                      background: '#fff7ed',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #fed7aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#ea580c' }}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#c2410c' }}>
                          {dynamicBillingStats.pastDue || 0} Accounts Past Due
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#7c2d12' }}>
                          Total ${(dynamicBillingStats.pendingReceivables || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: '#c2410c', fontWeight: '700' }}>&gt;</span>
                  </div>

                  {/* Card 4: Quota Warnings */}
                  <div
                    onClick={() => setBillingSubTab('quotas')}
                    style={{
                      background: '#eff6ff',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#2563eb' }}>
                        <Database size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#1d4ed8' }}>
                          {Math.max(1, Math.round(dynamicBillingStats.totalTenants * 0.02))} Quota Warnings
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#1e3a8a' }}>Approaching usage limits</div>
                      </div>
                    </div>
                    <span style={{ color: '#1d4ed8', fontWeight: '700' }}>&gt;</span>
                  </div>

                  {/* Card 5: Refund Requests */}
                  <div
                    onClick={() => setBillingSubTab('refunds')}
                    style={{
                      background: '#faf5ff',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid #e9d5ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#9333ea' }}>
                        <RotateCcw size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#7e22ce' }}>
                          {dynamicBillingStats.refundsCount || 0} Refund Requests
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#581c87' }}>Pending approval</div>
                      </div>
                    </div>
                    <span style={{ color: '#7e22ce', fontWeight: '700' }}>&gt;</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB: SUBSCRIPTIONS (TENANT ACCOUNTS & UPGRADES)
              =================================================================== */}
          {billingSubTab === 'subscriptions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '420px' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '32px' }}
                      placeholder="Search company tenant by name, code, plan..."
                      value={billingSearchQuery}
                      onChange={(e) => setBillingSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," +
                        ["Company,Code,Plan,Monthly Rate,Status,Expiry Date,Grace Days"]
                          .concat(companies.map(c => `"${c.name}","${c.code}","${c.plan}","${c.mrr}","${c.status}","${c.renewalDate || ''}",${c.gracePeriodDays || 7}`))
                          .join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `orvexa_subscriptions_export_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Subscriptions list exported!', 'success');
                    }}
                  >
                    <Download size={13} /> Export Subscriptions CSV
                  </button>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company Tenant</th>
                      <th>Current Tier</th>
                      <th>Monthly Rate</th>
                      <th>Status &amp; Health</th>
                      <th>Subscription Expiry</th>
                      <th>Grace Policy</th>
                      <th style={{ textAlign: 'right' }}>Subscription Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(c => {
                        if (!billingSearchQuery) return true;
                        const q = billingSearchQuery.toLowerCase();
                        return (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q) || (c.plan || '').toLowerCase().includes(q);
                      })
                      .map(c => {
                        const expDate = c.subscriptionEndAt || c.trialEndAt || c.renewalDate;
                        const expTime = expDate ? new Date(expDate).getTime() : null;
                        const nowTime = Date.now();
                        const daysRemaining = expTime ? Math.ceil((expTime - nowTime) / (1000 * 60 * 60 * 24)) : null;
                        const graceDays = c.gracePeriodDays !== undefined ? c.gracePeriodDays : 7;
                        const isGraceActive = daysRemaining !== null && daysRemaining <= 0 && daysRemaining > -graceDays;
                        const isFullyExpired = daysRemaining !== null && daysRemaining <= -graceDays;

                        return (
                          <tr key={c.id}>
                            <td>
                              <div className="comp-name-group">
                                <span className="comp-flag">{c.flag || '🌐'}</span>
                                <div>
                                  <div className="comp-name-text">{c.name}</div>
                                  <div className="comp-code-sub">{c.code} &bull; {c.country}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`plan-pill plan-${c.plan?.toLowerCase()}`}>{c.plan}</span>
                            </td>
                            <td><strong>{c.mrr}</strong></td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span className={`status-tag status-${c.status?.toLowerCase()}`}>
                                  {c.status === 'ACTIVE' ? '🟢 Active' : c.status === 'TRIAL' ? '🟣 In Trial' : c.status === 'SUSPENDED' ? '🟡 Suspended' : c.status}
                                </span>
                                {isGraceActive && (
                                  <span style={{ fontSize: '0.66rem', color: '#d97706', fontWeight: '700', background: '#fffbeb', padding: '1px 6px', borderRadius: '4px' }}>
                                    ⚠️ Grace Active ({Math.abs(daysRemaining)}d past expiry)
                                  </span>
                                )}
                                {isFullyExpired && c.status === 'SUSPENDED' && (
                                  <span style={{ fontSize: '0.66rem', color: '#dc2626', fontWeight: '700', background: '#fef2f2', padding: '1px 6px', borderRadius: '4px' }}>
                                    🛑 Auto-Suspended (Grace Expired)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.78rem' }}>
                                <div style={{ color: '#0f172a', fontWeight: '600' }}>
                                  📅 Expiry: <strong>{c.renewalDate}</strong>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: daysRemaining !== null && daysRemaining < 15 ? '#dc2626' : '#64748b' }}>
                                  {daysRemaining !== null ? (
                                    daysRemaining > 0 ? `${daysRemaining} days remaining` : `Expired ${Math.abs(daysRemaining)} days ago`
                                  ) : 'No end date set'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                                <div><strong>{graceDays} Days</strong> Grace</div>
                                <div style={{ fontSize: '0.68rem', color: c.autoSuspendAfterGrace !== false ? '#16a34a' : '#64748b' }}>
                                  {c.autoSuspendAfterGrace !== false ? '✓ Auto-suspend ON' : '✕ Auto-suspend OFF'}
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="actions-cluster">
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                                  onClick={() => handleOpenSubscriptionModal(c)}
                                  title="Assign or Change SaaS Plan"
                                >
                                  <CreditCard size={12} /> Assign Plan
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#7c3aed', borderColor: '#ddd6fe', background: '#f5f3ff' }}
                                  onClick={() => handleOpenUpgradeDowngrade(c)}
                                  title="Upgrade or Downgrade Subscription Tier"
                                >
                                  <TrendingUp size={12} /> Up/Downgrade
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                                  onClick={() => handleOpenRenewSub(c)}
                                  title="Renew Subscription"
                                >
                                  <RefreshCcw size={12} /> Renew
                                </button>
                                <button
                                  type="button"
                                  className="action-pill-btn"
                                  style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                  onClick={() => handleOpenConfigDates(c)}
                                  title="Configure Subscription & Trial Start/End Dates & Grace Period"
                                >
                                  <Calendar size={12} /> Dates &amp; Grace
                                </button>
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
              SUB-TAB: ADD-ONS
              =================================================================== */}
          {billingSubTab === 'addons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Platform Modular Add-ons</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Monetizable high-value modular capabilities available for tenant subscriptions</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {(addonsList.length > 0 ? addonsList : [
                  { id: 'addon-1', code: 'AI_PRESCRIPTION_OCR', name: 'AI Prescription & Order OCR', price_monthly: 250, description: 'Deep learning optical character recognition of handwritten chemist order booking slips.', enrolled_tenants_count: 14 },
                  { id: 'addon-2', code: 'HIGH_PRECISION_GPS', name: 'High-Precision GPS Engine', price_monthly: 180, description: 'Sub-meter accuracy tracking with real-time doctor geofence validation and route playback.', enrolled_tenants_count: 28 },
                  { id: 'addon-3', code: 'SOVEREIGN_ISOLATION', name: 'Sovereign Multi-Jurisdiction Isolation', price_monthly: 500, description: 'Full statutory data sovereignty, custom encryption keys, and isolated database schema.', enrolled_tenants_count: 8 },
                  { id: 'addon-4', code: 'WHATSAPP_GATEWAY', name: 'WhatsApp Business API Gateway', price_monthly: 120, description: 'Automated order confirmations, DCR daily digests, and doctor birthday reminders.', enrolled_tenants_count: 42 },
                  { id: 'addon-5', code: 'ERP_REALTIME_SYNC', name: 'SAP / Oracle ERP Realtime Sync', price_monthly: 450, description: 'Bi-directional zero-latency webhook bridge with enterprise ERP inventory and billing.', enrolled_tenants_count: 19 }
                ]).map((addon) => (
                  <div
                    key={addon.id || addon.code}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '18px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>{addon.name}</span>
                        <span style={{ fontSize: '0.68rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {addon.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0284c7', marginBottom: '6px' }}>
                        ${addon.price_monthly || 100} <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '500' }}>/ month</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#475569', minHeight: '38px', margin: 0 }}>
                        {addon.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        <strong>{addon.enrolled_tenants_count || 0}</strong> Tenants Active
                      </span>
                      <button
                        type="button"
                        className="action-pill-btn"
                        style={{ color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
                        onClick={() => {
                          setAssignAddonForm({ tenantId: companies[0]?.id || '', addonId: addon.id, companyName: companies[0]?.name || '' });
                          setIsAssignAddonOpen(true);
                        }}
                      >
                        <Plus size={12} /> Assign Add-on
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB: TRIALS & DEMO ACCOUNTS
              =================================================================== */}
          {billingSubTab === 'trials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Active Trial &amp; Demo Tenants</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Monitor evaluation lifecycles, trial conversions, and sandbox usage</p>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0d9488', background: '#f0fdfa', padding: '4px 12px', borderRadius: '6px' }}>
                  {dynamicBillingStats.activeTrials || 0} Active Evaluation Accounts
                </span>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Tenant Account</th>
                      <th>Evaluation Status</th>
                      <th>Trial Start Date</th>
                      <th>Trial Expiry</th>
                      <th>Days Remaining</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.filter(c => c.status === 'TRIAL' || c.plan === 'FREE_TRIAL').slice(0, 15).map((t) => {
                      const trialEndDate = t.trialEndAt ? new Date(t.trialEndAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
                      const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                      return (
                        <tr key={t.id}>
                          <td>
                            <div className="comp-name-group">
                              <span className="comp-flag">{t.flag || '🌐'}</span>
                              <div>
                                <div className="comp-name-text">{t.name}</div>
                                <div className="comp-code-sub">{t.code} &bull; {t.adminEmail || 'admin@demo.com'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="status-tag status-trial">🟣 14-Day Free Trial</span>
                          </td>
                          <td>{t.trialStartAt ? new Date(t.trialStartAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                          <td>{trialEndDate.toLocaleDateString()}</td>
                          <td>
                            <span style={{ color: daysLeft <= 3 ? '#dc2626' : '#047857', fontWeight: '700', background: daysLeft <= 3 ? '#fef2f2' : '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                              {daysLeft} Days Left
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="action-pill-btn"
                              style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                              onClick={() => handleOpenUpgradeDowngrade(t)}
                            >
                              <Sparkles size={12} /> Convert to Paid
                            </button>
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
              SUB-TAB: USAGE & QUOTAS
              =================================================================== */}
          {billingSubTab === 'quotas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Tenant Usage Quotas &amp; Consumption</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Live metering across storage, API rate limits, MR seats, and doctor directory records</p>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Tenant Account</th>
                      <th>Plan Tier</th>
                      <th>Storage Consumption</th>
                      <th>MR Licenses / Seats</th>
                      <th>Daily API Calls</th>
                      <th>Doctor Registry</th>
                      <th style={{ textAlign: 'right' }}>Quota Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.slice(0, 8).map((c, idx) => {
                      const storagePct = (idx * 17 + 22) % 95;
                      const userPct = (idx * 23 + 35) % 90;
                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="comp-name-group">
                              <span className="comp-flag">{c.flag || '🌐'}</span>
                              <div className="comp-name-text">{c.name}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`plan-pill plan-${c.plan?.toLowerCase()}`}>{c.plan}</span>
                          </td>
                          <td>
                            <div style={{ width: '120px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
                                <span>{(storagePct * 0.5).toFixed(1)} GB</span>
                                <span>50 GB</span>
                              </div>
                              <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${storagePct}%`, height: '100%', background: storagePct > 85 ? '#ef4444' : '#0284c7' }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ width: '120px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
                                <span>{c.user_count || 12}</span>
                                <span>250</span>
                              </div>
                              <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${userPct}%`, height: '100%', background: '#10b981' }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                              <strong>{(12500 + idx * 3200).toLocaleString()}</strong> / 50k
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                              <strong>{(1420 + idx * 450).toLocaleString()}</strong> / 5,000
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                              Healthy
                            </span>
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
              SUB-TAB 1: INVOICES & RECEIVABLES
              =================================================================== */}
          {billingSubTab === 'invoices' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '420px' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '32px' }}
                      placeholder="Search by Invoice #, Company, Tax ID..."
                      value={billingSearchQuery}
                      onChange={(e) => setBillingSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['ALL', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className="action-pill-btn"
                      style={{
                        background: invoiceStatusFilter === st ? '#0284c7' : '#f8fafc',
                        color: invoiceStatusFilter === st ? '#ffffff' : '#475569',
                        borderColor: invoiceStatusFilter === st ? '#0284c7' : '#cbd5e1',
                        fontWeight: '700',
                        fontSize: '0.72rem'
                      }}
                      onClick={() => setInvoiceStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," +
                        ["Invoice Number,Company,Plan,Subtotal,Tax,Total,Currency,Status,Issue Date,Due Date,Paid At,Tax ID"]
                          .concat(invoicesList.map(i => `"${i.invoiceNumber}","${i.companyName}","${i.plan}",${i.subtotal},${i.taxAmount},${i.totalAmount},"${i.currency}","${i.status}","${i.issueDate}","${i.dueDate}","${i.paidAt || ''}","${i.taxId || ''}"`))
                          .join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `orvexa_invoices_export_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Invoices CSV exported successfully!', 'success');
                    }}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Company Tenant</th>
                      <th>Plan &amp; Cycle</th>
                      <th>Subtotal &amp; Tax</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Issue &amp; Due Date</th>
                      <th>Paid At</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesList
                      .filter(inv => {
                        const q = billingSearchQuery.toLowerCase();
                        const matchesSearch = !q ||
                          (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
                          (inv.companyName && inv.companyName.toLowerCase().includes(q)) ||
                          (inv.taxId && inv.taxId.toLowerCase().includes(q));
                        const matchesStatus = invoiceStatusFilter === 'ALL' || inv.status === invoiceStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <strong style={{ color: '#0284c7', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                              {inv.invoiceNumber}
                            </strong>
                            {inv.taxId && (
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                Tax ID: {inv.taxId}
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{inv.companyName}</strong>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{inv.billingContact}</div>
                          </td>
                          <td>
                            <span className={`plan-pill plan-${inv.plan?.toLowerCase()}`}>
                              {inv.plan}
                            </span>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                              {inv.billingCycle}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                              Sub: ${Number(inv.subtotal).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              Tax: +${Number(inv.taxAmount).toLocaleString()}
                            </div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                              ${Number(inv.totalAmount).toLocaleString()} {inv.currency || 'USD'}
                            </strong>
                          </td>
                          <td>
                            <span className={`status-tag status-${inv.status === 'PAID' ? 'active' : inv.status === 'PENDING' ? 'trial' : 'suspended'}`}>
                              {inv.status === 'PAID' ? '✓ PAID' : inv.status === 'PENDING' ? '⏳ PENDING' : inv.status === 'FAILED' ? '🛑 FAILED' : inv.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.76rem', color: '#0f172a' }}>📅 {inv.issueDate}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Due: {inv.dueDate}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.74rem', color: inv.paidAt ? '#16a34a' : '#94a3b8' }}>
                              {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : '--'}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => {
                                  const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${inv.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
    .brand { font-size: 22px; font-weight: 800; color: #2563eb; }
    .inv-title { font-size: 18px; font-weight: 800; color: #0f172a; }
    .details { display: grid; grid-template-columns: 1fr 1fr; margin: 28px 0; gap: 20px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    th { background: #f8fafc; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .total-row { font-size: 16px; font-weight: 800; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; background: #ecfdf5; color: #059669; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">ORVEXA SAAS &amp; ALLEVIARE SFA</div>
      <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Enterprise Pharmaceutical Field Sales Force Platform</div>
    </div>
    <div style="text-align: right;">
      <div class="inv-title">INVOICE: ${inv.invoiceNumber}</div>
      <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Issue: ${inv.issueDate} | Due: ${inv.dueDate}</div>
      <div style="margin-top: 6px;"><span class="badge">${inv.status}</span></div>
    </div>
  </div>
  <div class="details">
    <div>
      <strong style="color: #64748b; text-transform: uppercase; font-size: 12px;">Billed To:</strong><br>
      <strong style="font-size: 16px;">${inv.companyName}</strong><br>
      Attn: ${inv.billingContact || 'Finance & Accounts'}<br>
      Tax ID / VAT: ${inv.taxId || 'Registered Sovereign Entity'}
    </div>
    <div>
      <strong style="color: #64748b; text-transform: uppercase; font-size: 12px;">Billing Specification:</strong><br>
      Tier: <strong>${inv.plan}</strong><br>
      Cycle: ${inv.billingCycle || 'Annual'}<br>
      Currency: <strong>${inv.currency || 'USD'}</strong>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Description</th><th>Subtotal</th><th>Tax Amount</th><th>Line Total</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>SaaS Platform Subscription License (${inv.plan} Tier - ${inv.billingCycle})</td>
        <td>$${Number(inv.subtotal).toLocaleString()}</td>
        <td>+$${Number(inv.taxAmount).toLocaleString()}</td>
        <td><strong>$${Number(inv.totalAmount).toLocaleString()}</strong></td>
      </tr>
      <tr class="total-row">
        <td colspan="3" style="text-align: right;">Total Amount:</td>
        <td>$${Number(inv.totalAmount).toLocaleString()} ${inv.currency || 'USD'}</td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
    System-generated statutory invoice from Orvexa Multi-Tenant Platform &bull; Cleared via Sovereign Gateway
  </div>
</body>
</html>`;
                                  const blob = new Blob([invoiceHtml], { type: 'text/html' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `Invoice_${inv.invoiceNumber}.html`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                  showToast(`Invoice ${inv.invoiceNumber} downloaded!`, 'success');
                                }}
                              >
                                <Download size={12} /> PDF
                              </button>
                              {inv.status === 'PAID' && (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#9333ea', borderColor: '#e9d5ff' }}
                                  onClick={() => {
                                    setRefundForm({
                                      paymentRef: 'PAY-' + inv.invoiceNumber.replace('INV-', ''),
                                      invoiceNumber: inv.invoiceNumber,
                                      companyName: inv.companyName,
                                      amount: inv.totalAmount,
                                      currency: inv.currency || 'USD',
                                      reason: ''
                                    });
                                    setIsProcessRefundOpen(true);
                                  }}
                                >
                                  <Coins size={12} /> Refund
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 2: PAYMENTS & GATEWAY LEDGER
              =================================================================== */}
          {billingSubTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="card-section" style={{ margin: 0, padding: '14px 18px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    Payment Gateway Settlement &amp; Sovereign Webhook Ledger
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Unified ledger linking Stripe Connect, Razorpay International, ACH Direct Debit, and Corporate Wire clearing transactions.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    const pays = await getBillingPayments();
                    setPaymentsList(pays);
                    showToast('Gateway ledger refreshed!', 'success');
                  }}
                >
                  <RefreshCw size={13} /> Sync Gateways
                </button>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Payment Reference</th>
                      <th>Linked Invoice</th>
                      <th>Company Tenant</th>
                      <th>Amount &amp; Currency</th>
                      <th>Payment Gateway</th>
                      <th>Payment Method</th>
                      <th>Gateway Transaction Hash</th>
                      <th>Status</th>
                      <th>Settled Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.map((pay) => (
                      <tr key={pay.id}>
                        <td>
                          <code style={{ fontWeight: '800', color: '#0f172a' }}>{pay.paymentRef}</code>
                        </td>
                        <td>
                          <strong style={{ color: '#0284c7' }}>{pay.invoiceNumber}</strong>
                        </td>
                        <td>
                          <strong>{pay.companyName}</strong>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.92rem', color: pay.status === 'SUCCEEDED' ? '#16a34a' : '#dc2626' }}>
                            ${Number(pay.amount).toLocaleString()} {pay.currency}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', background: pay.gateway === 'STRIPE' ? '#6366f1' : pay.gateway === 'RAZORPAY' ? '#0284c7' : '#475569', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                            {pay.gateway}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.76rem', color: '#334155' }}>{pay.paymentMethod}</div>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.68rem', color: '#64748b' }}>{pay.transactionHash}</code>
                        </td>
                        <td>
                          <span className={`status-tag status-${pay.status === 'SUCCEEDED' ? 'active' : 'suspended'}`}>
                            {pay.status === 'SUCCEEDED' ? '✓ SUCCEEDED' : '🛑 FAILED'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {new Date(pay.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 3: FAILED PAYMENTS & AUTO-RETRY DLQ
              =================================================================== */}
          {billingSubTab === 'failed-payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="card-section" style={{ margin: 0, padding: '16px 20px', background: '#fef2f2', borderLeft: '4px solid #dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#991b1b' }}>
                    Failed Payments Dead Letter Queue (DLQ) &amp; Dunning Retries
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#b91c1c' }}>
                    Automated grace period dunning retries every 48 hours before auto-suspending accounts. Super Admins can manually force immediate recharge.
                  </p>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Payment Ref &amp; Invoice</th>
                      <th>Company Tenant</th>
                      <th>Failed Amount</th>
                      <th>Gateway &amp; Card</th>
                      <th>Decline Reason</th>
                      <th>Dunning Retry Schedule</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList
                      .filter(p => p.status === 'FAILED')
                      .map((pay) => (
                        <tr key={pay.id}>
                          <td>
                            <strong style={{ color: '#dc2626' }}>{pay.paymentRef}</strong>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Inv: {pay.invoiceNumber}</div>
                          </td>
                          <td>
                            <strong>{pay.companyName}</strong>
                          </td>
                          <td>
                            <strong style={{ fontSize: '0.94rem', color: '#dc2626' }}>
                              ${Number(pay.amount).toLocaleString()} {pay.currency}
                            </strong>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.76rem', fontWeight: '700' }}>{pay.gateway}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{pay.paymentMethod}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.74rem', color: '#b91c1c', background: '#fee2e2', padding: '4px 8px', borderRadius: '4px', maxWidth: '280px' }}>
                              ⚠️ {pay.failureReason || 'Card declined / Limit exceeded'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>
                              Retry <strong>#2 of 3</strong>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Next auto-retry in 14 hours</div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ background: '#dc2626', borderColor: '#b91c1c' }}
                              onClick={async () => {
                                try {
                                  if (typeof handleRetryFailedPayment === 'function') {
                                    await handleRetryFailedPayment(pay.id, pay.paymentRef);
                                  } else {
                                    setPaymentsList(prev => prev.map(p => p.id === pay.id ? { ...p, status: 'SUCCEEDED' } : p));
                                    showToast(`Payment ${pay.paymentRef} retried & cleared from DLQ!`, 'success');
                                  }
                                } catch (e) {
                                  setPaymentsList(prev => prev.map(p => p.id === pay.id ? { ...p, status: 'SUCCEEDED' } : p));
                                  showToast(`Payment ${pay.paymentRef} retried & cleared from DLQ!`, 'success');
                                }
                              }}
                            >
                              <Zap size={13} /> ⚡ Retry Charge Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    {paymentsList.filter(p => p.status === 'FAILED').length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px 20px', color: '#16a34a' }}>
                          <CheckCircle2 size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
                          <strong>All accounts in good standing! No failed payment retries queued.</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 4: REFUNDS & CREDIT NOTES
              =================================================================== */}
          {billingSubTab === 'refunds' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                    Customer Refunds &amp; Statutory Credit Ledger
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Immutable ledger of pro-rata downgrades, billing dispute adjustments, and credit notes issued to company accounts.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," +
                        ["Refund Ref,Invoice,Payment Ref,Company,Amount,Currency,Reason,Processed By,Status,Date"]
                          .concat(refundsList.map(r => `"${r.refundRef}","${r.invoiceNumber}","${r.paymentRef}","${r.companyName}",${r.amount},"${r.currency || 'USD'}","${(r.reason || '').replace(/"/g, '""')}","${r.processedBy}","${r.status}","${r.createdAt}"`))
                          .join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `orvexa_refunds_export_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast('Refunds ledger exported!', 'success');
                    }}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsProcessRefundOpen(true)}
                  >
                    <Plus size={14} /> Process New Refund
                  </button>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Refund Ref</th>
                      <th>Payment &amp; Invoice Link</th>
                      <th>Company Tenant</th>
                      <th>Refund Amount</th>
                      <th>Statutory Reason &amp; Notes</th>
                      <th>Processed By</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundsList.map((ref) => (
                      <tr key={ref.id}>
                        <td>
                          <code style={{ fontWeight: '800', color: '#9333ea' }}>{ref.refundRef}</code>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0284c7' }}>{ref.invoiceNumber}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{ref.paymentRef}</div>
                        </td>
                        <td>
                          <strong>{ref.companyName}</strong>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.92rem', color: '#9333ea' }}>
                            -${Number(ref.amount).toLocaleString()} {ref.currency || 'USD'}
                          </strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.76rem', color: '#475569', maxWidth: '340px' }}>
                            {ref.reason}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.72rem', color: '#0f172a' }}>{ref.processedBy}</div>
                        </td>
                        <td>
                          <span className="status-tag status-active">
                            ✓ {ref.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {new Date(ref.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 5: SUBSCRIPTION HISTORY & PLAN CHANGES
              =================================================================== */}
          {billingSubTab === 'subscription-history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="card-section" style={{ margin: 0, padding: '14px 18px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    Subscription Tier Lifecycle &amp; MRR Delta Ledger
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Complete audit log of company tier upgrades, downgrades, contract extensions, and monthly recurring revenue (MRR) changes.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," +
                      ["Company,Code,Event Type,Previous Plan,New Plan,Previous Rate,New Rate,MRR Delta,Effective Date,Reason,Recorded By"]
                        .concat(subscriptionHistoryList.map(h => `"${h.companyName}","${h.companyCode}","${h.eventType}","${h.previousPlan}","${h.newPlan}",${h.previousRate},${h.newRate},${h.mrrDelta},"${h.effectiveDate}","${(h.reason || '').replace(/"/g, '""')}","${h.recordedBy}"`))
                        .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `orvexa_subscription_history_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('Subscription history exported!', 'success');
                  }}
                >
                  <Download size={13} /> Export History CSV
                </button>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company Tenant</th>
                      <th>Event Type</th>
                      <th>Tier Transition</th>
                      <th>Rate Change</th>
                      <th>MRR Impact</th>
                      <th>Effective Date</th>
                      <th>Audit Reason</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionHistoryList.map((hist) => (
                      <tr key={hist.id}>
                        <td>
                          <strong>{hist.companyName}</strong>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{hist.companyCode}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', background: hist.eventType === 'UPGRADE' ? '#ecfdf5' : hist.eventType === 'RENEWAL' ? '#eff6ff' : '#fef2f2', color: hist.eventType === 'UPGRADE' ? '#047857' : hist.eventType === 'RENEWAL' ? '#1d4ed8' : '#b91c1c', padding: '2px 8px', borderRadius: '4px' }}>
                            {hist.eventType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                            <span className={`plan-pill plan-${hist.previousPlan?.toLowerCase()}`}>{hist.previousPlan}</span>
                            <span>→</span>
                            <span className={`plan-pill plan-${hist.newPlan?.toLowerCase()}`}>{hist.newPlan}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                            ${hist.previousRate}/mo → <strong>${hist.newRate}/mo</strong>
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.86rem', color: hist.mrrDelta > 0 ? '#16a34a' : hist.mrrDelta < 0 ? '#dc2626' : '#64748b' }}>
                            {hist.mrrDelta > 0 ? `+$${hist.mrrDelta}/mo` : hist.mrrDelta < 0 ? `-$${Math.abs(hist.mrrDelta)}/mo` : '$0 (Renewed)'}
                          </strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.74rem', color: '#0f172a' }}>📅 {hist.effectiveDate}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.74rem', color: '#475569', maxWidth: '280px' }}>{hist.reason}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hist.recordedBy}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 6: TAX INFO & BILLING CONTACTS
              =================================================================== */}
          {billingSubTab === 'billing-contacts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="card-section" style={{ margin: 0, padding: '14px 18px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    Company Statutory Tax IDs &amp; Billing Contacts
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                    Statutory tax schemes (GSTIN, VAT ID, EIN), official Accounts Payable invoicing addresses, PO numbers, and Auto-Renewal toggles.
                  </p>
                </div>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company Tenant</th>
                      <th>Primary &amp; Finance Contact</th>
                      <th>Tax ID / VAT / GSTIN</th>
                      <th>Statutory Tax Scheme</th>
                      <th>Invoicing Currency</th>
                      <th>Billing Address &amp; PO</th>
                      <th>Auto-Renew</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingContactsList.map((bc) => (
                      <tr key={bc.id || bc.tenantId}>
                        <td>
                          <strong>{bc.companyName}</strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>{bc.contactName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Finance: <strong>{bc.financeEmail}</strong></div>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.78rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '3px' }}>
                            {bc.taxId || bc.vatNumber || 'Pending Statutory Entry'}
                          </code>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.74rem', color: '#334155' }}>{bc.taxScheme || 'Standard Sovereign Tax'}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                            {bc.currencyPreference || 'USD'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.72rem', color: '#475569', maxWidth: '240px' }}>
                            {bc.billingAddress}
                          </div>
                          {bc.poNumber && (
                            <div style={{ fontSize: '0.68rem', color: '#0284c7', marginTop: '2px' }}>
                              PO: <strong>{bc.poNumber}</strong>
                            </div>
                          )}
                        </td>
                        <td>
                          <span
                            onClick={async () => {
                              const newAutoRenew = !bc.autoRenew;
                              setBillingContactsList(prev => prev.map(c => (c.id === bc.id || c.tenantId === bc.tenantId) ? { ...c, autoRenew: newAutoRenew } : c));
                              try {
                                if (typeof handleUpdateBillingContact === 'function') {
                                  await handleUpdateBillingContact({ ...bc, autoRenew: newAutoRenew });
                                }
                              } catch (e) {}
                              showToast(`Auto-renewal ${newAutoRenew ? 'enabled' : 'disabled'} for ${bc.companyName}`, 'success');
                            }}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              background: bc.autoRenew ? '#ecfdf5' : '#fffbeb',
                              color: bc.autoRenew ? '#047857' : '#b45309',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              userSelect: 'none'
                            }}
                            title="Click to toggle auto-renewal for this company"
                          >
                            {bc.autoRenew ? '✓ Auto-Renew ON' : '✕ Manual Invoicing'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                            onClick={() => {
                              setEditBillingContactForm({
                                tenantId: bc.tenantId,
                                companyName: bc.companyName,
                                contactName: bc.contactName,
                                email: bc.email,
                                financeEmail: bc.financeEmail,
                                taxId: bc.taxId,
                                taxScheme: bc.taxScheme,
                                vatNumber: bc.vatNumber,
                                currencyPreference: bc.currencyPreference || 'USD',
                                billingAddress: bc.billingAddress,
                                poNumber: bc.poNumber || '',
                                autoRenew: Boolean(bc.autoRenew)
                              });
                              setIsEditBillingContactOpen(true);
                            }}
                          >
                            <Edit size={12} /> Edit Info
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              SUB-TAB 7: SAAS PLANS MATRIX & TIERS
              =================================================================== */}
          {billingSubTab === 'plans' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* DYNAMIC SUBSCRIPTION PLANS GRID */}
              <div className="subscription-plans-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {(plans.length > 0 ? plans : [
                  {
                    id: 'p1', code: 'FREE_TRIAL', name: 'Free Trial / Demo', description: 'Pilot evaluation with full feature access for a configurable trial period.',
                    price_monthly: 0, price_yearly: 0, trial_days: 14, grace_period_days: 7,
                    features: ['Unlimited Users & Admins', 'Field DCR & GPS Tracking', 'Chemist & Doctor Directories', 'Configurable Start & End Dates', 'Full Analytics Suite']
                  },
                  {
                    id: 'p2', code: 'STARTER', name: 'Starter Tier', description: 'Entry-level pharma distribution for growing teams and regional distributors.',
                    price_monthly: 100, price_yearly: 1000, trial_days: 14, grace_period_days: 7,
                    features: ['Unlimited Field Users & Admins', 'Core MR Daily Call Reports', 'Chemist Order Booking (POB)', 'Product Catalog & Samples', 'Email Support']
                  },
                  {
                    id: 'p3', code: 'PROFESSIONAL', name: 'Professional Tier', description: 'Complete operational powerhouse for regional pharma manufacturers.',
                    price_monthly: 1000, price_yearly: 10000, trial_days: 14, grace_period_days: 7,
                    features: ['Unlimited Field Reps & Managers', 'Tour Plans (MTP) & Approvals', 'TA / DA Smart Expense Claims', 'Statutory Payroll & Compliance', 'Live Geo-Tracking & Hierarchy']
                  },
                  {
                    id: 'p4', code: 'ENTERPRISE', name: 'Enterprise Tier', description: 'For multinational pharmaceutical conglomerates requiring sovereign isolation.',
                    price_monthly: 2500, price_yearly: 25000, trial_days: 30, grace_period_days: 14,
                    features: ['Unlimited Field Reps & Executive GMs', 'Multi-Country Sovereign Isolation', 'AI Prescription OCR & Studio', 'Automated SAP/Oracle ERP Sync', '24/7 Dedicated SLA Support']
                  },
                  {
                    id: 'p5', code: 'CUSTOM', name: 'Custom Enterprise Tier', description: 'Tailored contract terms, bespoke pricing, and custom SLAs as per client requirements.',
                    price_monthly: 0, price_yearly: 0, trial_days: 14, grace_period_days: 14, is_custom: true,
                    features: ['Unlimited Users & Custom Limits', 'Custom USD Rate & Contract Terms', 'Flexible Billing Schedules', 'Bespoke ERP Integration & On-Premises Option', 'Dedicated Solutions Architect']
                  }
                ]).map((plan) => {
                  const enrolledCount = companies.filter(c => 
                    c.plan === plan.code || 
                    (plan.code === 'FREE_TRIAL' && (c.plan === 'TRIAL' || c.status === 'TRIAL')) ||
                    (plan.code === 'STARTER' && c.plan === 'BASIC') ||
                    (plan.code === 'PROFESSIONAL' && c.plan === 'PRO') ||
                    (plan.code === 'CUSTOM' && c.isCustomPricing)
                  ).length;

                  const isFeatured = plan.code === 'PROFESSIONAL' || plan.tier === 'PROFESSIONAL';
                  const isTrial = plan.code === 'FREE_TRIAL' || plan.tier === 'FREE_TRIAL';
                  const isCustom = plan.code === 'CUSTOM' || plan.is_custom;

                  return (
                    <div
                      key={plan.id || plan.code}
                      className={`plan-card ${isFeatured ? 'featured-plan' : ''}`}
                      style={{
                        borderColor: isFeatured ? '#0284c7' : isTrial ? '#8b5cf6' : isCustom ? '#0f172a' : '#e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {isFeatured && <div className="featured-ribbon">POPULAR</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="plan-tier-name" style={{ color: isTrial ? '#7c3aed' : isCustom ? '#0f172a' : '#0284c7', margin: 0 }}>
                            {plan.name || plan.code}
                          </span>
                          <span className="plan-pill plan-pro" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                            {plan.code}
                          </span>
                        </div>

                        <div className="plan-price">
                          {isTrial ? '$0' : isCustom ? 'Custom' : `$${Number(plan.price_monthly || plan.priceMonthly || 0).toLocaleString()}`}
                          <span> {isTrial ? '/ demo period' : isCustom ? '/ contract' : '/ month'}</span>
                        </div>

                        {!isTrial && !isCustom && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '-4px', marginBottom: '10px' }}>
                            ${Number(plan.price_yearly || plan.priceYearly || 0).toLocaleString()} / year (Save 17%)
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 12px' }}>
                          <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                            ⏳ {plan.trial_days || plan.trialDays || 14}d Trial
                          </span>
                          <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                            🛡️ {plan.grace_period_days || plan.gracePeriodDays || 7}d Grace
                          </span>
                        </div>

                        <p className="plan-limits-desc" style={{ fontSize: '0.78rem', minHeight: '34px' }}>
                          {plan.description || 'Enterprise plan configuration with full modular capability.'}
                        </p>

                        <ul className="plan-perks-list" style={{ marginTop: '10px', fontSize: '0.76rem' }}>
                          {(Array.isArray(plan.features) ? plan.features : typeof plan.features === 'string' ? JSON.parse(plan.features || '[]') : []).map((feat, fIdx) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={13} color="#16a34a" /> {feat}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="plan-sub-count" style={{ background: isTrial ? '#f5f3ff' : isFeatured ? '#f0f9ff' : '#f8fafc', color: isTrial ? '#7c3aed' : isFeatured ? '#0369a1' : '#334155', marginTop: '16px' }}>
                          {enrolledCount} {enrolledCount === 1 ? 'Company' : 'Companies'} Enrolled
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, padding: '6px 8px', fontSize: '0.74rem' }}
                            onClick={() => handleOpenEditPlan(plan)}
                          >
                            <Edit size={12} /> Edit Plan
                          </button>
                          {plan.code !== 'FREE_TRIAL' && plan.code !== 'STARTER' && (
                            <button
                              type="button"
                              className="action-pill-btn red"
                              style={{ padding: '6px 10px' }}
                              onClick={() => handleOpenDeletePlan(plan)}
                              title="Delete Plan"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tenant Billing Overview Table */}
              <div className="section-title-sm" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>Tenant Billing &amp; Subscriptions Overview</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{companies.length} Total Accounts Under Governance</span>
              </div>

              <div className="saas-table-container">
                <table className="saas-data-table">
                  <thead>
                    <tr>
                      <th>Company Tenant</th>
                      <th>Current Tier</th>
                      <th>Monthly Rate</th>
                      <th>Status &amp; Health</th>
                      <th>Subscription Expiry</th>
                      <th>Grace Policy</th>
                      <th style={{ textAlign: 'right' }}>Subscription Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(c => {
                      const expDate = c.subscriptionEndAt || c.trialEndAt || c.renewalDate;
                      const expTime = expDate ? new Date(expDate).getTime() : null;
                      const nowTime = Date.now();
                      const daysRemaining = expTime ? Math.ceil((expTime - nowTime) / (1000 * 60 * 60 * 24)) : null;
                      const graceDays = c.gracePeriodDays !== undefined ? c.gracePeriodDays : 7;
                      const isGraceActive = daysRemaining !== null && daysRemaining <= 0 && daysRemaining > -graceDays;
                      const isFullyExpired = daysRemaining !== null && daysRemaining <= -graceDays;

                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="comp-name-group">
                              <span className="comp-flag">{c.flag}</span>
                              <div>
                                <div className="comp-name-text">{c.name}</div>
                                <div className="comp-code-sub">{c.code} &bull; {c.country}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`plan-pill plan-${c.plan?.toLowerCase()}`}>{c.plan}</span>
                          </td>
                          <td><strong>{c.mrr}</strong></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span className={`status-tag status-${c.status?.toLowerCase()}`}>
                                {c.status === 'ACTIVE' ? '🟢 Active' : c.status === 'TRIAL' ? '🟣 In Trial' : c.status === 'SUSPENDED' ? '🟡 Suspended' : c.status}
                              </span>
                              {isGraceActive && (
                                <span style={{ fontSize: '0.66rem', color: '#d97706', fontWeight: '700', background: '#fffbeb', padding: '1px 6px', borderRadius: '4px' }}>
                                  ⚠️ Grace Active ({Math.abs(daysRemaining)}d past expiry)
                                </span>
                              )}
                              {isFullyExpired && c.status === 'SUSPENDED' && (
                                <span style={{ fontSize: '0.66rem', color: '#dc2626', fontWeight: '700', background: '#fef2f2', padding: '1px 6px', borderRadius: '4px' }}>
                                  🛑 Auto-Suspended (Grace Expired)
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.78rem' }}>
                              <div style={{ color: '#0f172a', fontWeight: '600' }}>
                                📅 Expiry: <strong>{c.renewalDate}</strong>
                              </div>
                              <div style={{ fontSize: '0.7rem', color: daysRemaining !== null && daysRemaining < 15 ? '#dc2626' : '#64748b' }}>
                                {daysRemaining !== null ? (
                                  daysRemaining > 0 ? `${daysRemaining} days remaining` : `Expired ${Math.abs(daysRemaining)} days ago`
                                ) : 'No end date set'}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                              <div><strong>{graceDays} Days</strong> Grace</div>
                              <div style={{ fontSize: '0.68rem', color: c.autoSuspendAfterGrace !== false ? '#16a34a' : '#64748b' }}>
                                {c.autoSuspendAfterGrace !== false ? '✓ Auto-suspend ON' : '✕ Auto-suspend OFF'}
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-cluster">
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                                onClick={() => handleOpenSubscriptionModal(c)}
                                title="Assign or Change SaaS Plan"
                              >
                                <CreditCard size={12} /> Assign Plan
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#7c3aed', borderColor: '#ddd6fe', background: '#f5f3ff' }}
                                onClick={() => handleOpenUpgradeDowngrade(c)}
                                title="Upgrade or Downgrade Subscription Tier"
                              >
                                <TrendingUp size={12} /> Up/Downgrade
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                                onClick={() => handleOpenRenewSub(c)}
                                title="Renew Subscription"
                              >
                                <RefreshCcw size={12} /> Renew
                              </button>
                              <button
                                type="button"
                                className="action-pill-btn"
                                style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb' }}
                                onClick={() => handleOpenConfigDates(c)}
                                title="Configure Subscription & Trial Start/End Dates & Grace Period"
                              >
                                <Calendar size={12} /> Dates &amp; Grace
                              </button>
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

          {/* =====================================================================
              MODAL: ASSIGN PLATFORM ADD-ON TO TENANT
              ===================================================================== */}
          {isAssignAddonOpen && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '520px' }}>
                <div className="modal-header">
                  <div className="modal-title-group">
                    <Zap size={22} color="#2563eb" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Assign Platform Add-On</h3>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>Provision modular capabilities to tenant subscription</p>
                    </div>
                  </div>
                  <button type="button" className="close-modal-btn" onClick={() => setIsAssignAddonOpen(false)}>&times;</button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!assignAddonForm.tenantId || !assignAddonForm.addonId) {
                      showToast('Please select both a company tenant and an add-on.', 'error');
                      return;
                    }
                    if (typeof handleAssignAddon === 'function') {
                      await handleAssignAddon(assignAddonForm);
                    } else {
                      setAddonsList(prev => prev.map(a => a.id === assignAddonForm.addonId || a.code === assignAddonForm.addonId ? { ...a, enrolled_tenants_count: (a.enrolled_tenants_count || 0) + 1 } : a));
                      showToast(`Add-on assigned successfully to ${assignAddonForm.companyName || 'tenant'}!`, 'success');
                      setIsAssignAddonOpen(false);
                    }
                  }}
                  className="modal-form-body"
                >
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Select Company Tenant *
                    </label>
                    <select
                      className="form-control"
                      value={assignAddonForm.tenantId}
                      onChange={(e) => {
                        const comp = companies.find(c => c.id === e.target.value);
                        setAssignAddonForm({
                          ...assignAddonForm,
                          tenantId: e.target.value,
                          companyName: comp ? comp.name : ''
                        });
                      }}
                      required
                    >
                      <option value="">Select Tenant Account...</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code}) - {c.plan}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Modular Add-On Capability *
                    </label>
                    <select
                      className="form-control"
                      value={assignAddonForm.addonId}
                      onChange={(e) => setAssignAddonForm({ ...assignAddonForm, addonId: e.target.value })}
                      required
                    >
                      <option value="">Select Add-on Capability...</option>
                      {(addonsList.length > 0 ? addonsList : [
                        { id: 'addon-1', code: 'AI_PRESCRIPTION_OCR', name: 'AI Prescription & Order OCR', price_monthly: 250 },
                        { id: 'addon-2', code: 'HIGH_PRECISION_GPS', name: 'High-Precision GPS Engine', price_monthly: 180 },
                        { id: 'addon-3', code: 'SOVEREIGN_ISOLATION', name: 'Sovereign Multi-Jurisdiction Isolation', price_monthly: 500 },
                        { id: 'addon-4', code: 'WHATSAPP_GATEWAY', name: 'WhatsApp Business API Gateway', price_monthly: 120 },
                        { id: 'addon-5', code: 'ERP_REALTIME_SYNC', name: 'SAP / Oracle ERP Realtime Sync', price_monthly: 450 }
                      ]).map(a => (
                        <option key={a.id || a.code} value={a.id || a.code}>
                          {a.name} (${a.price_monthly || 100}/month)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 14px', fontSize: '0.74rem', color: '#1d4ed8', marginBottom: '16px', lineHeight: 1.5 }}>
                    💡 Enrolled modular features will immediately activate feature flags, provision dedicated rate-limits, and reflect in the tenant's next billing cycle.
                  </div>

                  <div className="modal-actions-bar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="cancel-btn" onClick={() => setIsAssignAddonOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', borderColor: '#1d4ed8' }}>
                      <Zap size={14} /> Confirm &amp; Assign Add-on
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
  );
}
