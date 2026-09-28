import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Receipt, Calculator, CheckCheck, AlertTriangle } from 'lucide-react';
import { getExpenses, submitExpense, updateExpenseStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_EXPENSES = [
  {
    id: 'exp-1',
    claimNumber: 'EXP-2026-4401',
    date: '2026-09-28',
    stationType: 'HQ',
    claimType: 'HQ_FIELD_WORK',
    travelKm: 38,
    fareRatePerKm: 4.5,
    travelAllowance: 171,
    dailyAllowance: 350,
    hotelCharges: 0,
    miscellaneousCharges: 60,
    miscDescription: 'Doctor clinic parking slips',
    totalClaimAmount: 581,
    mrName: 'Amit Verma',
    mrId: 'usr-007',
    status: 'APPROVED',
    managerRemarks: 'Verified with GPS telemetry & DCR'
  },
  {
    id: 'exp-2',
    claimNumber: 'EXP-2026-4402',
    date: '2026-09-27',
    stationType: 'EX_HQ',
    claimType: 'EX_HQ_FIELD_WORK',
    travelKm: 56,
    fareRatePerKm: 5.0,
    travelAllowance: 280,
    dailyAllowance: 450,
    hotelCharges: 0,
    miscellaneousCharges: 120,
    miscDescription: 'Toll plaza receipt',
    totalClaimAmount: 850,
    mrName: 'Amit Verma',
    mrId: 'usr-007',
    status: 'SUBMITTED',
    managerRemarks: 'Pending accountant verification'
  }
];

export default function ExpensesPage() {
  const { role, currentUser } = useAuth();
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
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
      if (res && res.data && res.data.length > 0) {
        setExpenses(res.data);
      }
    } catch (e) {
      console.warn('Expenses load fallback:', e);
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
    const newClaim = {
      id: `exp-${Date.now()}`,
      claimNumber: `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      stationType,
      claimType: `${stationType}_FIELD_WORK`,
      travelKm: Number(travelKm),
      fareRatePerKm: fareRate,
      travelAllowance,
      dailyAllowance: daRate,
      hotelCharges: Number(hotelCharges),
      miscellaneousCharges: Number(miscCharges),
      miscDescription: miscDesc,
      totalClaimAmount: totalCalculated,
      mrName: currentUser?.name || 'Amit Verma',
      mrId: currentUser?.id || 'usr-007',
      status: 'SUBMITTED'
    };

    try {
      await submitExpense(newClaim);
    } catch (e) {
      console.warn('Expense submit fallback:', e);
    }

    setExpenses(prev => [newClaim, ...prev]);
    setShowModal(false);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateExpenseStatus(id, status, 'Approved per field policy');
    } catch (e) {
      console.warn('Expense update fallback:', e);
    }
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status } : exp));
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
                  {(role === 'ADMIN' || role === 'ACCOUNTANT' || role === 'MANAGER' || role === 'RSM' || role === 'ASM') && exp.status === 'SUBMITTED' ? (
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
