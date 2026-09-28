import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, CheckCircle2, Route, Clock,
  Plus, Search, Filter, Check, X, ShieldCheck
} from 'lucide-react';
import { getTourPlans, createTourPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function TourPlanPage() {
  const { currentUser, role } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [plans, setPlans] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const [newPlan, setNewPlan] = useState({
    date: '2026-10-01',
    dayOfWeek: 'Thursday',
    territory: 'Saket & Malviya Nagar (South Delhi)',
    objectives: 'Promote CardioShield 50mg and follow up on institutional clinic tenders.',
    plannedDoctors: 'Dr. Arvind Mehra, Dr. Rajesh K. Gupta',
    plannedChemists: 'Apollo Pharmacy Saket, MedPlus Pharmacy',
    distanceEstimateKm: 35
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await getTourPlans();
      if (res && res.data) {
        setPlans(res.data);
      }
    } catch (e) {
      console.warn('Tour plans error:', e);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `MTP-${Date.now()}`,
      date: newPlan.date,
      dayOfWeek: newPlan.dayOfWeek,
      mrName: currentUser?.name || 'Amit Verma',
      territory: newPlan.territory,
      objectives: newPlan.objectives,
      plannedDoctors: newPlan.plannedDoctors.split(',').map(s => s.trim()),
      plannedChemists: newPlan.plannedChemists.split(',').map(s => s.trim()),
      status: 'SUBMITTED',
      distanceEstimateKm: Number(newPlan.distanceEstimateKm) || 30,
      approver: 'Pending Supervisor Review'
    };

    try {
      await createTourPlan(created);
    } catch (err) {
      console.warn('Local plan submit:', err);
    }

    setPlans([created, ...plans]);
    setShowAddModal(false);
  };

  const handleApprove = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, status: 'APPROVED', approver: `${currentUser?.name || 'Supervisor'} (Approved)` } : p));
  };

  const filteredPlans = plans.filter(p => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.territory.toLowerCase().includes(q) ||
      p.objectives.toLowerCase().includes(q) ||
      (p.dayOfWeek && p.dayOfWeek.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
      
      {/* Top Banner */}
      <div
        className="card-section"
        style={{
          background: `linear-gradient(135deg, ${brandColor}dd, #0f172a)`,
          color: '#ffffff',
          marginBottom: '20px',
          padding: '24px',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Field Travel Program &amp; Beat Schedule Planning
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Monthly Tour Program (MTP) &amp; Daily Beat Routing
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Structured Doctor Coverage Frequency • Chemist Audit Routines • Manager Approval Lifecycle
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Create Beat Plan</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>Active Cycle:</span>
            <span className="status-badge badge-pending" style={{ fontSize: '0.78rem' }}>September - October 2026</span>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search beat plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>{plan.dayOfWeek}, {plan.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '0.82rem', fontWeight: '700', marginTop: '2px' }}>
                      <MapPin size={14} />
                      <span>{plan.territory}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: plan.status === 'APPROVED' ? '#dcfce7' : '#fef3c7',
                      color: plan.status === 'APPROVED' ? '#15803d' : '#b45309'
                    }}
                  >
                    {plan.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <strong>Key Objectives:</strong> {plan.objectives}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', marginBottom: '6px' }}>
                    Target Doctors ({plan.plannedDoctors?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(plan.plannedDoctors || []).map((doc, idx) => (
                      <span key={idx} style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: '600' }}>
                        👨‍⚕️ {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', marginBottom: '6px' }}>
                    Attached Chemists ({plan.plannedChemists?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(plan.plannedChemists || []).map((chm, idx) => (
                      <span key={idx} style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: '600' }}>
                        🏪 {chm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Approver: <strong>{plan.approver || 'Pending'}</strong></span>
                {plan.status === 'SUBMITTED' && (role === 'ADMIN' || role === 'MANAGER' || role === 'MR_SUPERVISOR') && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => handleApprove(plan.id)}
                    style={{ background: '#16a34a', color: '#ffffff', padding: '3px 10px', fontSize: '0.72rem', borderRadius: '4px' }}
                  >
                    ✓ Approve Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Beat Plan Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>+ Schedule Tour Beat Plan</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newPlan.date}
                    onChange={e => setNewPlan({ ...newPlan, date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Day of Week</label>
                  <select
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newPlan.dayOfWeek}
                    onChange={e => setNewPlan({ ...newPlan, dayOfWeek: e.target.value })}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Target Territory *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={newPlan.territory}
                  onChange={e => setNewPlan({ ...newPlan, territory: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Planned Doctors (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={newPlan.plannedDoctors}
                  onChange={e => setNewPlan({ ...newPlan, plannedDoctors: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Planned Chemists</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={newPlan.plannedChemists}
                  onChange={e => setNewPlan({ ...newPlan, plannedChemists: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Beat Objectives &amp; Focus</label>
                <textarea
                  className="form-control"
                  rows={2}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '0.82rem' }}
                  value={newPlan.objectives}
                  onChange={e => setNewPlan({ ...newPlan, objectives: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Submit Beat Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
