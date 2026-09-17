import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Radio, Battery, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getLiveTracking } from '../services/api';

export default function TrackingPage() {
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    try {
      const res = await getLiveTracking();
      setOfficers(res.activeFieldOfficers || []);
    } catch (e) {
      console.error(e);
    }
  };

  const rep = officers[0] || {};

  return (
    <div>
      <div className="card-section" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="#67e8f9" />
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.06em' }}>
                Live GPS Satellite Telemetry & Geofence
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>
              Active Officer: {rep.name} ({rep.role})
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#e0f2fe', marginTop: '4px' }}>
              Territory: <strong>{rep.territory}</strong> • Current GPS Fix: <strong>{rep.currentLocation}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Battery size={16} /> Device Battery: {rep.battery || '84%'}
            </span>
            <span style={{ background: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800' }}>
              ● Live Online
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Real-time Field Breadcrumb Timeline */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Today's Geo-Verified Visit Breadcrumb Trail</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Sequential doctor call coordinates & geofence validation
              </p>
            </div>
          </div>

          <div className="timeline-track">
            {(rep.pings || []).map((ping, idx) => (
              <div key={ping.id} className="timeline-step">
                <div className="timeline-pin" style={{ backgroundColor: idx === 0 ? '#16a34a' : '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '800' }}>{ping.timestamp}</span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                      {ping.activity}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                      <MapPin size={14} color="#64748b" />
                      <span>{ping.locationName}</span>
                    </div>
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', border: '1px solid #bbf7d0' }}>
                    GPS Accuracy: {ping.gpsAccuracy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Territory Map Overview Simulation */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Field Geo-Radar & Perimeter View</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Active doctor clinics & chemist delivery checkpoints
              </p>
            </div>
          </div>

          <div style={{
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: '#ffffff',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #334155',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '800' }}>SOUTH DELHI CLINIC PERIMETER</span>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '700' }}>● GPS Pings Active (5s interval)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                Geo Bounds: 28.5204° N to 28.5601° N | 77.2001° E to 77.2831° E
              </div>
            </div>

            {/* Radar Simulation Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Max Super Speciality (Saket)</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dr. Arvind Mehra (A+)</div>
                <div style={{ fontSize: '0.72rem', color: '#4ade80', marginTop: '2px' }}>✓ Geo-CheckIn Verified (10:45 AM)</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Fortis Escorts Heart (Okhla)</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dr. Sunita Rao (A)</div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>✓ Geo-CheckIn Verified (02:30 PM)</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #a855f7' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Apollo Medplus Pharmacy</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Chemist Audit & POB</div>
                <div style={{ fontSize: '0.72rem', color: '#4ade80', marginTop: '2px' }}>✓ Order Pushed to Stockist</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #eab308' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Hauz Khas Outer Ring Road</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Current Rep Position</div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>● In Transit to Green Park</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span>Total Route Distance Today: <strong>42 KM</strong></span>
              <span>Speed: <strong>24 km/h</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
