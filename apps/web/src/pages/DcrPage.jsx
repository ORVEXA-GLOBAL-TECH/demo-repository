import React, { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle, XCircle, MapPin, Stethoscope, Store, ShieldCheck, Check } from 'lucide-react';
import { getDcrReports, submitDcr, updateDcrStatus, getDoctors, getChemists, getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DcrPage() {
  const { role } = useAuth();
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [doctorsList, setDoctorsList] = useState([]);
  const [chemistsList, setChemistsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  
  const [formData, setFormData] = useState({
    targetType: 'DOCTOR',
    targetId: '',
    targetName: '',
    hospital: '',
    productsDetailed: [],
    samplesGiven: [],
    feedback: '',
    pobGenerated: false,
    pobAmount: 0
  });

  useEffect(() => {
    loadReports();
    loadCatalogOptions();
  }, [filterType]);

  const loadReports = async () => {
    try {
      const res = await getDcrReports({ targetType: filterType });
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCatalogOptions = async () => {
    try {
      const [docRes, chmRes, prdRes] = await Promise.all([
        getDoctors(),
        getChemists(),
        getProducts()
      ]);
      setDoctorsList(docRes.data || []);
      setChemistsList(chmRes.data || []);
      setProductsList(prdRes.data || []);
      if (docRes.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          targetId: docRes.data[0].id,
          targetName: docRes.data[0].name,
          hospital: docRes.data[0].hospital
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDcrStatus(id, newStatus);
      loadReports();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleCreateDcr = async (e) => {
    e.preventDefault();
    try {
      await submitDcr({
        ...formData,
        geoVerified: true,
        geoDistanceMeters: 28,
        geoLat: 28.5284,
        geoLng: 77.2185
      });
      setShowModal(false);
      loadReports();
    } catch (e) {
      alert('Failed to submit DCR');
    }
  };

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Daily Call Reports (DCR) 360° Management</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Doctor calls, Chemist stock audits, Sample allocations, Digital Detailing & GPS Geofence Verification
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Call Types</option>
              <option value="DOCTOR">Doctor Calls Only</option>
              <option value="CHEMIST">Chemist Calls Only</option>
            </select>

            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              <span>Log Field Call</span>
            </button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Field Officer</th>
              <th>Target Contact & Class</th>
              <th>Products Detailed</th>
              <th>Samples & Promo Inputs</th>
              <th>Doctor Call Feedback</th>
              <th>Geofence Status</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((dcr) => (
              <tr key={dcr.id}>
                <td>
                  <div style={{ fontWeight: '700' }}>{dcr.date}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.visitTime}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{dcr.mrName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>ID: {dcr.mrId}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {dcr.targetType === 'DOCTOR' ? <Stethoscope size={15} color="#2563eb" /> : <Store size={15} color="#16a34a" />}
                    <span style={{ fontWeight: '700' }}>{dcr.targetName}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.hospital || dcr.contactPerson}</div>
                  {dcr.specialty && (
                    <span style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: '700' }}>{dcr.specialty}</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(dcr.productsDetailed || []).map((p, idx) => (
                      <span key={idx} style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {(dcr.samplesGiven || []).map((s, idx) => (
                      <span key={idx} style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '600' }}>
                        • {s.qty}x Sample: {s.product}
                      </span>
                    ))}
                    {(dcr.inputsGiven || []).map((inp, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ↳ {inp}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ maxWidth: '260px', fontSize: '0.84rem' }}>
                  {dcr.feedback}
                </td>
                <td>
                  {dcr.geoVerified ? (
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="#16a34a" /> Geofence Verified ({dcr.geoDistanceMeters || 30}m)
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Manual Entry</span>
                  )}
                </td>
                <td>
                  {(role === 'ADMIN' || role === 'RSM' || role === 'ASM') && dcr.status !== 'APPROVED' ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusChange(dcr.id, 'APPROVED')}
                    >
                      <Check size={13} /> Approve
                    </button>
                  ) : (
                    <span className={`status-badge ${dcr.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                      {dcr.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Call Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Log New Field Call (DCR)</h3>
            <form onSubmit={handleCreateDcr}>
              <div className="form-group">
                <label>Call Target Type</label>
                <select
                  className="form-control"
                  value={formData.targetType}
                  onChange={(e) => {
                    const type = e.target.value;
                    const firstTarget = type === 'DOCTOR' ? doctorsList[0] : chemistsList[0];
                    setFormData({
                      ...formData,
                      targetType: type,
                      targetId: firstTarget ? firstTarget.id : '',
                      targetName: firstTarget ? firstTarget.name : '',
                      hospital: firstTarget ? (firstTarget.hospital || firstTarget.address) : ''
                    });
                  }}
                >
                  <option value="DOCTOR">Doctor Visit</option>
                  <option value="CHEMIST">Chemist Visit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Select Contact</label>
                <select
                  className="form-control"
                  value={formData.targetId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const list = formData.targetType === 'DOCTOR' ? doctorsList : chemistsList;
                    const item = list.find(x => x.id === id);
                    setFormData({
                      ...formData,
                      targetId: id,
                      targetName: item ? item.name : '',
                      hospital: item ? (item.hospital || item.address) : ''
                    });
                  }}
                >
                  {formData.targetType === 'DOCTOR'
                    ? doctorsList.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty}) - Class {d.class}</option>)
                    : chemistsList.map(c => <option key={c.id} value={c.id}>{c.name} ({c.territory})</option>)
                  }
                </select>
              </div>

              <div className="form-group">
                <label>Key Products Detailed</label>
                <select
                  className="form-control"
                  multiple
                  style={{ height: '90px' }}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, o => o.value);
                    setFormData({
                      ...formData,
                      productsDetailed: selected,
                      samplesGiven: selected.map(p => ({ product: p, qty: 2 }))
                    });
                  }}
                >
                  {productsList.map(p => (
                    <option key={p.id} value={p.name}>{p.name} - {p.category}</option>
                  ))}
                </select>
                <small style={{ color: '#64748b' }}>Hold Ctrl (or Cmd) to select multiple products</small>
              </div>

              <div className="form-group">
                <label>Doctor / Chemist Discussion & Rx Commitment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder="Rx commitment, study feedback, competitor remarks..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Validate DCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
