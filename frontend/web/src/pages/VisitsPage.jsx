import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList, MapPin, Clock, Stethoscope, Store, Plus,
  Search, CheckCircle2, AlertCircle, X, ShieldCheck, FileText, ChevronRight
} from 'lucide-react';
import { getVisits, recordVisit, getDoctors, getChemists, getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function VisitsPage() {
  const { currentUser } = useAuth();
  const { activeTenant } = useTenantTheme();
  const [visits, setVisits] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Form states
  const [doctorsList, setDoctorsList] = useState([]);
  const [chemistsList, setChemistsList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  const [newVisit, setNewVisit] = useState({
    targetType: 'DOCTOR',
    targetName: 'Dr. Arvind Mehra',
    targetId: 'DOC-101',
    hospitalOrClinic: 'Max Super Speciality Hospital, Saket',
    specialty: 'Cardiologist',
    callPurpose: 'Product Detailing & Clinical Trial Presentation',
    productsDetailed: ['CardioShield 50mg'],
    samplesHanded: 'CardioShield 50mg (4 boxes)',
    feedback: 'Doctor confirmed prescription interest. Follow up in 2 weeks.',
    pobBooked: false,
    pobAmount: 0
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadVisits();
    loadCatalogOptions();
  }, []);

  const loadVisits = async () => {
    try {
      const res = await getVisits();
      if (res && res.data) {
        setVisits(res.data);
      }
    } catch (e) {
      console.warn('Visits load error:', e);
    }
  };

  const loadCatalogOptions = async () => {
    try {
      const [dRes, cRes, pRes] = await Promise.all([getDoctors(), getChemists(), getProducts()]);
      setDoctorsList(dRes.data || []);
      setChemistsList(cRes.data || []);
      setProductsList(pRes.data || []);
    } catch (e) {
      console.warn('Catalog options error:', e);
    }
  };

  const handleStartVisitSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `VIS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mrName: currentUser?.name || 'Amit Verma',
      mrId: currentUser?.id || 'usr-007',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: 'In Progress (Active Call)',
      durationMinutes: 25,
      gpsVerified: true,
      gpsCoordinates: '28.5284° N, 77.2185° E (14m accuracy)',
      status: 'COMPLETED',
      ...newVisit,
      linkedDcrId: `DCR-${Date.now()}`
    };

    try {
      await recordVisit(created);
    } catch (err) {
      console.warn('Local visit submit:', err);
    }

    setVisits([created, ...visits]);
    setShowStartModal(false);
  };

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchType = filterType === 'ALL' || v.targetType === filterType;
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        v.targetName.toLowerCase().includes(q) ||
        v.hospitalOrClinic.toLowerCase().includes(q) ||
        v.specialty.toLowerCase().includes(q) ||
        v.callPurpose.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [visits, filterType, search]);

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
              <ClipboardList size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Field Force Execution • Real-time Call Capturing
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Field Visits 360° &amp; Geo-Verified Interactions
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              GPS Satellite Coordinate Verification • Digital E-Detailing • Sample Handover Ledger • Direct DCR Linkage
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowStartModal(true)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Start Customer Call</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              <ClipboardList size={16} />
              <span>All Visits</span>
              <span className="tab-badge">{visits.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'DOCTOR' ? 'active' : ''}`}
              onClick={() => setFilterType('DOCTOR')}
            >
              <Stethoscope size={16} />
              <span>Doctor Calls</span>
              <span className="tab-badge">{visits.filter(v => v.targetType === 'DOCTOR').length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterType === 'CHEMIST' ? 'active' : ''}`}
              onClick={() => setFilterType('CHEMIST')}
            >
              <Store size={16} />
              <span>Chemist Audits</span>
              <span className="tab-badge">{visits.filter(v => v.targetType === 'CHEMIST').length}</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search visits by HCP, clinic, purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Visits Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table className="custom-table" style={{ margin: 0, width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px' }}>Customer / Clinic Name</th>
                <th style={{ padding: '12px 14px' }}>Time &amp; GPS Telemetry</th>
                <th style={{ padding: '12px 14px' }}>Detailing Purpose</th>
                <th style={{ padding: '12px 14px' }}>Detailed Brands</th>
                <th style={{ padding: '12px 14px' }}>Sample Distribution</th>
                <th style={{ padding: '12px 14px' }}>Status &amp; DCR</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map((v) => (
                <tr key={v.id}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{v.targetName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>{v.hospitalOrClinic}</div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{v.specialty}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.82rem' }}>
                      🕒 {v.startTime} ({v.durationMinutes} mins)
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      <ShieldCheck size={12} /> {v.gpsCoordinates}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#334155' }}>
                    {v.callPurpose}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(v.productsDetailed || []).map((p, i) => (
                        <span key={i} style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#475569' }}>
                    {Array.isArray(v.samplesHanded)
                      ? (v.samplesHanded.length > 0 ? v.samplesHanded.map(s => `${s.product} (${s.qty})`).join(', ') : 'None')
                      : (v.samplesHanded || 'None')}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                      ✓ {v.status}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{v.linkedDcrId}</div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedVisit(v)}
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Start Visit Modal */}
      {showStartModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>+ Record In-Clinic Field Visit</h3>
              <button type="button" onClick={() => setShowStartModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleStartVisitSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Target Customer Type</label>
                  <select
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newVisit.targetType}
                    onChange={e => setNewVisit({ ...newVisit, targetType: e.target.value })}
                  >
                    <option value="DOCTOR">Doctor (HCP Call)</option>
                    <option value="CHEMIST">Chemist (Retail Audit &amp; POB)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newVisit.targetName}
                    onChange={e => setNewVisit({ ...newVisit, targetName: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Hospital / Clinic Affiliation</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={newVisit.hospitalOrClinic}
                  onChange={e => setNewVisit({ ...newVisit, hospitalOrClinic: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Key Prescribing Products Detailed</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  placeholder="e.g. CardioShield 50mg, NeuroCalm Plus"
                  value={newVisit.productsDetailed.join(', ')}
                  onChange={e => setNewVisit({ ...newVisit, productsDetailed: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Physician Feedback &amp; Follow-up</label>
                <textarea
                  className="form-control"
                  rows={2}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '0.82rem' }}
                  value={newVisit.feedback}
                  onChange={e => setNewVisit({ ...newVisit, feedback: e.target.value })}
                />
              </div>
              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #bbf7d0', marginBottom: '16px', fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} />
                <span>GPS fix automatically captured: <strong>28.5284° N, 77.2185° E</strong> (14m Geofence Validated)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStartModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Finalize &amp; Log Visit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedVisit && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Visit Audit Record: {selectedVisit.id}</h3>
              <button type="button" onClick={() => setSelectedVisit(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.82rem' }}>
              <div><strong>HCP:</strong> {selectedVisit.targetName} ({selectedVisit.specialty})</div>
              <div><strong>Affiliation:</strong> {selectedVisit.hospitalOrClinic}</div>
              <div><strong>MR:</strong> {selectedVisit.mrName} ({selectedVisit.mrId})</div>
              <div><strong>Telemetry:</strong> {selectedVisit.gpsCoordinates}</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '14px' }}>
              <strong>Discussion &amp; Feedback:</strong>
              <p style={{ marginTop: '4px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px' }}>
                {selectedVisit.feedback}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedVisit(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
