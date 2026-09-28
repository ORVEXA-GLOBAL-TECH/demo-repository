import React, { useState, useEffect, useMemo } from 'react';
import {
  Package, Pill, BookOpen, Gift, Plus, Search,
  Filter, CheckCircle2, AlertTriangle, X, ShieldCheck, ArrowRight
} from 'lucide-react';
import { getSamplesAndPromotions, allocateSampleStock, recordSampleHandover } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function SamplesPage({ initialSubTab = 'inventory' }) {
  const { activeTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [data, setData] = useState({ inventory: [], promotions: [] });
  const [search, setSearch] = useState('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  const [allocForm, setAllocForm] = useState({
    brandName: 'CardioShield 50mg',
    batchNo: 'CS50-2026B',
    mrName: 'Amit Verma (MR)',
    quantity: 50
  });

  const [handoverForm, setHandoverForm] = useState({
    brandName: 'CardioShield 50mg',
    doctorName: 'Dr. Arvind Mehra',
    quantity: 4,
    remarks: 'Sample pack for chronic hypertensive patient trial'
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = async () => {
    try {
      const res = await getSamplesAndPromotions();
      if (res) {
        setData({
          inventory: res.inventory || [],
          promotions: res.promotions || []
        });
      }
    } catch (e) {
      console.warn('Samples load error:', e);
    }
  };

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    try {
      await allocateSampleStock(allocForm);
    } catch (err) {
      console.warn('Local allocate error:', err);
    }
    // Update local state remaining & allocated
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => {
        if (item.brandName === allocForm.brandName) {
          const qty = Number(allocForm.quantity) || 0;
          return {
            ...item,
            allocatedUnits: (item.allocatedUnits || 0) + qty,
            remainingUnits: Math.max(0, (item.remainingUnits || 0) - qty)
          };
        }
        return item;
      })
    }));
    setShowAllocateModal(false);
  };

  const handleHandoverSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordSampleHandover(handoverForm);
    } catch (err) {
      console.warn('Local handover error:', err);
    }
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => {
        if (item.brandName === handoverForm.brandName) {
          const qty = Number(handoverForm.quantity) || 0;
          return {
            ...item,
            distributedUnits: (item.distributedUnits || 0) + qty
          };
        }
        return item;
      })
    }));
    setShowHandoverModal(false);
  };

  const filteredInventory = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data.inventory;
    return data.inventory.filter(i =>
      i.brandName.toLowerCase().includes(q) ||
      i.batchNo.toLowerCase().includes(q) ||
      i.status.toLowerCase().includes(q)
    );
  }, [data.inventory, search]);

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
              <Package size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Field Assets • Batch Traceability • Non-Negative Ledger
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Pharmaceutical Samples &amp; Promotional Materials
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Central Batch Inventory • MR Stock Allocation • In-Clinic Physician Handover • Visual Aid Tracking
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setShowAllocateModal(true)}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                fontWeight: '800',
                padding: '9px 16px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>Allocate to MR</span>
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowHandoverModal(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                fontWeight: '800',
                padding: '9px 16px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Pill size={16} />
              <span>Record Doctor Handover</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('inventory')}
            >
              <Pill size={16} />
              <span>Sample Stock Ledger</span>
              <span className="tab-badge">{data.inventory.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'promotions' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('promotions')}
            >
              <Gift size={16} />
              <span>Promotional &amp; Visual Aids</span>
              <span className="tab-badge">{data.promotions.length}</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search sample brands, batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 1. Sample Inventory Table */}
        {activeSubTab === 'inventory' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Sample Brand &amp; Batch No.</th>
                  <th style={{ padding: '12px 14px' }}>Expiry Date</th>
                  <th style={{ padding: '12px 14px' }}>Total Inward</th>
                  <th style={{ padding: '12px 14px' }}>Allocated to MRs</th>
                  <th style={{ padding: '12px 14px' }}>Given to Doctors</th>
                  <th style={{ padding: '12px 14px' }}>Available Depot Balance</th>
                  <th style={{ padding: '12px 14px' }}>Ledger Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.brandName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>Batch: {item.batchNo}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#475569' }}>
                      📅 {item.expiryDate}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {item.totalUnits} Units
                    </td>
                    <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '600' }}>
                      {item.allocatedUnits} Units
                    </td>
                    <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: '600' }}>
                      {item.distributedUnits} Units
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: '800', color: item.remainingUnits < 50 ? '#dc2626' : '#0f172a', fontSize: '0.88rem' }}>
                        {item.remainingUnits} Units
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: item.status.includes('Low') ? '#fee2e2' : '#f0fdf4',
                          color: item.status.includes('Low') ? '#b91c1c' : '#15803d'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Promotional Materials Table */}
        {activeSubTab === 'promotions' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Promotional Item Name</th>
                  <th style={{ padding: '12px 14px' }}>Material Type</th>
                  <th style={{ padding: '12px 14px' }}>Target Physician Specialty</th>
                  <th style={{ padding: '12px 14px' }}>Total Depot Stock</th>
                  <th style={{ padding: '12px 14px' }}>Distributed</th>
                  <th style={{ padding: '12px 14px' }}>Remaining Stock</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.promotions.map((m) => (
                  <tr key={m.id}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{m.name}</td>
                    <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '600' }}>{m.type}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{m.targetSpecialty}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700' }}>{m.totalReceived} pcs</td>
                    <td style={{ padding: '12px 14px', color: '#16a34a' }}>{m.distributed} pcs</td>
                    <td style={{ padding: '12px 14px', fontWeight: '800' }}>{m.balance} pcs</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>● {m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Allocate Stock Modal */}
      {showAllocateModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Allocate Sample Stock to MR</h3>
              <button type="button" onClick={() => setShowAllocateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAllocateSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Sample Brand Formulation</label>
                <select
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={allocForm.brandName}
                  onChange={e => setAllocForm({ ...allocForm, brandName: e.target.value })}
                >
                  <option value="CardioShield 50mg">CardioShield 50mg (Batch CS50-2026B)</option>
                  <option value="GlucoMet Forte 500/5">GlucoMet Forte 500/5 (Batch GM-F2604)</option>
                  <option value="NeuroCalm Plus">NeuroCalm Plus (Batch NCP-9011)</option>
                  <option value="AllevOnco 100mg">AllevOnco 100mg (Batch ONC-100A)</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Assign to Medical Rep</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={allocForm.mrName}
                  onChange={e => setAllocForm({ ...allocForm, mrName: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Allocation Quantity (Boxes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="200"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={allocForm.quantity}
                  onChange={e => setAllocForm({ ...allocForm, quantity: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAllocateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Confirm Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Doctor Handover Modal */}
      {showHandoverModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Record Sample Handover to Doctor</h3>
              <button type="button" onClick={() => setShowHandoverModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleHandoverSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Target Physician *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  value={handoverForm.doctorName}
                  onChange={e => setHandoverForm({ ...handoverForm, doctorName: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Product Given</label>
                  <select
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={handoverForm.brandName}
                    onChange={e => setHandoverForm({ ...handoverForm, brandName: e.target.value })}
                  >
                    <option value="CardioShield 50mg">CardioShield 50mg</option>
                    <option value="GlucoMet Forte 500/5">GlucoMet Forte 500/5</option>
                    <option value="NeuroCalm Plus">NeuroCalm Plus</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={handoverForm.quantity}
                    onChange={e => setHandoverForm({ ...handoverForm, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Doctor Acknowledgement Remarks</label>
                <textarea
                  className="form-control"
                  rows={2}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: '0.82rem' }}
                  value={handoverForm.remarks}
                  onChange={e => setHandoverForm({ ...handoverForm, remarks: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowHandoverModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Record in Audit Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
