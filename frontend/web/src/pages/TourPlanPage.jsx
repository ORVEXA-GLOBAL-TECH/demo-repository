import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle2, Route, Clock } from 'lucide-react';
import { getTourPlans } from '../services/api';

export default function TourPlanPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await getTourPlans();
      setPlans(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Monthly Tour Program (MTP) & Beat Plans</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Scheduled doctor coverage routes, chemist audit beats and MR travel planning
            </p>
          </div>
          <span className="status-badge badge-pending">Active Cycle: September 2026</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '12px' }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{plan.dayOfWeek}, {plan.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>
                    <MapPin size={15} />
                    <span>{plan.territory}</span>
                  </div>
                </div>
                <span className="status-badge badge-submitted">{plan.status}</span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <strong>Key Objectives:</strong> {plan.objectives}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  Planned Doctor Visits ({plan.plannedDoctors?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(plan.plannedDoctors || []).map((doc, idx) => (
                    <span key={idx} style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                      👨‍⚕️ {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  Attached Chemist Audits ({plan.plannedChemists?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(plan.plannedChemists || []).map((chm, idx) => (
                    <span key={idx} style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                      🏪 {chm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
