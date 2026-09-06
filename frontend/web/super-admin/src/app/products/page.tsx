"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { DrugProduct, DrugCategory, DrugSchedule } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import {
  Pill,
  Search,
  Filter,
  Plus,
  ThermometerSnowflake,
  ShieldCheck,
  Building2,
  DollarSign,
  Boxes,
  FileSpreadsheet,
} from "lucide-react";
import clsx from "clsx";

export default function ProductsPage() {
  const { products, companies, selectedCompany, openQuickAction } = useTenant();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>(
    selectedCompany ? selectedCompany.id : "all"
  );
  const [selectedProductDrawer, setSelectedProductDrawer] = useState<DrugProduct | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.brandName.toLowerCase().includes(search.toLowerCase()) ||
      prod.genericName.toLowerCase().includes(search.toLowerCase()) ||
      prod.skuCode.toLowerCase().includes(search.toLowerCase()) ||
      prod.activeIngredient.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter;
    const matchesCompany =
      companyFilter === "all"
        ? selectedCompany
          ? prod.companyId === selectedCompany.id
          : true
        : prod.companyId === companyFilter;

    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Master Drug Catalog & Formulations
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cross-pharma database of therapeutic formulations, biologics, API specifications, and cold chain tolerances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openQuickAction("sku")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Formulation</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand name, generic API, SKU code, FDA BLA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Company filter */}
          {!selectedCompany && (
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Pharma Tenants ({companies.length})</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="Oncology">Oncology</option>
            <option value="Immunology">Immunology</option>
            <option value="Rare Disease">Rare Disease</option>
            <option value="Vaccines">Vaccines</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Product / Brand</th>
                <th className="py-3.5">Pharma Tenant</th>
                <th className="py-3.5">Category</th>
                <th className="py-3.5">Storage Spec</th>
                <th className="py-3.5">FDA Registration</th>
                <th className="py-3.5">Available Units</th>
                <th className="py-3.5">Unit Price</th>
                <th className="py-3.5">Stage</th>
                <th className="py-3.5 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 pl-6">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {prod.brandName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {prod.genericName} • <span className="font-mono text-teal-600 dark:text-teal-400">{prod.skuCode}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {prod.companyName}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                      {prod.storageCondition.includes("Cold") || prod.storageCondition.includes("Cryo") ? (
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-500" />
                      ) : null}
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">
                        {prod.storageCondition}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {prod.fdaNdaNumber}
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {prod.stockInUnits.toLocaleString()}
                    </span>{" "}
                    <span className="text-[10px] text-slate-400">
                      ({prod.reservedUnits.toLocaleString()} reserved)
                    </span>
                  </td>
                  <td className="py-4 font-bold text-slate-900 dark:text-white font-mono">
                    ${prod.pricePerUnit.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={prod.stage} size="sm" />
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedProductDrawer(prod)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 transition-colors"
                    >
                      Spec Sheet →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SKU Spec Sheet Drawer */}
      <Drawer
        isOpen={!!selectedProductDrawer}
        onClose={() => setSelectedProductDrawer(null)}
        title={selectedProductDrawer?.brandName || "Formulation Specifications"}
        subtitle={`SKU: ${selectedProductDrawer?.skuCode} • Registered to ${selectedProductDrawer?.companyName}`}
        width="xl"
      >
        {selectedProductDrawer && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                Active Ingredient
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedProductDrawer.activeIngredient}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Dosage Form: {selectedProductDrawer.dosageForm}
              </p>
            </div>

            {/* Regulatory & Safety Specs */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Regulatory Classification & Approvals
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">FDA NDA / BLA Filing:</span>
                  <span className="font-mono font-bold text-teal-500">
                    {selectedProductDrawer.fdaNdaNumber}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Drug Schedule:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedProductDrawer.schedule}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Standard Batch Yield Target:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {selectedProductDrawer.batchYieldStandard}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Storage Tolerance:</span>
                  <span className="font-semibold text-cyan-400">
                    {selectedProductDrawer.storageCondition}
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory & Commercialization */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Inventory & Commercial Status
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400">Total Available Stock:</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedProductDrawer.stockInUnits.toLocaleString()} units
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400">Reserved For Quota:</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedProductDrawer.reservedUnits.toLocaleString()} units
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
