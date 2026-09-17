import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Receipt, Calculator, CheckCheck, AlertTriangle } from 'lucide-react';
import { getExpenses, submitExpense, updateExpenseStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExpensesPage() {
  const { role, currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [stationType, setStationType] = useState('HQ');
  const [travelKm, setTravelKm] = useState(38);
  const [hotelCharges, setHotelCharges] = useState(0);
  const [miscCharges, setMiscCharges] = useState(60);
  const [miscDesc, setMiscDesc] = useState('Doctor clinic parking & toll slip');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const getFareRate = (type) => {
    switch (type) {
      case 'EX_HQ': return 5.0;
      case 'OUTSTATION': return 6.0;
      default: return 4.5;
    }
  };

  const getDaRate = (type) => {
    switch (type) {
      case 'EX_HQ': return 450;
      case 'OUTSTATION': return 650;
      default: return 350;
    }
  };

  const fareRate = getFareRate(stationType);
  const daRate = getDaRate(stationType);
  const travelAllowance = Number(travelKm) * fareRate;
  const totalCalculated = travelAllowance + daRate + Number(hotelCharges) + Number(miscCharges);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await submitExpense({
        claimType: `${stationType}_FIELD_WORK`,
        stationType,
        travelKm: Number(travelKm),
        fareRatePerKm: fareRate,
        dailyAllowance: daRate,
        hotelCharges: Number(hotelCharges),
        miscellaneousCharges: Number(miscCharges),
        miscDescription: miscDesc,
        mrName: currentUser.name,
        mrId: currentUser.id
      });
      setShowModal(false);
      loadExpenses();
    } catch (e) {
      alert('Failed to submit claim');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const remarks = prompt('Enter manager approval remarks:', 'Verified with GPS travel logs & DCR calls');
      await updateExpenseStatus(id, status, remarks || '');
      loadExpenses();
    } catch (e) {
      alert('Failed to update expense status');
    }
  };

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Field Travel & Daily Allowance (TA / DA) Smart Expense Engine</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              GPS distance validation, HQ vs Ex-HQ allowance tiers & automated manager compliance checks
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              <span>File Daily Claim</span>
            </button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Claim Date</th>
              <th>Officer & Station</th>
              <th>Travel (TA)</th>
              <th>Daily Allowance (DA)</th>
              <th>Hotel & Misc</th>
              <th>Total Claim</th>
              <th>Policy Status</th>
              <th>Manager Approval</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <div style={{ fontWeight: '700' }}>{exp.date}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {exp.id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{exp.mrName}</div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    color: exp.stationType === 'EX_HQ' ? '#d97706' : '#2563eb',
                    background: exp.stationType === 'EX_HQ' ? '#fffbeb' : '#eff6ff',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {exp.stationType || 'HQ'} Station
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>₹{exp.travelAllowance?.toFixed(2)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({exp.travelKm} KM @ ₹{exp.fareRatePerKm}/KM)</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>₹{exp.dailyAllowance?.toFixed(2)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fixed Tier DA</div>
                </td>
                <td>
                  <div>₹{((exp.hotelCharges || 0) + (exp.miscellaneousCharges || 0)).toFixed(2)}</div>
                  {exp.miscDescription && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{exp.miscDescription}</div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>
                    ₹{exp.totalClaimAmount?.toFixed(2)}
                  </div>
                </td>
                <td>
                  <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800', border: '1px solid #bbf7d0' }}>
                    ✓ Policy Compliant
                  </span>
                  {exp.managerRemarks && (
                    <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                      ↳ {exp.managerRemarks}
                    </div>
                  )}
                </td>
                <td>
                  {(role === 'ADMIN' || role === 'RSM' || role === 'ASM') && exp.status === 'SUBMITTED' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(exp.id, 'APPROVED')}
                      >
                        <Check size={13} /> Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusUpdate(exp.id, 'REJECTED')}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className={`status-badge ${exp.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                      {exp.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>File Daily TA/DA Claim</h3>
            <form onSubmit={handleCreateExpense}>
              <div className="form-group">
                <label>Duty Station Type</label>
                <select
                  className="form-control"
                  value={stationType}
                  onChange={(e) => setStationType(e.target.value)}
                >
                  <option value="HQ">Headquarter (HQ) Field Day (₹4.50/KM, DA: ₹350)</option>
                  <option value="EX_HQ">Ex-Headquarter (Ex-HQ) Travel (₹5.00/KM, DA: ₹450)</option>
                  <option value="OUTSTATION">Outstation Night Stay (₹6.00/KM, DA: ₹650)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Total GPS Travel Distance (KM)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={travelKm}
                    min="0"
                    onChange={(e) => setTravelKm(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Hotel & Lodging Charges (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hotelCharges}
                    onChange={(e) => setHotelCharges(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Misc / Parking / Tolls (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={miscCharges}
                  onChange={(e) => setMiscCharges(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Miscellaneous Details / Toll Ticket Numbers</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Max Saket clinic parking slip & toll plaza"
                  value={miscDesc}
                  onChange={(e) => setMiscDesc(e.target.value)}
                />
              </div>

              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '700' }}>Calculated Total Claim Amount:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#15803d' }}>
                  ₹{totalCalculated.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '2px' }}>
                  Breakup: TA ₹{travelAllowance.toFixed(2)} + DA ₹{daRate} + Misc ₹{miscCharges || 0}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
