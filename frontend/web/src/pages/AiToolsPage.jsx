import React, { useState } from 'react';
import { Route, Sparkles, Camera, MapPin, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { optimizeRoute, scanPrescriptionOcr } from '../services/api';

export default function AiToolsPage() {
  const [activeTab, setActiveTab] = useState('route');

  // Route Optimizer state
  const [routeResult, setRouteResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // OCR state
  const [ocrSample, setOcrSample] = useState('cardio');
  const [ocrResult, setOcrResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await optimizeRoute([]);
      setRouteResult(res.data);
    } catch (e) {
      alert('Route optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunOcr = async () => {
    setIsScanning(true);
    try {
      const res = await scanPrescriptionOcr(ocrSample);
      setOcrResult(res.data);
    } catch (e) {
      alert('Prescription OCR scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="card-section" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#fbbf24" />
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.06em' }}>
                AI & Decision Intelligence Microservices
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>
              Field Operations AI Studio
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#e0e7ff', marginTop: '4px' }}>
              Beat route TSP optimization, Fuel burn reduction & Prescription OCR audit
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'route' ? 'active' : ''}`}
          onClick={() => setActiveTab('route')}
        >
          <Route size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Smart Beat Route Optimizer
        </button>
        <button
          className={`tab-btn ${activeTab === 'ocr' ? 'active' : ''}`}
          onClick={() => setActiveTab('ocr')}
        >
          <Camera size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Prescription OCR & Audit Engine
        </button>
      </div>

      {/* Route Optimizer Section */}
      {activeTab === 'route' && (
        <div>
          <div className="card-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Traveling Field Representative (TSP) Route Optimizer</h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Calculates optimal visiting sequence prioritizing high-potential Class A+ specialists and minimizing transit fuel
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleRunOptimizer} disabled={isOptimizing}>
                <Zap size={16} /> {isOptimizing ? 'Computing Shortest Path...' : 'Optimize Beat Route'}
              </button>
            </div>

            {routeResult && (
              <div>
                {/* Metrics Badges */}
                <div className="stats-grid" style={{ marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div>
                      <div className="stat-label">Optimized Total Distance</div>
                      <div className="stat-value" style={{ color: '#2563eb' }}>{routeResult.metrics.optimizedDistanceKm} KM</div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: '700' }}>
                        ↓ {routeResult.metrics.distanceSavedKm} KM Saved vs Unoptimized
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div>
                      <div className="stat-label">Field Transit Efficiency</div>
                      <div className="stat-value" style={{ color: '#16a34a' }}>{routeResult.metrics.efficiencyGainPct}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Faster doctor call turnaround
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div>
                      <div className="stat-label">Estimated Daily Fuel Savings</div>
                      <div className="stat-value" style={{ color: '#7c3aed' }}>₹{routeResult.metrics.estimatedFuelSavedRupees}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Direct TA claim reduction
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimal Step-by-Step Waypoints */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>Recommended Itinerary Sequence</h3>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Seq #</th>
                      <th>Doctor / Clinic Contact</th>
                      <th>Specialty & Hospital</th>
                      <th>Recommended Time Slot</th>
                      <th>Priority Logic</th>
                      <th>Est. Drive Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeResult.optimizedWaypoints.map((wp) => (
                      <tr key={wp.stepNumber}>
                        <td>
                          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
                            {wp.stepNumber}
                          </span>
                        </td>
                        <td style={{ fontWeight: '700' }}>{wp.doctor}</td>
                        <td>
                          <div>{wp.hospital}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{wp.specialty}</div>
                        </td>
                        <td style={{ fontWeight: '700', color: '#059669' }}>{wp.recommendedTimeSlot}</td>
                        <td>
                          <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                            {wp.priorityReason}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>~{wp.estimatedDriveTimeMin} mins</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prescription OCR Section */}
      {activeTab === 'ocr' && (
        <div className="card-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Digital Prescription Audit & Molecule Matching</h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Computer vision & text parsing extracts prescribed molecules and matches them to Alleviare portfolio
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                className="form-control"
                style={{ width: '220px' }}
                value={ocrSample}
                onChange={(e) => setOcrSample(e.target.value)}
              >
                <option value="cardio">Cardiology Rx (Max Saket)</option>
                <option value="diab">Diabetology Rx (Fortis Okhla)</option>
              </select>
              <button className="btn btn-primary" onClick={handleRunOcr} disabled={isScanning}>
                <Camera size={16} /> {isScanning ? 'Scanning OCR Slip...' : 'Analyze Prescription'}
              </button>
            </div>
          </div>

          {ocrResult && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>DETECTED PRESCRIBER</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{ocrResult.detectedDoctor}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '2px', fontWeight: '700' }}>OCR Confidence: {ocrResult.complianceScore}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>PATIENT & DATE</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{ocrResult.patientInitials}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Dated: {ocrResult.detectedDate}</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>Extracted Active Pharmaceutical Ingredients (APIs)</h3>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Detected Molecule API</th>
                    <th>Strength & Dosage</th>
                    <th>Match Status</th>
                    <th>Matched Product Brand</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {ocrResult.extractedMolecules.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '700' }}>{m.molecule}</td>
                      <td>{m.strength} ({m.frequency})</td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          backgroundColor: m.matchStatus === 'MATCHED_CATALOG' ? '#dcfce7' : '#fef3c7',
                          color: m.matchStatus === 'MATCHED_CATALOG' ? '#15803d' : '#b45309'
                        }}>
                          {m.matchStatus === 'MATCHED_CATALOG' ? '✓ Catalog Brand Match' : 'Competitor Molecule'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: '#2563eb' }}>{m.matchedBrand}</td>
                      <td style={{ fontWeight: '700', color: '#059669' }}>{m.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', marginTop: '16px', border: '1px solid #bfdbfe' }}>
                <strong style={{ color: '#1e40af' }}>AI Strategic Recommendation:</strong>
                <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: '4px' }}>{ocrResult.suggestedAction}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
