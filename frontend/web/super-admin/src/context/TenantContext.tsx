"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PharmaCompany,
  DrugProduct,
  BatchRecord,
  PartnerEntity,
  AdverseEventReport,
  AuditLogEntry,
  SubscriptionPlan,
  AuthUser,
} from "@/types/pharma";
import {
  MOCK_COMPANIES,
  MOCK_PRODUCTS,
  MOCK_BATCHES,
  MOCK_PARTNERS,
  MOCK_ADR_REPORTS,
  MOCK_AUDIT_LOGS,
  MOCK_SUBSCRIPTIONS,
  DEMO_AUTH_USERS,
} from "@/data/mockData";

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
}

interface TenantContextType {
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  selectedCompany: PharmaCompany | null;
  companies: PharmaCompany[];
  products: DrugProduct[];
  batches: BatchRecord[];
  partners: PartnerEntity[];
  adrReports: AdverseEventReport[];
  auditLogs: AuditLogEntry[];
  subscriptions: SubscriptionPlan[];
  theme: "dark" | "light";
  toggleTheme: () => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  quickActionInitialTab: string;
  openQuickAction: (tab?: string) => void;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, "id" | "timestamp">) => void;
  removeToast: (id: string) => void;
  addCompany: (comp: Partial<PharmaCompany>) => void;
  addProduct: (prod: Partial<DrugProduct>) => void;
  quarantineBatch: (batchId: string, reason: string) => void;
  updateBatchStatus: (batchId: string, status: BatchRecord["status"]) => void;
  updateAdrStatus: (adrId: string, status: AdverseEventReport["status"]) => void;
  addAuditLog: (entry: Partial<AuditLogEntry>) => void;

  // Exact Dashboard Metrics Getters
  metrics: {
    // Companies
    totalCompanies: number;
    activeCompanies: number;
    trialCompanies: number;
    suspendedCompanies: number;
    expiredCompanies: number;
    // Users
    totalUsers: number;
    activeUsers: number;
    companyAdmins: number;
    // Revenue & Payments
    monthlyRevenue: number;
    yearlyRevenue: number;
    pendingPayments: number;
    failedPayments: number;
    // Subscriptions
    activeSubscriptions: number;
    expiringSoonSubscriptions: number;
    expiredSubscriptions: number;
  };
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEMO_AUTH_USERS[0]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [companies, setCompanies] = useState<PharmaCompany[]>(MOCK_COMPANIES);
  const [products, setProducts] = useState<DrugProduct[]>(MOCK_PRODUCTS);
  const [batches, setBatches] = useState<BatchRecord[]>(MOCK_BATCHES);
  const [partners, setPartners] = useState<PartnerEntity[]>(MOCK_PARTNERS);
  const [adrReports, setAdrReports] = useState<AdverseEventReport[]>(MOCK_ADR_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [subscriptions] = useState<SubscriptionPlan[]>(MOCK_SUBSCRIPTIONS);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);
  const [quickActionInitialTab, setQuickActionInitialTab] = useState<string>("company");
  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: "init-1",
      title: "Global Super Admin Hub Online",
      message: "Multi-Pharma Enterprise SaaS session authenticated under 21 CFR Part 11.",
      type: "info",
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    addToast({
      title: "Authenticated Successfully",
      message: `Welcome back, ${user.name} (${user.role}).`,
      type: "success",
    });
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      title: "Session Terminated",
      message: "Securely logged out from Super Admin Command Center.",
      type: "info",
    });
  };

  const selectedCompany =
    selectedCompanyId === "all"
      ? null
      : companies.find((c) => c.id === selectedCompanyId) || null;

  // Active dataset depending on selected company scope
  const targetCompanies = selectedCompany ? [selectedCompany] : companies;
  const targetSubscriptions = selectedCompany
    ? subscriptions.filter((s) => s.companyId === selectedCompany.id)
    : subscriptions;

  // Exact metrics calculations
  const totalCompanies = targetCompanies.length;
  const activeCompanies = targetCompanies.filter((c) => c.status === "Active").length;
  const trialCompanies = targetCompanies.filter((c) => c.status === "Trial").length;
  const suspendedCompanies = targetCompanies.filter((c) => c.status === "Suspended").length;
  const expiredCompanies = targetCompanies.filter((c) => c.status === "Expired").length;

  const totalUsers = targetCompanies.reduce((acc, c) => acc + (c.usersCount || 0), 0);
  const activeUsers = targetCompanies.reduce((acc, c) => acc + (c.activeUsersCount || 0), 0);
  const companyAdmins = targetCompanies.reduce((acc, c) => acc + (c.companyAdminsCount || 0), 0);

  const monthlyRevenue = targetCompanies.reduce((acc, c) => acc + (c.monthlyRevenue || 0), 0);
  const yearlyRevenue = targetCompanies.reduce((acc, c) => acc + (c.yearlyRevenue || 0), 0);

  const pendingPayments = targetSubscriptions.filter((s) => s.paymentStatus === "Pending").length;
  const failedPayments = targetSubscriptions.filter((s) => s.paymentStatus === "Failed").length;

  const activeSubscriptions = targetSubscriptions.filter((s) => s.subscriptionStatus === "Active").length;
  const expiringSoonSubscriptions = targetSubscriptions.filter((s) => s.subscriptionStatus === "Expiring Soon").length;
  const expiredSubscriptions = targetSubscriptions.filter((s) => s.subscriptionStatus === "Expired").length;

  const metrics = {
    totalCompanies,
    activeCompanies,
    trialCompanies,
    suspendedCompanies,
    expiredCompanies,
    totalUsers,
    activeUsers,
    companyAdmins,
    monthlyRevenue,
    yearlyRevenue,
    pendingPayments,
    failedPayments,
    activeSubscriptions,
    expiringSoonSubscriptions,
    expiredSubscriptions,
  };

  const addToast = (t: Omit<ToastNotification, "id" | "timestamp">) => {
    const newToast: ToastNotification = {
      ...t,
      id: `toast-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== newToast.id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const openQuickAction = (tab: string = "company") => {
    setQuickActionInitialTab(tab);
    setIsQuickActionOpen(true);
  };

  const addAuditLog = (entry: Partial<AuditLogEntry>) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      companyId: entry.companyId || (selectedCompany ? selectedCompany.id : "comp-alleviare"),
      companyName: entry.companyName || (selectedCompany ? selectedCompany.name : "Platform Super Admin"),
      actorName: entry.actorName || (currentUser ? currentUser.name : "Global Super Admin"),
      actorRole: entry.actorRole || (currentUser ? currentUser.role : "Root Super Admin"),
      action: entry.action || "SYSTEM_EVENT",
      module: entry.module || "Batch Control",
      details: entry.details || "Administrative modification logged in compliance vault.",
      ipAddress: entry.ipAddress || "185.190.24.112 (Zurich Gateway)",
      eSignatureHash: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      severity: entry.severity || "Info",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addCompany = (comp: Partial<PharmaCompany>) => {
    const newComp: PharmaCompany = {
      id: `comp-${Date.now()}`,
      name: comp.name || "New BioPharma Ltd.",
      code: comp.code || "NBP",
      logo: comp.logo || "💊",
      foundedYear: comp.foundedYear || 2024,
      headquarters: comp.headquarters || "Geneva, Switzerland",
      primaryContact: comp.primaryContact || {
        name: "Admin Contact",
        email: "admin@biopharma.org",
        role: "Head of QA",
        phone: "+41 22 555 0100",
      },
      licenses: comp.licenses || {
        fdaEstablishmentId: `FEI-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        emaGmpCert: "EMA/GMP/2026-PENDING",
        cdscoLicense: "CDSCO-MFG-20B-AUTO",
        whoGdpVerified: true,
        expiryDate: "2029-12-31",
      },
      stats: {
        activeSkus: 0,
        activeBatches: 0,
        hospitalsSupplied: 0,
        complianceScore: 100,
        annualGmv: "$0.0M",
        coldChainAlerts: 0,
      },
      tier: comp.tier || "Enterprise Elite",
      status: comp.status || "Trial",
      joinedDate: new Date().toISOString().substring(0, 10),
      usersCount: 15,
      activeUsersCount: 12,
      companyAdminsCount: 2,
      paymentStatus: "Paid",
      subscriptionStatus: "Active",
      daysUntilExpiry: 30,
      monthlyRevenue: 15000,
      yearlyRevenue: 180000,
      enabledModules: comp.enabledModules || {
        coldChainIot: true,
        aiPharmacovigilance: true,
        crossBorderClearance: true,
        apiIntegrations: true,
        customAuditVault: true,
      },
    };

    setCompanies((prev) => [newComp, ...prev]);
    addToast({
      title: "Pharma Tenant Onboarded",
      message: `${newComp.name} successfully registered in system.`,
      type: "success",
    });
    addAuditLog({
      action: "TENANT_COMPANY_ONBOARDED",
      companyId: newComp.id,
      companyName: newComp.name,
      module: "Company Onboarding",
      details: `Onboarded new client pharma enterprise ${newComp.name} under tier ${newComp.tier}.`,
      severity: "Critical Action",
    });
  };

  const addProduct = (prod: Partial<DrugProduct>) => {
    const company = companies.find((c) => c.id === prod.companyId) || companies[0];
    const newProd: DrugProduct = {
      id: `prod-${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      brandName: prod.brandName || "New Formulation",
      genericName: prod.genericName || "Generic API",
      skuCode: prod.skuCode || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: prod.category || "Oncology",
      dosageForm: prod.dosageForm || "Vial Solution 100mg",
      activeIngredient: prod.activeIngredient || "Active Pharmaceutical Ingredient",
      schedule: prod.schedule || "Biologic",
      storageCondition: prod.storageCondition || "2°C - 8°C (Cold Chain)",
      fdaNdaNumber: prod.fdaNdaNumber || `BLA-${Math.floor(100000 + Math.random() * 900000)}`,
      pricePerUnit: prod.pricePerUnit || 1200,
      currency: "USD",
      stockInUnits: prod.stockInUnits || 5000,
      reservedUnits: prod.reservedUnits || 0,
      stage: prod.stage || "Commercial",
      releaseDate: new Date().toISOString().substring(0, 10),
      batchYieldStandard: "99.0%",
    };

    setProducts((prev) => [newProd, ...prev]);
    addToast({
      title: "New SKU Formulated",
      message: `${newProd.brandName} registered for ${company.name}.`,
      type: "success",
    });
    addAuditLog({
      action: "DRUG_SKU_REGISTERED",
      companyId: company.id,
      companyName: company.name,
      module: "Product SKU",
      details: `Registered new drug SKU ${newProd.skuCode} (${newProd.brandName}).`,
      severity: "Info",
    });
  };

  const quarantineBatch = (batchId: string, reason: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "Quarantine", quarantineReason: reason } : b))
    );
    const target = batches.find((b) => b.id === batchId);
    if (target) {
      addToast({
        title: "Emergency Quarantine Enforced",
        message: `Batch ${target.batchNumber} has been placed into locked quarantine status.`,
        type: "error",
      });
      addAuditLog({
        action: "EMERGENCY_BATCH_QUARANTINE",
        companyId: target.companyId,
        companyName: target.companyName,
        module: "Batch Control",
        details: `Quarantined Batch ${target.batchNumber} for reason: ${reason}.`,
        severity: "Critical Action",
      });
    }
  };

  const updateBatchStatus = (batchId: string, status: BatchRecord["status"]) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status } : b))
    );
  };

  const updateAdrStatus = (adrId: string, status: AdverseEventReport["status"]) => {
    setAdrReports((prev) =>
      prev.map((r) => (r.id === adrId ? { ...r, status } : r))
    );
  };

  return (
    <TenantContext.Provider
      value={{
        currentUser,
        login,
        logout,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedCompany,
        companies,
        products,
        batches,
        partners,
        adrReports,
        auditLogs,
        subscriptions,
        theme,
        toggleTheme,
        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionInitialTab,
        openQuickAction,
        toasts,
        addToast,
        removeToast,
        addCompany,
        addProduct,
        quarantineBatch,
        updateBatchStatus,
        updateAdrStatus,
        addAuditLog,
        metrics,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
