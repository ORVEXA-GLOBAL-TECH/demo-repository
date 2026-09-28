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

export default function JurisdictionsTab() {
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
    jurisdictionSubTab, setJurisdictionSubTab, setIsCreateCountryOpen, handleOpenEditCountry, formatTimezoneClock, formatTimezoneDate, lastFxSyncTime, handleSyncLiveFxRates, isSyncingFxRates, fxConverter, setFxConverter, currencyMatrixSearch, setCurrencyMatrixSearch,
  } = ctx || {};

  return (
        <div className="tab-pane-content">
          <div className="sub-nav-tabs">
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'countries' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('countries')}>
              <Globe2 size={14} /> Sovereign Countries ({sovereignRegistry.length})
            </button>
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'timezones' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('timezones')}>
              <Clock size={14} /> Multi-Timezone World Clocks
            </button>
            <button type="button" className={`sub-nav-pill ${jurisdictionSubTab === 'currencies' ? 'active' : ''}`} onClick={() => setJurisdictionSubTab('currencies')}>
              <Coins size={14} /> Multi-Currency &amp; FX Engine
            </button>
          </div>

          {jurisdictionSubTab === 'countries' && (
            <div>
              <div className="pane-action-bar">
                <div>
                  <h2 className="section-title">Supported Sovereign Jurisdictions</h2>
                  <p className="section-desc">Tax withholding, social security standards, IANA timezones, and currency registries</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setIsCreateCountryOpen(true)}>
                  <Plus size={16} /> Add Sovereign Country
                </button>
              </div>

              <div className="countries-grid">
                {sovereignRegistry.map((c) => {
                  const countryCompaniesCount = companies.filter(comp => comp.country?.toLowerCase() === c.name?.toLowerCase()).length;
                  return (
                    <div key={c.code} className="country-card">
                      <div className="country-card-header">
                        <div className="country-title-row">
                          <span className="country-big-flag">{c.flag}</span>
                          <div>
                            <h3 className="country-name">{c.name} ({c.code})</h3>
                            <span className="country-active-tag">{countryCompaniesCount} {countryCompaniesCount === 1 ? 'Company' : 'Companies'} Onboarded</span>
                          </div>
                        </div>
                        <span className="status-badge-green">Operational</span>
                      </div>

                      <div className="country-details-list">
                        <div className="detail-item">
                          <span className="detail-key">Currency &amp; Symbol:</span>
                          <span className="detail-val"><strong>{c.currencyCode} ({c.currencySymbol})</strong></span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-key">IANA Timezone:</span>
                          <span className="detail-val">{c.timezone}</span>
                        </div>
                        <div className="detail-item highlight-tax">
                          <span className="detail-key">Tax / Withholding:</span>
                          <span className="detail-val">{c.taxScheme}</span>
                        </div>
                        <div className="detail-item highlight-nssf">
                          <span className="detail-key">Social Security:</span>
                          <span className="detail-val">{c.socialSecurity}</span>
                        </div>
                      </div>

                      <div className="country-card-footer" style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                        <button
                          type="button"
                          className="btn-configure-country"
                          onClick={() => handleOpenEditCountry(c)}
                        >
                          <Settings size={14} /> <span>Configure</span>
                        </button>
                        <button
                          type="button"
                          className="action-pill-btn red"
                          onClick={() => handleDeleteCountry(c.code, c.name)}
                          title="Delete Country"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {jurisdictionSubTab === 'timezones' && (
            <div className="card-section">
              <h2 className="section-title"><Timer size={20} color="#d97706" /> Global Live Regional Clocks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
                {sovereignRegistry.map((reg) => (
                  <div key={reg.code} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>{reg.flag}</span>
                      <span className="tenant-id-pill">{reg.utcOffset || 'UTC'}</span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>{reg.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{reg.timezone}</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1e3a8a', margin: '10px 0 2px', fontFamily: 'monospace' }}>
                      {formatTimezoneClock(reg.timezone)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '600' }}>
                      {formatTimezoneDate(reg.timezone)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jurisdictionSubTab === 'currencies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Interactive Live FX & Tax Calculator */}
              <div className="card-section" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Coins size={22} color="#2563eb" /> Live Real-Time Multi-Currency &amp; Tax Converter
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
                      Calculate SaaS plan pricing, tax withholding, and local currency billing across all {sovereignRegistry.length} sovereign markets instantly.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '700' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                      Live Market FX Feed: Active
                    </span>
                    <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: '600' }}>
                      Synced: {lastFxSyncTime}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSyncLiveFxRates(true)}
                      disabled={isSyncingFxRates}
                      style={{ fontSize: '0.76rem', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={13} className={isSyncingFxRates ? 'spin-icon' : ''} />
                      {isSyncingFxRates ? 'Syncing...' : 'Sync Live Rates'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                  {/* Column 1: Base Amount */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Base Amount ($ USD)</label>
                      <input
                        type="number"
                        min="0"
                        value={fxConverter.amount}
                        onChange={(e) => setFxConverter(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        className="form-control"
                        style={{ fontWeight: '800', fontSize: '1.1rem', background: '#f8fafc', color: '#0f172a' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {[100, 500, 1000, 2500, 5000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFxConverter(prev => ({ ...prev, amount: val }))}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: fxConverter.amount === val ? '800' : '600',
                            background: fxConverter.amount === val ? '#2563eb' : '#f1f5f9',
                            color: fxConverter.amount === val ? '#ffffff' : '#475569',
                            border: '1px solid',
                            borderColor: fxConverter.amount === val ? '#2563eb' : '#e2e8f0',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          ${val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Target Country */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Target Sovereign Country</label>
                      <select
                        className="form-control"
                        value={fxConverter.toCurrency}
                        onChange={(e) => setFxConverter(prev => ({ ...prev, toCurrency: e.target.value }))}
                        style={{ fontWeight: '700', background: '#f8fafc', fontSize: '0.92rem' }}
                      >
                        {sovereignRegistry.map((c) => (
                          <option key={c.code} value={c.currencyCode}>
                            {c.flag} {c.name} ({c.currencyCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    {(() => {
                      const targetC = sovereignRegistry.find(c => c.currencyCode === fxConverter.toCurrency) || sovereignRegistry[0];
                      return (
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe2 size={13} color="#2563eb" />
                          <span>Jurisdiction: <strong>{targetC.name} ({targetC.code})</strong></span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Column 3: Converted Output */}
                  {(() => {
                    const targetC = sovereignRegistry.find(c => c.currencyCode === fxConverter.toCurrency) || sovereignRegistry[0];
                    const rate = targetC.fxRateToUSD || 1;
                    const convertedVal = (fxConverter.amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    return (
                      <div style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: '10px', padding: '14px', boxShadow: '0 2px 6px rgba(37,99,235,0.06)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Converted Value ({targetC.currencyCode})
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace', margin: '4px 0' }}>
                          {targetC.currencySymbol} {convertedVal}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'monospace' }}>
                          1 USD = {rate.toLocaleString()} {targetC.currencyCode}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Multi-Currency Exchange Matrix Full Width Card */}
              <div className="card-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h2 className="section-title" style={{ margin: 0 }}>Multi-Currency Exchange Matrix</h2>
                      <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700' }}>
                        {sovereignRegistry.length} Currencies Configured
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
                      Live rates synced with database &amp; sovereign registry across all 24 markets
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="search-box-large" style={{ width: '280px', margin: 0 }}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search currency, code or tax..."
                        value={currencyMatrixSearch}
                        onChange={(e) => setCurrencyMatrixSearch(e.target.value)}
                        className="search-input-field"
                        style={{ fontSize: '0.82rem' }}
                      />
                      {currencyMatrixSearch && (
                        <button
                          type="button"
                          onClick={() => setCurrencyMatrixSearch('')}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', padding: '0 4px' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleSyncLiveFxRates(true)}
                      disabled={isSyncingFxRates}
                      style={{ fontSize: '0.8rem', padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      title="Sync live currency rates from global FX markets"
                    >
                      <RefreshCw size={13} className={isSyncingFxRates ? 'spin-icon' : ''} />
                      Sync FX Feed
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsCreateCountryOpen(true)}
                      style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                    >
                      <Plus size={14} /> Add Country
                    </button>
                  </div>
                </div>

                {(() => {
                  const filteredCurrencies = sovereignRegistry.filter(c => {
                    if (!currencyMatrixSearch.trim()) return true;
                    const q = currencyMatrixSearch.toLowerCase().trim();
                    return (
                      (c.name && c.name.toLowerCase().includes(q)) ||
                      (c.currencyCode && c.currencyCode.toLowerCase().includes(q)) ||
                      (c.code && c.code.toLowerCase().includes(q)) ||
                      (c.taxScheme && c.taxScheme.toLowerCase().includes(q))
                    );
                  });

                  if (filteredCurrencies.length === 0) {
                    return (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                        <Coins size={36} color="#94a3b8" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>No Matching Currencies Found</div>
                        <p style={{ fontSize: '0.8rem', margin: '4px auto 12px' }}>No jurisdiction matched "{currencyMatrixSearch}".</p>
                        <button type="button" className="btn btn-secondary" onClick={() => setCurrencyMatrixSearch('')}>
                          Clear Filter
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="saas-table-container" style={{ overflowX: 'auto', width: '100%' }}>
                      <table className="saas-data-table" style={{ width: '100%', minWidth: '860px' }}>
                        <thead>
                          <tr>
                            <th style={{ minWidth: '190px' }}>Jurisdiction &amp; Territory</th>
                            <th style={{ minWidth: '95px', textAlign: 'center' }}>ISO Code</th>
                            <th style={{ minWidth: '75px', textAlign: 'center' }}>Symbol</th>
                            <th style={{ minWidth: '200px' }}>Exchange Rate (per 1 USD)</th>
                            <th style={{ minWidth: '160px' }}>Inverse FX (to USD)</th>
                            <th style={{ minWidth: '220px' }}>Tax / Withholding Standard</th>
                            <th style={{ minWidth: '120px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCurrencies.map((c) => {
                            const rate = c.fxRateToUSD || 1;
                            const invRate = (1 / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
                            return (
                              <tr key={c.code}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{c.flag}</span>
                                    <div>
                                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.88rem' }}>{c.name}</div>
                                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Country ISO: {c.code}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <span className="tenant-id-pill" style={{ fontWeight: '800', letterSpacing: '0.5px' }}>{c.currencyCode}</span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{c.currencySymbol}</strong>
                                </td>
                                <td>
                                  <span style={{
                                    fontFamily: 'monospace',
                                    fontWeight: '800',
                                    color: '#1d4ed8',
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '6px',
                                    padding: '3px 8px',
                                    fontSize: '0.84rem',
                                    display: 'inline-block'
                                  }}>
                                    1 USD = {rate.toLocaleString()} {c.currencyCode}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569' }}>
                                    1 {c.currencyCode} = ${invRate}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '500', display: 'block' }}>
                                    {c.taxScheme || 'Standard Sovereign Tax'}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    type="button"
                                    className="action-pill-btn"
                                    onClick={() => handleOpenEditCountry(c)}
                                    title="Update Exchange Rate & Tax"
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    <Edit size={12} /> Edit FX &amp; Tax
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
  );
}
