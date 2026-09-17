import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Receipt, Calculator } from 'lucide-react';
import { getExpenses, submitExpense, updateExpenseStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExpensesPage() {
  const { role, currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [travelKm, setTravelKm] = useState(35);
  const [fareRate, setFareRate] = useState(4.5);
  const [dailyAllowance, setDailyAllowance] = useState(350);
  const [hotelCharges, setHotelCharges] = useState(0);
  const [miscCharges, setMiscCharges] = useState(50);
  const [miscDesc, setMiscDesc] = useState('Doctor clinic parking');

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

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await submitExpense({
        travelKm,
        fareRatePerKm: fareRate,
        dailyAllowance,
        hotelCharges,
        miscellaneousCharges: miscCharges,
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
      const remarks = prompt('Enter manager approval/rejection remarks (optional):', 'Verified with field DCR');
      await updateExpenseStatus(id, status, remarks || '');
      loadExpenses();
    } catch (e) {
      alert('Failed to update expense status');
    }
  };

  const totalCalculated = (Number(travelKm) * Number(fareRate)) + Number(dailyAllowance) + Number(hotelCharges) + Number(miscCharges);

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Field Travel & Daily Allowance (TA / DA) Claims</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Automatic kilometer allowance computation, toll/parking miscellany & manager validation
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>File New Expense Claim</span>
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Claim Date</th>
              <th>Field Officer</th>
              <th>Travel Allowance (TA)</th>
              <th>Daily Allowance (DA)</th>
              <th>Hotel & Misc</th>
              <th>Total Claim</th>
              <th>Status & Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <div style={{ fontWeight: '600' }}>{exp.date}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.claimType}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '500' }}>{exp.mrName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>ID: {exp.mrId}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>₹{exp.travelAllowance?.toFixed(2)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>({exp.travelKm} KM @ ₹{exp.fareRatePerKm}/KM)</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>₹{exp.dailyAllowance?.toFixed(2)}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Standard Field DA</div>
                </td>
                <td>
                  <div>₹{(exp.hotelCharges + exp.miscellaneousCharges).toFixed(2)}</div>
                  {exp.miscDescription && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{exp.miscDescription}</div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#0f172a' }}>
                    ₹{exp.totalClaimAmount?.toFixed(2)}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${exp.status === 'APPROVED' ? 'badge-approved' : 'badge-submitted'}`}>
                    {exp.status}
                  </span>
                  {exp.managerRemarks && (
                    <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                      Note: {exp.managerRemarks}
                    </div>
                  )}
                </td>
                <td>
                  {(role === 'ADMIN' || role === 'MANAGER') && exp.status === 'SUBMITTED' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(exp.id, 'APPROVED')}
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusUpdate(exp.id, 'REJECTED')}
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</span>
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>File Field Expense (TA/DA)</h3>
            <form onSubmit={handleCreateExpense}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Travel Distance (KM)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={travelKm}
                    min="0"
                    onChange={(e) => setTravelKm(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fare Rate / KM (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={fareRate}
                    onChange={(e) => setFareRate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Daily Allowance (DA ₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={dailyAllowance}
                    onChange={(e) => setDailyAllowance(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Hotel Charges (₹)</label>
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
                <label>Misc Expense Details</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Doctor clinic parking & toll receipts"
                  value={miscDesc}
                  onChange={(e) => setMiscDesc(e.target.value)}
                />
              </div>

              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '600' }}>Calculated Total Claim Amount:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d' }}>
                  ₹{totalCalculated.toFixed(2)}
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
