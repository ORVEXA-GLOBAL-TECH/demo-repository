"use client";

import React, { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { AdverseEventReport, AdrSeverity, AdrStatus } from "@/types/pharma";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Drawer } from "@/components/shared/Drawer";
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  UserCheck,
  Send,
  FileText,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";

export default function PharmacovigilancePage() {
  const { adrReports, companies, selectedCompany, updateAdrStatus } = useTenant();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedAdrDrawer, setSelectedAdrDrawer] = useState<AdverseEventReport | null>(null);

  const filteredReports = adrReports.filter((r) => {
    const matchesSearch =
      r.reportCode.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.eventDescription.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === "all" || r.severity === severityFilter;
    const matchesCompany = selectedCompany ? r.companyId === selectedCompany.id : true;

    return matchesSearch && matchesSeverity && matchesCompany;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Pharmacovigilance & Adverse Drug Reaction (ADR) Central
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global safety surveillance, expedited FDA MedWatch 3500A reporting, and causality triage across tenant therapies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>Automated 15-Day Expedited Gate</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report code, drug brand, batch, clinical symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Severity Levels</option>
            <option value="Life-Threatening">Life-Threatening</option>
            <option value="Severe">Severe</option>
            <option value="Moderate">Moderate</option>
            <option value="Mild">Mild</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-teal-600 dark:text-teal-400">
                      {report.reportCode}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {report.companyName}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {report.productName}
                  </h3>
                </div>
                <StatusBadge status={report.severity} size="sm" />
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                  "{report.eventDescription}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Patient: {report.patientAgeGroup}</span>
                  <span className="font-mono">Batch: {report.batchNumber}</span>
                </div>
              </div>
            </div>

            {/* Lifecycle Status & Investigator */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Investigation Status:</span>
                <StatusBadge status={report.status} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Causality Assessment:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {report.causalityScore}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-rose-500">
                <span>FDA Submission Target:</span>
                <span>{report.regulatorySubmissionDeadline}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                By: {report.reporterType}
              </span>
              <button
                onClick={() => setSelectedAdrDrawer(report)}
                className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold border border-teal-500/20 transition-colors"
              >
                Inspect Case & File →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADR Details Drawer */}
      <Drawer
        isOpen={!!selectedAdrDrawer}
        onClose={() => setSelectedAdrDrawer(null)}
        title={selectedAdrDrawer?.reportCode || "ADR Incident Case"}
        subtitle={`Therapy: ${selectedAdrDrawer?.productName} • Reported by ${selectedAdrDrawer?.reporterType}`}
        width="xl"
      >
        {selectedAdrDrawer && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedAdrDrawer.severity} />
                <span className="text-xs font-mono text-slate-400">
                  Date: {selectedAdrDrawer.dateReported}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Clinical Adverse Event Narrative
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedAdrDrawer.eventDescription}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Regulatory Triage & Assigned Investigator
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Assigned Safety Officer:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedAdrDrawer.assignedInvestigator}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">FDA MedWatch Target Deadline:</span>
                  <span className="font-mono font-bold text-rose-400">
                    {selectedAdrDrawer.regulatorySubmissionDeadline}
                  </span>
                </div>
              </div>
            </div>

            {/* Advance Status Controls */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Regulatory Lifecycle Actions
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    updateAdrStatus(selectedAdrDrawer.id, "FDA MedWatch Filed");
                    setSelectedAdrDrawer(null);
                  }}
                  className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 text-center flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to FDA ESG</span>
                </button>

                <button
                  onClick={() => {
                    updateAdrStatus(selectedAdrDrawer.id, "Closed / Resolved");
                    setSelectedAdrDrawer(null);
                  }}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
