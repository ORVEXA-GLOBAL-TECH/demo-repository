"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { useTenant } from "@/context/TenantContext";
import {
  Building2,
  Pill,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { DrugCategory, DrugSchedule, CompanyTier } from "@/types/pharma";
import clsx from "clsx";

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionInitialTab,
    companies,
    batches,
    addCompany,
    addProduct,
    quarantineBatch,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<string>("company");

  // Tab 1: Onboard Company state
  const [compName, setCompName] = useState("");
  const [compCode, setCompCode] = useState("");
  const [compHq, setCompHq] = useState("");
  const [compContact, setCompContact] = useState("");
  const [compEmail, setCompEmail] = useState("");
  const [compTier, setCompTier] = useState<CompanyTier>("Enterprise Elite");

  // Tab 2: New SKU state
  const [selectedCompId, setSelectedCompId] = useState(companies[0]?.id || "");
  const [brandName, setBrandName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState<DrugCategory>("Oncology");
  const [schedule, setSchedule] = useState<DrugSchedule>("Biologic");
  const [storage, setStorage] = useState<"2°C - 8°C (Cold Chain)" | "-20°C (Frozen)" | "-80°C (Ultra-Cryo)" | "15°C - 25°C (Controlled Room)">("2°C - 8°C (Cold Chain)");
  const [price, setPrice] = useState(1200);

  // Tab 3: Emergency Quarantine state
  const [quarantineBatchId, setQuarantineBatchId] = useState(batches[0]?.id || "");
  const [quarantineReason, setQuarantineReason] = useState("");

  useEffect(() => {
    if (quickActionInitialTab) {
      setActiveTab(quickActionInitialTab);
    }
  }, [quickActionInitialTab, isQuickActionOpen]);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;
    addCompany({
      name: compName,
      code: compCode || compName.substring(0, 3).toUpperCase(),
      headquarters: compHq || "Basel, Switzerland",
      tier: compTier,
      primaryContact: {
        name: compContact || "Lead Admin",
        email: compEmail || "admin@pharma.org",
        role: "Head of QA & Regulatory",
        phone: "+41 22 500 1234",
      },
    });
    setCompName("");
    setCompCode("");
    setCompHq("");
    setCompContact("");
    setCompEmail("");
    setIsQuickActionOpen(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;
    addProduct({
      companyId: selectedCompId,
      brandName,
      genericName,
      category,
      schedule,
      storageCondition: storage,
      pricePerUnit: Number(price),
    });
    setBrandName("");
    setGenericName("");
    setIsQuickActionOpen(false);
  };

  const handleQuarantine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quarantineBatchId || !quarantineReason) return;
    quarantineBatch(quarantineBatchId, quarantineReason);
    setQuarantineReason("");
    setIsQuickActionOpen(false);
  };

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={() => setIsQuickActionOpen(false)}
      title="Platform Operations & Provisioning"
      subtitle="Execute multi-tenant actions with cryptographic audit logging"
      maxWidth="3xl"
    >
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("company")}
          className={clsx(
            "flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors",
            activeTab === "company"
              ? "border-teal-500 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Building2 className="w-4 h-4" />
          <span>Onboard Pharma Tenant</span>
        </button>

        <button
          onClick={() => setActiveTab("sku")}
          className={clsx(
            "flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors",
            activeTab === "sku"
              ? "border-teal-500 text-teal-600 dark:text-teal-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <Pill className="w-4 h-4" />
          <span>Register Master SKU</span>
        </button>

        <button
          onClick={() => setActiveTab("quarantine")}
          className={clsx(
            "flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors",
            activeTab === "quarantine"
              ? "border-rose-500 text-rose-600 dark:text-rose-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Batch Lock</span>
        </button>
      </div>

      {/* Tab 1: Onboard Pharma Tenant */}
      {activeTab === "company" && (
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vantia Therapeutics AG"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tenant Code (3-4 Chars)
              </label>
              <input
                type="text"
                placeholder="e.g. VNT"
                maxLength={5}
                value={compCode}
                onChange={(e) => setCompCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Global Headquarters
              </label>
              <input
                type="text"
                placeholder="e.g. Zurich, Switzerland"
                value={compHq}
                onChange={(e) => setCompHq(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subscription Tier
              </label>
              <select
                value={compTier}
                onChange={(e) => setCompTier(e.target.value as CompanyTier)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Enterprise Elite">Enterprise Elite (Full Suite + AI)</option>
                <option value="Global Sovereign">Global Sovereign (Multi-National)</option>
                <option value="BioTech Pro">BioTech Pro (Scale-up)</option>
                <option value="Clinical Scale">Clinical Scale (Phase I-III)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary QA / Admin Contact
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Arthur Hayes"
                value={compContact}
                onChange={(e) => setCompContact(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Compliance Email
              </label>
              <input
                type="email"
                placeholder="compliance@vantia.eu"
                value={compEmail}
                onChange={(e) => setCompEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-500" />
            <div>
              <p className="font-semibold">Automated Regulatory Ingestion</p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5">
                Onboarding provisions automated FDA Establishment ID validation, generates 21 CFR Part 11 cryptographic keypairs, and allocates IoT cold-chain sensor gateways.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20"
            >
              Provision Pharma Tenant
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Register Master SKU */}
      {activeTab === "sku" && (
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Pharma Tenant *
              </label>
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Brand Trade Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AlleviaMab™ Ultra"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Generic API Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rituximab Biosimilar 500mg"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Therapeutic Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DrugCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Oncology">Oncology</option>
                <option value="Immunology">Immunology</option>
                <option value="Rare Disease">Rare Disease</option>
                <option value="Vaccines">Vaccines</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Required Storage Conditions
              </label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="2°C - 8°C (Cold Chain)">2°C - 8°C (Cold Chain)</option>
                <option value="-20°C (Frozen)">-20°C (Frozen)</option>
                <option value="-80°C (Ultra-Cryo)">-80°C (Ultra-Cryo LN2)</option>
                <option value="15°C - 25°C (Controlled Room)">15°C - 25°C (Controlled Room)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Price per Standard Unit (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20"
            >
              Register & Lock SKU Spec
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Emergency Quarantine */}
      {activeTab === "quarantine" && (
        <form onSubmit={handleQuarantine} className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-bold text-rose-600 dark:text-rose-400">
                CRITICAL REGULATORY ACTION: 21 CFR Part 11 Electronic Lock
              </p>
              <p className="text-[11px] text-rose-600/90 dark:text-rose-300/90 mt-0.5">
                Quarantining a batch immediately broadcasts an emergency hold to all regional depots, stops automated distributor dispatch, and logs a tamper-evident audit hash.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Batch to Quarantine *
            </label>
            <select
              value={quarantineBatchId}
              onChange={(e) => setQuarantineBatchId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 font-mono"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchNumber} — {b.productName} ({b.companyName}) [Status: {b.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mandatory Regulatory Reason / Deviation Narrative *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail the temperature excursion breach, contamination flag, or adverse reaction report requiring emergency hold..."
              value={quarantineReason}
              onChange={(e) => setQuarantineReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
            >
              <Lock className="w-4 h-4" />
              <span>Apply Electronic Quarantine</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
