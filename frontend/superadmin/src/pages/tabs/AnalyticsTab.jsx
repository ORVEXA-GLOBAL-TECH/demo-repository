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

export default function AnalyticsTab() {
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
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          <div className="pane-action-bar">
            <div>
              <h2 className="section-title">Platform-Wide Intelligence &amp; Telemetry Analytics</h2>
              <p className="section-desc">Real-time user engagement, operational intensity leaderboard, API gateways, storage consumption, and global authentication activity.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Timeframe:</span>
              {['24h', '7d', '30d', 'MTD'].map(tf => (
                <button
                  key={tf}
                  type="button"
                  className="action-pill-btn"
                  style={{
                    background: analyticsTimeframe === tf ? '#0284c7' : '#ffffff',
                    color: analyticsTimeframe === tf ? '#ffffff' : '#475569',
                    borderColor: analyticsTimeframe === tf ? '#0284c7' : '#cbd5e1',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                  onClick={() => setAnalyticsTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Multi-Tenant Isolation Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <ShieldCheck size={26} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.88rem' }}>
                Multi-Tenant Data Privacy &amp; Isolation Enforced
              </div>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                Contractual multi-tenant partition is strictly maintained. Cross-company commercial records are isolated. Super Admin monitors aggregated platform health and infrastructure telemetry without compromising tenant confidentiality.
              </div>
            </div>
          </div>

          {/* 1. HERO ENGAGEMENT METRICS (4 Grid Cards) */}
          {(() => {
            const u = platformAnalytics?.users || {
              totalUsers: platformUsers.length || 120,
              activeUsers: platformUsers.filter(usr => usr.status === 'Active' || usr.status === 'ACTIVE').length || 112,
              dau: 78,
              mau: 115,
              dauMauRatio: '67.8%',
              newUsersThisMonth: 14,
              retentionRate: '94.8%'
            };

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                {/* Total Users */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Users</span>
                    <Users size={18} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.totalUsers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} /> <strong>+{u.newUsersThisMonth} new</strong> this month ({u.retentionRate} retention)
                  </div>
                </div>

                {/* Active Users */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Accounts</span>
                    <UserCheck size={18} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.activeUsers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                    <strong>{((u.activeUsers / (u.totalUsers || 1)) * 100).toFixed(1)}%</strong> of total platform roster
                  </div>
                </div>

                {/* Daily Active Users (DAU) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Daily Active Users (DAU)</span>
                    <Activity size={18} color="#7c3aed" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#7c3aed', margin: '8px 0 4px' }}>
                    {u.dau.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Stickiness (DAU/MAU): <strong>{u.dauMauRatio}</strong></span>
                  </div>
                </div>

                {/* Monthly Active Users (MAU) */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Monthly Active Users (MAU)</span>
                    <Calendar size={18} color="#ea580c" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', margin: '8px 0 4px' }}>
                    {u.mau.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#059669' }}>
                    <span>Active in last 30 days</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. COMPANIES WITH HIGHEST USAGE LEADERBOARD */}
          <div className="card-section" style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="#ea580c" /> Companies with Highest Operational Usage
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                  Ranked by field operational activity, daily call logs, orders placed, and storage intensity
                </p>
              </div>
              <span className="status-tag status-active" style={{ background: '#ecfdf5', color: '#059669' }}>
                Live Activity Index
              </span>
            </div>

            <div className="saas-table-container">
              <table className="saas-data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Company Name &amp; Code</th>
                    <th>Plan Tier</th>
                    <th>Active Reps &amp; Users</th>
                    <th>DCR Reports</th>
                    <th>Sales Orders</th>
                    <th>Storage Used / Limit</th>
                    <th>Activity Score</th>
                    <th style={{ textAlign: 'right' }}>Usage Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {(platformAnalytics?.highestUsageCompanies || []).map((comp, idx) => (
                    <tr key={comp.id || idx}>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#fef3c7' : (idx === 1 ? '#f1f5f9' : (idx === 2 ? '#ffedd5' : '#f8fafc')),
                          color: idx === 0 ? '#b45309' : (idx === 1 ? '#475569' : (idx === 2 ? '#c2410c' : '#64748b')),
                          fontWeight: '800',
                          fontSize: '0.8rem'
                        }}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{comp.name}</strong>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}><code>{comp.code}</code></div>
                        </div>
                      </td>
                      <td><span className={`plan-pill plan-${(comp.plan || 'STARTER').toLowerCase()}`}>{comp.plan}</span></td>
                      <td><strong>{comp.userCount}</strong> Users</td>
                      <td><span style={{ fontWeight: '700', color: '#0284c7' }}>{comp.dcrCount?.toLocaleString() || 0} DCRs</span></td>
                      <td><strong>{comp.orderCount?.toLocaleString() || 0}</strong> Orders</td>
                      <td>
                        <div style={{ width: '130px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                            <span>{comp.storageUsedGB} GB</span>
                            <span style={{ color: '#94a3b8' }}>/ {comp.storageLimitGB} GB</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, comp.storagePercent || 25)}%`,
                              height: '100%',
                              background: (comp.storagePercent || 25) > 80 ? '#ef4444' : '#3b82f6',
                              borderRadius: '3px'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#0f172a' }}>{comp.usageScore || 75}</div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/100</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`status-tag status-${(comp.activityTier || 'NORMAL').toLowerCase() === 'high_intensity' ? 'active' : 'trial'}`}>
                          {comp.activityTier === 'HIGH_INTENSITY' ? '🔥 High Intensity' : comp.activityTier === 'MODERATE' ? '⚡ Moderate' : '🟢 Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. API USAGE & STORAGE CONSUMPTION (2-Column Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '22px' }}>
            {/* API Usage & Infrastructure */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Radio size={18} color="#0284c7" /> API Usage &amp; Infrastructure Throughput
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Calls Today</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                    {(platformAnalytics?.apiUsage?.totalCallsToday || 482920).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                    MTD: <strong>{((platformAnalytics?.apiUsage?.totalCallsMTD || 14280500) / 1000000).toFixed(1)}M Calls</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Avg Latency &amp; SLA</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669' }}>
                    {platformAnalytics?.apiUsage?.avgLatencyMs || 24}ms
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '2px' }}>
                    Uptime SLA: <strong>{platformAnalytics?.apiUsage?.uptimeSLA || '99.98%'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Top API Gateway Endpoints by Volume</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {(platformAnalytics?.apiUsage?.topEndpoints || []).map((ep, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div>
                        <code>{ep.route}</code>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{ep.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong>{ep.share}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{(ep.callsToday || 0).toLocaleString()} calls</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Usage Telemetry */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <HardDrive size={18} color="#7c3aed" /> Platform Storage Consumption
              </h3>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Storage Consumed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>
                      {platformAnalytics?.storage?.totalUsedGB || 142.6} GB
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#64748b' }}>
                    Provisioned: <strong>{platformAnalytics?.storage?.totalAllocatedGB || 500} GB</strong>
                  </div>
                </div>

                <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${platformAnalytics?.storage?.storageUsedPercent || 29}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #7c3aed)',
                    borderRadius: '5px'
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', textAlign: 'right' }}>
                  {platformAnalytics?.storage?.storageUsedPercent || 29}% allocated capacity used
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Storage Usage by Asset Category</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Clinical Documents</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.clinicalDocumentsGB || 54.2} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Doctor Visit Attachments</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.doctorVisitAttachmentsGB || 41.8} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Product SKU Media</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.productMediaGB || 28.6} GB</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>Audit Ledger Exports</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{platformAnalytics?.storage?.breakdown?.auditLedgerExportsGB || 18.0} GB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. REPORT GENERATION & GLOBAL LOGIN ACTIVITY (2-Column Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            {/* Report Generation Metrics */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={18} color="#059669" /> Report Generation &amp; Export Volume
              </h3>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Reports Generated (MTD)</span>
                  <span className="status-badge-green">{(platformAnalytics?.reports?.activeScheduledExports || 42)} Active Cron Schedules</span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#059669', marginTop: '4px' }}>
                  {(platformAnalytics?.reports?.totalGeneratedMTD || 8420).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.78rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>DCR Call Summaries:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.dcrDailyCallExports || 3840).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Sales Analytics Exports:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.salesOrderAnalytics || 2410).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Doctor Coverage:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.doctorCoverageSummaries || 1290).toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
                  <span style={{ color: '#64748b' }}>Expense Audit Claims:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                    {(platformAnalytics?.reports?.expenseAuditClaims || 880).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Global Login Activity */}
            <div className="card-section">
              <h3 className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Clock size={18} color="#d97706" /> Global Login Velocity &amp; Regional Traffic
              </h3>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>24-Hour Auth Volume</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669' }}>
                    {platformAnalytics?.loginActivity?.successRate || '97.7%'} Success Rate
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '6px' }}>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0f172a' }}>
                    {(platformAnalytics?.loginActivity?.total24h || 342).toLocaleString()} Attempts
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#059669' }}>
                    ✓ {(platformAnalytics?.loginActivity?.successful || 334)} Passed
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#dc2626' }}>
                    ✕ {(platformAnalytics?.loginActivity?.failed || 8)} Failed
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Geographic Regional Distribution</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(platformAnalytics?.loginActivity?.geographicBreakdown || []).map((geo, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem' }}>{geo.flag}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f172a', margin: '2px 0' }}>{geo.country}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0284c7' }}>{geo.share}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
