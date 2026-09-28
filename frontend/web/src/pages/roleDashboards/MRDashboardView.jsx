import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Stethoscope,
  ShoppingBag,
  Receipt,
  Package,
  Plus,
  ArrowUpRight,
  Send,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { recordPunchIn, recordPunchOut, recordVisit, submitDcr } from '../../services/api';

export default function MRDashboardView({
  summary,
  setActiveTab,
  currencySymbol,
  brandColor,
  currentUser,
  activeTenant,
  onRefresh
}) {
  const { todayAttendance = {}, metrics = {}, todayCallSchedule = [], sampleInventory = [], dcrStatus = {} } = summary;

  const [attendance, setAttendance] = useState(todayAttendance);
  const [calls, setCalls] = useState(todayCallSchedule);
  const [dcrState, setDcrState] = useState(dcrStatus);
  const [feedback, setFeedback] = useState(null);

  // In-Clinic Visit Capture Modal State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('Dr. Rajesh Gupta');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Physician');
  const [detailedProducts, setDetailedProducts] = useState(['CardioShield 50mg']);
  const [samplesCount, setSamplesCount] = useState(2);
  const [pobValue, setPobValue] = useState('');
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [isSubmittingDcr, setIsSubmittingDcr] = useState(false);

  // Toggle Attendance
  const handleToggleAttendance = async () => {
    try {
      if (attendance.isCheckedIn) {
        await recordPunchOut({
          location: 'Saket Field HQ, New Delhi',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setAttendance(prev => ({ ...prev, isCheckedIn: false, status: 'PUNCHED_OUT' }));
        setFeedback('Field Punch-Out recorded successfully. Have a restful evening!');
      } else {
        await recordPunchIn({
          location: 'Saket Field HQ, New Delhi',
          gpsAccuracy: '±4m',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setAttendance(prev => ({
          ...prev,
          isCheckedIn: true,
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'PRESENT_FIELD'
        }));
        setFeedback('GPS Field Check-In validated at Saket Field HQ (Accuracy: ±4m). Your day is active!');
      }
      setTimeout(() => setFeedback(null), 4000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Attendance error: ${err.message}`);
    }
  };

  // Open Visit Modal
  const handleOpenVisitModal = (customerName = 'Dr. Rajesh Gupta', specialty = 'Physician') => {
    setSelectedCustomer(customerName);
    setSelectedSpecialty(specialty);
    setIsVisitModalOpen(true);
  };

  // Save Visit
  const handleSaveVisit = async (e) => {
    e.preventDefault();
    setIsSubmittingVisit(true);

    try {
      await recordVisit({
        customerName: selectedCustomer,
        specialty: selectedSpecialty,
        productsDetailed: detailedProducts,
        samplesGiven: Number(samplesCount) || 0,
        pobValue: Number(pobValue) || 0,
        feedback: doctorFeedback || 'Prescribing support confirmed for CardioShield.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Update Call in Local State
      setCalls(prev => prev.map(c => {
        if (c.customerName === selectedCustomer) {
          return {
            ...c,
            status: 'COMPLETED',
            productsDetailed: detailedProducts,
            samplesGiven: Number(samplesCount) || 0,
            feedback: doctorFeedback || 'Prescribing support confirmed.',
            pobValue: Number(pobValue) || c.pobValue || 0
          };
        }
        return c;
      }));

      setIsVisitModalOpen(false);
      setFeedback(`In-Clinic Visit with ${selectedCustomer} recorded and added to today's DCR.`);
      setTimeout(() => setFeedback(null), 4000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`Visit save error: ${err.message}`);
    } finally {
      setIsSubmittingVisit(false);
    }
  };

  // Submit Final DCR
  const handleSubmitFinalDcr = async () => {
    setIsSubmittingDcr(true);
    try {
      await submitDcr({
        date: new Date().toISOString().slice(0, 10),
        totalCalls: calls.filter(c => c.status === 'COMPLETED').length,
        status: 'SUBMITTED'
      });
      setDcrState(prev => ({ ...prev, status: 'SUBMITTED' }));
      setFeedback("Today's Daily Call Report (DCR) successfully submitted to Supervisor Suresh Raina for sign-off.");
      setTimeout(() => setFeedback(null), 5000);
      if (onRefresh) onRefresh();
    } catch (err) {
      setFeedback(`DCR submission error: ${err.message}`);
    } finally {
      setIsSubmittingDcr(false);
    }
  };

  const completedCallsCount = calls.filter(c => c.status === 'COMPLETED').length;

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Mobile-First Field Header & Attendance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '18px 20px',
        marginBottom: '20px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                FIELD WORKSPACE
              </span>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Territory: <strong>South Delhi &amp; Saket Belt (DEL-SAK)</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '2px 0' }}>
              Amit Verma (Medical Representative)
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#38bdf8" />
              <span>Saket Field HQ, New Delhi • GPS Accuracy ±4m</span>
            </div>
          </div>

          {/* Touch-Friendly Punch-In / Punch-Out Toggle Button */}
          <button
            onClick={handleToggleAttendance}
            style={{
              backgroundColor: attendance.isCheckedIn ? '#dc2626' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '0.92rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: attendance.isCheckedIn ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 4px 12px rgba(22, 163, 74, 0.3)'
            }}
          >
            <Clock size={18} />
            <span>{attendance.isCheckedIn ? `Clock Out (In at ${attendance.checkInTime || '09:15 AM'})` : 'Clock In with GPS'}</span>
          </button>
        </div>
      </div>

      {/* Field Rep Quick Action Dock (4 Large Touch Buttons) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => handleOpenVisitModal()}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stethoscope size={22} />
            <Plus size={16} />
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.94rem' }}>Log In-Clinic Call</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Detail products &amp; samples</div>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ShoppingBag size={22} />
            <ArrowUpRight size={16} />
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.94rem' }}>Book Chemist POB</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Route to wholesale stockist</div>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Receipt size={22} />
            <Plus size={16} />
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.94rem' }}>Log Daily TA / DA</div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Travel allowance &amp; fuel</div>
        </button>

        <button
          onClick={handleSubmitFinalDcr}
          disabled={isSubmittingDcr || dcrState.status === 'SUBMITTED'}
          style={{
            backgroundColor: dcrState.status === 'SUBMITTED' ? '#e2e8f0' : '#ea580c',
            color: dcrState.status === 'SUBMITTED' ? '#64748b' : '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px',
            textAlign: 'left',
            cursor: dcrState.status === 'SUBMITTED' ? 'default' : 'pointer',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FileText size={22} />
            {dcrState.status === 'SUBMITTED' ? <Check size={16} /> : <Send size={16} />}
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.94rem' }}>
            {dcrState.status === 'SUBMITTED' ? 'DCR Submitted' : 'Submit Day DCR'}
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
            {completedCallsCount} visits ready for sign-off
          </div>
        </button>
      </div>

      {/* Field Performance KPI Strip */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div>
            <div className="stat-label">Monthly Sales Quota</div>
            <div className="stat-value">{currencySymbol}{(metrics.monthlyAchieved || 385400).toLocaleString('en-IN')}</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${metrics.quotaPct || 86}%`, backgroundColor: '#2563eb' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '4px', fontWeight: '700' }}>
              {metrics.quotaPct || 86}% of {currencySymbol}{(metrics.monthlyTarget || 450000).toLocaleString('en-IN')} Quota
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div>
            <div className="stat-label">Today's Beat Visits Call Target</div>
            <div className="stat-value">{completedCallsCount} / {calls.length} Done</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${(completedCallsCount / calls.length) * 100}%`, backgroundColor: '#16a34a' }} />
            </div>
            <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '4px', fontWeight: '700' }}>
              {calls.length - completedCallsCount} calls pending on today's route
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Stethoscope size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div>
            <div className="stat-label">Today's POB Orders Booked</div>
            <div className="stat-value">{currencySymbol}{(metrics.todayPobBooked || 24500).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.76rem', color: '#7c3aed', marginTop: '4px', fontWeight: '700' }}>
              Booked from Apollo Pharmacy Saket
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0891b2' }}>
          <div>
            <div className="stat-label">Sample Bag Inventory On-Hand</div>
            <div className="stat-value">{metrics.samplesOnHand || 52} Units</div>
            <div style={{ fontSize: '0.76rem', color: '#0891b2', marginTop: '4px', fontWeight: '700' }}>
              4 Formulations ready for detailing
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ecfeff', color: '#0891b2' }}>
            <Package size={24} />
          </div>
        </div>
      </div>

      {/* Two Column: Today's Beat Route & Physical Sample Bag Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Today's Beat Call Route */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Today's Beat Call Route (MTP)</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned healthcare professionals &amp; pharmacies for 28 Sep 2026</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tour-plan')}>
              View Tour Plan <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {calls.map((call) => (
              <div
                key={call.id}
                style={{
                  backgroundColor: call.status === 'COMPLETED' ? '#f8fafc' : '#ffffff',
                  border: call.status === 'COMPLETED' ? '1px solid #e2e8f0' : '1px solid #93c5fd',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: call.status === 'PENDING' ? '0 2px 6px rgba(59, 130, 246, 0.1)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      backgroundColor: call.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff',
                      color: call.status === 'COMPLETED' ? '#059669' : '#2563eb',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {call.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{call.time}</span>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#0f172a' }}>
                    {call.customerName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {call.specialty} • {call.institution}
                  </div>

                  {call.status === 'COMPLETED' && (
                    <div style={{ fontSize: '0.74rem', color: '#334155', marginTop: '6px' }}>
                      Products: <strong>{call.productsDetailed?.join(', ') || 'Detailed'}</strong>
                      {call.samplesGiven > 0 && ` • Samples Given: ${call.samplesGiven}`}
                      {call.pobValue > 0 && ` • POB: ${currencySymbol}${call.pobValue.toLocaleString('en-IN')}`}
                    </div>
                  )}
                </div>

                <div>
                  {call.status === 'PENDING' ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      onClick={() => handleOpenVisitModal(call.customerName, call.specialty)}
                    >
                      <Stethoscope size={14} /> Record Visit
                    </button>
                  ) : (
                    <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> In DCR
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Sample Bag Balance */}
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Physical Sample Bag Ledger</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Live stock ledger of physician samples allocated &amp; distributed</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('inventory')}>
              Stock History <ArrowUpRight size={14} />
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Formulation / Batch</th>
                <th>Allocated</th>
                <th>Given</th>
                <th>Balance On-Hand</th>
              </tr>
            </thead>
            <tbody>
              {sampleInventory.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.product}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Batch: {item.batch} • Exp: {item.expiry}</div>
                  </td>
                  <td style={{ color: '#64748b', fontWeight: '600' }}>{item.allocated} Units</td>
                  <td style={{ color: '#ea580c', fontWeight: '700' }}>{item.distributed} Units</td>
                  <td>
                    <span style={{
                      backgroundColor: item.remaining > 10 ? '#ecfdf5' : '#fffbeb',
                      color: item.remaining > 10 ? '#059669' : '#d97706',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: '800',
                      fontSize: '0.84rem'
                    }}>
                      {item.remaining} Units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* End-of-Day DCR Submit Status Banner */}
          <div style={{
            marginTop: '20px',
            backgroundColor: dcrState.status === 'SUBMITTED' ? '#ecfdf5' : '#eff6ff',
            border: dcrState.status === 'SUBMITTED' ? '1px solid #10b981' : '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.94rem', color: dcrState.status === 'SUBMITTED' ? '#065f46' : '#1e40af' }}>
                {dcrState.status === 'SUBMITTED' ? '✓ DCR Submitted for Today' : 'End-of-Day DCR Submission'}
              </div>
              <div style={{ fontSize: '0.78rem', color: dcrState.status === 'SUBMITTED' ? '#047857' : '#3b82f6' }}>
                {dcrState.status === 'SUBMITTED'
                  ? 'Awaiting review from Supervisor Suresh Raina'
                  : `${completedCallsCount} of ${calls.length} planned calls completed`}
              </div>
            </div>

            {dcrState.status !== 'SUBMITTED' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmitFinalDcr}
                disabled={isSubmittingDcr}
                style={{ backgroundColor: '#2563eb', padding: '8px 16px', fontSize: '0.82rem' }}
              >
                {isSubmittingDcr ? 'Submitting...' : 'Submit Final DCR'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rapid In-Clinic Visit Capture Modal */}
      {isVisitModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={22} color="#2563eb" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Record In-Clinic Call</h3>
              </div>
              <button
                onClick={() => setIsVisitModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVisit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Customer Name / Institution
                </label>
                <input
                  type="text"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Customer Specialty / Target Type
                </label>
                <input
                  type="text"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Formulations Detailed (Select all shown)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['CardioShield 50mg', 'GlucoMet Forte 500/5', 'NeuroCalm Plus', 'AllevOnco 100mg'].map((prod) => (
                    <label
                      key={prod}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: detailedProducts.includes(prod) ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={detailedProducts.includes(prod)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDetailedProducts(prev => [...prev, prod]);
                          } else {
                            setDetailedProducts(prev => prev.filter(p => p !== prod));
                          }
                        }}
                      />
                      <span>{prod}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                    Samples Given (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={samplesCount}
                    onChange={(e) => setSamplesCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                    POB Order Value ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={pobValue}
                    onChange={(e) => setPobValue(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  Doctor Remarks &amp; Prescribing Commitment
                </label>
                <textarea
                  rows="2"
                  value={doctorFeedback}
                  placeholder="Doctor confirmed starting 5 new patients on CardioShield..."
                  onChange={(e) => setDoctorFeedback(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsVisitModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmittingVisit}
                >
                  {isSubmittingVisit ? 'Saving...' : 'Save & Log In-Clinic Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
