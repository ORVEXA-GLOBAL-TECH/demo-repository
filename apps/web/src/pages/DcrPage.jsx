import React, { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle, XCircle, MapPin, Stethoscope, Store } from 'lucide-react';
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
    productsDetailed: [],
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
        setFormData(prev => ({ ...prev, targetId: docRes.data[0].id, targetName: docRes.data[0].name }));
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
      await submitDcr(formData);
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
            <h2 className="section-title">Daily Call Reports (DCR) Logging & Monitoring</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Doctor calls, Chemist stock audits, Samples distributed & Geo-tag validation
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
              <span>Log New Field Call</span>
            </button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Field Rep</th>
              <th>Target Contact</th>
              <th>Products Detailed</th>
              <th>Call Feedback & Remarks</th>
              <th>POB Generated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((dcr) => (
              <tr key={dcr.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{dcr.date}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.visitTime}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '500' }}>{dcr.mrName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>ID: {dcr.mrId}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {dcr.targetType === 'DOCTOR' ? <Stethoscope size={15} color="#2563eb" /> : <Store size={15} color="#16a34a" />}
                    <span style={{ fontWeight: '600' }}>{dcr.targetName}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dcr.hospital || dcr.contactPerson}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(dcr.productsDetailed || []).map((p, idx) => (
                      <span key={idx} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ maxWidth: '280px', fontSize: '0.85rem' }}>
                  {dcr.feedback}
                </td>
                <td>
                  {dcr.pobGenerated ? (
                    <span style={{ color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>
                      ₹{dcr.pobAmount?.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No Order</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${dcr.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                    {dcr.status}
                  </span>
                </td>
                <td>
                  {(role === 'ADMIN' || role === 'MANAGER') && dcr.status !== 'APPROVED' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusChange(dcr.id, 'APPROVED')}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Log New Field Call (DCR)</h3>
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
                      targetName: firstTarget ? firstTarget.name : ''
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
                    setFormData({ ...formData, targetId: id, targetName: item ? item.name : '' });
                  }}
                >
                  {formData.targetType === 'DOCTOR'
                    ? doctorsList.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)
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
                    setFormData({ ...formData, productsDetailed: selected });
                  }}
                >
                  {productsList.map(p => (
                    <option key={p.id} value={p.name}>{p.name} - {p.category}</option>
                  ))}
                </select>
                <small style={{ color: '#64748b' }}>Hold Ctrl (or Cmd) to select multiple products</small>
              </div>

              <div className="form-group">
                <label>Doctor / Chemist Call Remarks</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder="Doctor feedback, prescription commitment, samples handed over..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Submit DCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
