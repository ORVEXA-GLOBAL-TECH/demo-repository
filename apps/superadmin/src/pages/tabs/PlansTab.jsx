import React, { useState, useMemo } from 'react';
import {
  Layers, Plus, Edit, Trash2, CheckCircle2, XCircle, Award, Sparkles,
  Zap, Building2, Users, HardDrive, ShieldCheck, DollarSign, Sliders,
  Check, ArrowRight, Info, Eye
} from 'lucide-react';
import { useDashboard } from '../SuperAdminDashboard';

export default function PlansTab() {
  const ctx = useDashboard();
  const {
    plans = [],
    setPlans,
    companies = [],
    showToast,
    isCreatePlanOpen,
    setIsCreatePlanOpen,
    isEditPlanOpen,
    setIsEditPlanOpen,
    isDeletePlanOpen,
    setIsDeletePlanOpen,
    deletingPlan,
    setDeletingPlan,
    editingPlanForm,
    setEditingPlanForm,
    handleOpenEditPlan,
    handleOpenDeletePlan,
    addonsList = [],
    isAssignAddonOpen,
    setIsAssignAddonOpen
  } = ctx || {};

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [viewingPlanTenants, setViewingPlanTenants] = useState(null);

  // Available plans fallback list if empty
  const displayPlans = useMemo(() => {
    if (plans && plans.length > 0) return plans;
    return [
      {
        id: 'plan-starter',
        name: 'Starter Tier',
        code: 'STARTER',
        tier: 'STARTER',
        priceMonthly: 149,
        priceYearly: 1490,
        trialDays: 14,
        maxUsers: 25,
        maxStorageGb: 15,
        description: 'Ideal for regional pharma distributors and emerging field sales operations.',
        features: [
          'Up to 25 Field Representatives (MRs)',
          'Daily Call Reporting (DCR)',
          'Doctor & Chemist Master Registry',
          'Chemist Order Booking (POB)',
          'Core Mobile App Access',
          'Email & Community Support'
        ]
      },
      {
        id: 'plan-pro',
        name: 'Professional Tier',
        code: 'PROFESSIONAL',
        tier: 'PROFESSIONAL',
        priceMonthly: 499,
        priceYearly: 4990,
        trialDays: 21,
        maxUsers: 100,
        maxStorageGb: 50,
        isPopular: true,
        description: 'Complete commercial automation for mid-market pharmaceutical manufacturers.',
        features: [
          'Up to 100 Field Representatives (MRs)',
          'Real-time GPS Tracking & Geofencing',
          'Sample Stock & Product Inventory',
          'Secondary Sales & Target Quota Engine',
          'Executive Analytics & Territory BI',
          'Manager Approval Workflows & DCR Sign-off',
          'Priority SLA Support'
        ]
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise Tier',
        code: 'ENTERPRISE',
        tier: 'ENTERPRISE',
        priceMonthly: 1299,
        priceYearly: 12990,
        trialDays: 30,
        maxUsers: 500,
        maxStorageGb: 250,
        description: 'Maximum scale, regulatory compliance, and customized sovereign telemetry.',
        features: [
          'Up to 500 Field Representatives (MRs)',
          'AI Route Optimization & Smart Beat Planner',
          '21 CFR Part 11 Regulatory Compliance',
          'Custom REST APIs & Webhook Dispatch',
          'Sovereign In-Country Data Residency',
          'Single Sign-On (SSO / SAML 2.0 / Okta)',
          'Dedicated Technical Account Manager (TAM)'
        ]
      },
      {
        id: 'plan-sovereign',
        name: 'Sovereign Custom Tier',
        code: 'CUSTOM',
        tier: 'SOVEREIGN',
        priceMonthly: 2999,
        priceYearly: 29990,
        trialDays: 45,
        maxUsers: 2000,
        maxStorageGb: 1000,
        description: 'Single-tenant isolated cluster with bespoke sovereign residency and zero egress.',
        features: [
          'Unlimited Field Representatives & Admins',
          'Dedicated PostgreSQL Database Instance',
          'Hardware Security Module (HSM) Vault',
          'Multi-Jurisdiction Tax & Automated FX',
          'Custom Feature Engineering & SLAs',
          '99.99% Uptime Guarantee'
        ]
      }
    ];
  }, [plans]);

  // Count enrolled companies per plan
  const getPlanEnrolledCount = (planTierOrCode) => {
    return companies.filter(c =>
      (c.plan && c.plan.toUpperCase() === planTierOrCode.toUpperCase()) ||
      (c.planTier && c.planTier.toUpperCase() === planTierOrCode.toUpperCase())
    ).length;
  };

  return (
    <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
            }}>
              <Layers size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Subscription Plans &amp; Pricing Architecture
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                Create, customize, and govern SaaS pricing tiers, user limits, quotas, and feature modules.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '3px',
            borderRadius: '10px', border: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              style={{
                border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem',
                cursor: 'pointer', fontWeight: '700',
                background: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                color: billingCycle === 'monthly' ? '#0f172a' : '#64748b',
                boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              style={{
                border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem',
                cursor: 'pointer', fontWeight: '700',
                background: billingCycle === 'yearly' ? '#ffffff' : 'transparent',
                color: billingCycle === 'yearly' ? '#0f172a' : '#64748b',
                boxShadow: billingCycle === 'yearly' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <span>Annual</span>
              <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '4px' }}>
                Save 20%
              </span>
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (setIsCreatePlanOpen) setIsCreatePlanOpen(true);
              else showToast('Opening plan creation dialog', 'info');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none'
            }}
          >
            <Plus size={16} /> + Create New Plan
          </button>
        </div>
      </div>

      {/* ── Plans Grid ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {displayPlans.map((plan) => {
          const enrolledCount = getPlanEnrolledCount(plan.tier || plan.code);
          const price = billingCycle === 'yearly'
            ? Math.round((plan.priceYearly || plan.priceMonthly * 10) / 12)
            : (plan.priceMonthly || 100);

          return (
            <div
              key={plan.id || plan.code}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: plan.isPopular ? '2px solid #6366f1' : '1px solid #e2e8f0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: plan.isPopular ? '0 10px 25px -5px rgba(99, 102, 241, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              {plan.isPopular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                  fontSize: '0.72rem', fontWeight: '800', padding: '3px 12px', borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
                }}>
                  ⭐ MOST POPULAR
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }}>
                    {plan.name}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
                    Code: <code>{plan.code || plan.tier}</code>
                  </span>
                </div>

                <div className="actions-cluster" style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className="action-pill-btn"
                    onClick={() => {
                      if (handleOpenEditPlan) handleOpenEditPlan(plan);
                      else if (setEditingPlanForm && setIsEditPlanOpen) {
                        setEditingPlanForm({
                          id: plan.id,
                          code: plan.code,
                          name: plan.name,
                          description: plan.description,
                          tier: plan.tier || 'STARTER',
                          priceMonthly: plan.priceMonthly || 100,
                          priceYearly: plan.priceYearly || 1000,
                          trialDays: plan.trialDays || 14,
                          featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : ''
                        });
                        setIsEditPlanOpen(true);
                      }
                    }}
                    title="Edit Plan Pricing & Quotas"
                  >
                    <Edit size={12} />
                  </button>

                  <button
                    type="button"
                    className="action-pill-btn red"
                    onClick={() => {
                      if (handleOpenDeletePlan) handleOpenDeletePlan(plan);
                      else if (setDeletingPlan && setIsDeletePlanOpen) {
                        setDeletingPlan(plan);
                        setIsDeletePlanOpen(true);
                      }
                    }}
                    title="Delete Plan Tier"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 16px', minHeight: '38px', lineHeight: '1.4' }}>
                {plan.description || 'Enterprise grade field sales automation package.'}
              </p>

              {/* Price display */}
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a' }}>
                    ${price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                    / month
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  {billingCycle === 'yearly'
                    ? `Billed annually ($${(plan.priceYearly || price * 12).toLocaleString()} / yr)`
                    : 'Billed monthly'} &bull; {plan.trialDays || 14}-Day Trial
                </div>
              </div>

              {/* Enrolled Companies Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px',
                border: '1px solid #bbf7d0', marginBottom: '18px'
              }}>
                <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '700' }}>
                  🏢 Enrolled Organizations:
                </span>
                <button
                  type="button"
                  onClick={() => setViewingPlanTenants(plan)}
                  style={{
                    background: 'none', border: 'none', color: '#15803d', fontWeight: '800',
                    fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline'
                  }}
                >
                  {enrolledCount} Active Tenants &rarr;
                </button>
              </div>

              {/* Quotas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
                <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Max MR Seats</span>
                  <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>{plan.maxUsers || 50} Reps</strong>
                </div>
                <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Storage Quota</span>
                  <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>{plan.maxStorageGb || 25} GB</strong>
                </div>
              </div>

              {/* Included Features List */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Included Capabilities:
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(Array.isArray(plan.features) ? plan.features : (plan.featuresText ? plan.featuresText.split('\n') : [
                    'Daily Call Reporting (DCR)',
                    'Chemist Order Booking',
                    'Mobile App Telemetry'
                  ])).map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                      <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Feature Comparison Matrix Table ───────────────────────────────── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
          Side-by-Side Enterprise Capability Matrix
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px' }}>
          Detailed breakdown of modules, telemetry limits, and architectural guarantees per tier.
        </p>

        <div className="saas-table-container">
          <table className="saas-data-table">
            <thead>
              <tr>
                <th>Feature Capability</th>
                <th>Starter</th>
                <th>Professional</th>
                <th>Enterprise</th>
                <th>Sovereign</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Core MR Daily Call Reports (DCR)', starter: true, pro: true, ent: true, sov: true },
                { feature: 'Doctor & Chemist Registry', starter: true, pro: true, ent: true, sov: true },
                { feature: 'Chemist Order Booking (POB)', starter: true, pro: true, ent: true, sov: true },
                { feature: 'Live GPS Geofencing & Location Audit', starter: false, pro: true, ent: true, sov: true },
                { feature: 'Sample Stock & Batch Tracking', starter: false, pro: true, ent: true, sov: true },
                { feature: 'Manager Approval Workflows', starter: false, pro: true, ent: true, sov: true },
                { feature: 'AI Beat Route & Target Planner', starter: false, pro: false, ent: true, sov: true },
                { feature: 'Sovereign Multi-Country Residency', starter: false, pro: false, ent: true, sov: true },
                { feature: '21 CFR Part 11 Regulatory Audit', starter: false, pro: false, ent: true, sov: true },
                { feature: 'Dedicated Isolated PostgreSQL DB', starter: false, pro: false, ent: false, sov: true }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.feature}</strong></td>
                  <td>{row.starter ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#cbd5e1" />}</td>
                  <td>{row.pro ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#cbd5e1" />}</td>
                  <td>{row.ent ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#cbd5e1" />}</td>
                  <td>{row.sov ? <CheckCircle2 size={16} color="#16a34a" /> : <XCircle size={16} color="#cbd5e1" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: VIEW ENROLLED COMPANIES PER PLAN ───────────────────────── */}
      {viewingPlanTenants && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '16px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={20} color="#6366f1" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Tenants on {viewingPlanTenants.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    Active companies enrolled in this subscription tier.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingPlanTenants(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {companies.filter(c =>
                (c.plan && c.plan.toUpperCase() === (viewingPlanTenants.tier || viewingPlanTenants.code).toUpperCase())
              ).length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No companies currently enrolled in this specific tier.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {companies
                    .filter(c => (c.plan && c.plan.toUpperCase() === (viewingPlanTenants.tier || viewingPlanTenants.code).toUpperCase()))
                    .map(comp => (
                      <div
                        key={comp.id || comp.code}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{comp.name}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                            {comp.country || 'Global'} &bull; {comp.usersCount || comp.user_count || 1} Users
                          </span>
                        </div>
                        <span className={`status-tag status-${(comp.status || 'ACTIVE').toLowerCase()}`}>
                          {comp.status || 'Active'}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingPlanTenants(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
