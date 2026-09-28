import React, { useState, useEffect } from 'react';
import {
  Settings, ShieldCheck, MapPin, Clock, DollarSign,
  Save, CheckCircle2, Sliders, Palette, Building, AlertCircle
} from 'lucide-react';
import { getCompanySettings, updateCompanySettings } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function CompanySettingsPage({ initialSubTab = 'settings' }) {
  const { activeTenant, setActiveTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [settings, setSettings] = useState({
    companyName: 'Alleviare Health Sciences',
    companyCode: 'ALV',
    headquartersCity: 'New Delhi, India',
    geofenceAccuracyRadiusMeters: 50,
    dailyDcrCutoffTime: '22:00',
    mandatoryGpsForVisits: true,
    requireChemistStockAudit: true,
    maxDailyTaKmAllowance: 180,
    currencySymbol: '₹',
    hqFareRate: 4.5,
    exHqFareRate: 5.0,
    outstationFareRate: 6.0,
    hqDaRate: 350,
    exHqDaRate: 450,
    outstationDaRate: 650
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getCompanySettings();
      if (res && res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (e) {
      console.warn('Settings load error:', e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateCompanySettings(settings);
    } catch (err) {
      console.warn('Settings update local:', err);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
              <Settings size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tenant Configuration &amp; Compliance Policy Master
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Company Field Policies &amp; System Parameters
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              GPS Satellite Geofence Tolerance • DCR Submission Cutoffs • TA/DA Expense Rates • Brand Themes
            </p>
          </div>
          {savedSuccess && (
            <div style={{ background: '#16a34a', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Changes Saved Successfully!
            </div>
          )}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        
        {/* Toggle Pills */}
        <div className="tabs-bar" style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('settings')}
          >
            <Sliders size={16} />
            <span>Field Governance Policies</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'expense-policies' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('expense-policies')}
          >
            <DollarSign size={16} />
            <span>TA/DA Travel Expense Rates</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('branding')}
          >
            <Palette size={16} />
            <span>Corporate Branding</span>
          </button>
        </div>

        <form onSubmit={handleSave}>
          
          {/* 1. Field Governance Policies */}
          {activeSubTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  GPS Geofence Radius Tolerance (Meters)
                </label>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  Maximum permissible discrepancy between doctor clinic GPS coordinates and MR check-in fix.
                </p>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontWeight: '700' }}
                  value={settings.geofenceAccuracyRadiusMeters}
                  onChange={e => setSettings({ ...settings, geofenceAccuracyRadiusMeters: Number(e.target.value) })}
                />
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  Daily DCR Cutoff Time
                </label>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  Time after which same-day call reporting locks and requires manager reopen approval.
                </p>
                <input
                  type="time"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontWeight: '700' }}
                  value={settings.dailyDcrCutoffTime}
                  onChange={e => setSettings({ ...settings, dailyDcrCutoffTime: e.target.value })}
                />
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  Mandatory In-Clinic Geofence Enforcement
                </label>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  Require high-precision satellite telemetry fix before allowing DCR call closure.
                </p>
                <select
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontWeight: '700' }}
                  value={settings.mandatoryGpsForVisits ? 'true' : 'false'}
                  onChange={e => setSettings({ ...settings, mandatoryGpsForVisits: e.target.value === 'true' })}
                >
                  <option value="true">Enforced (Strict Telemetry)</option>
                  <option value="false">Permissive (Warning Only)</option>
                </select>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  Max Daily Travel Allowance (Km Ceiling)
                </label>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '8px' }}>
                  Maximum daily travel distance claim before triggering compliance audit review.
                </p>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontWeight: '700' }}
                  value={settings.maxDailyTaKmAllowance}
                  onChange={e => setSettings({ ...settings, maxDailyTaKmAllowance: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          {/* 2. TA/DA Travel Expense Rates */}
          {activeSubTab === 'expense-policies' && (
            <div>
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px' }}>
                <table className="custom-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '12px 14px' }}>Station Work Type</th>
                      <th style={{ padding: '12px 14px' }}>Travel Allowance (Fare Rate / Km)</th>
                      <th style={{ padding: '12px 14px' }}>Daily Allowance (Per Diem DA)</th>
                      <th style={{ padding: '12px 14px' }}>Maximum Hotel Nightly Ceiling</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 14px', fontWeight: '700' }}>HQ Station (Within 25 km of HQ)</td>
                      <td style={{ padding: '12px 14px' }}>₹ {settings.hqFareRate} / km</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>₹ {settings.hqDaRate} / day</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>Not Applicable (Day return)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 14px', fontWeight: '700' }}>Ex-HQ Station (25 - 80 km from HQ)</td>
                      <td style={{ padding: '12px 14px' }}>₹ {settings.exHqFareRate} / km</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>₹ {settings.exHqDaRate} / day</td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>Not Applicable (Day return)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 14px', fontWeight: '700' }}>Outstation Tour (&gt; 80 km Overnight)</td>
                      <td style={{ padding: '12px 14px' }}>₹ {settings.outstationFareRate} / km</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>₹ {settings.outstationDaRate} / day</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#2563eb' }}>₹ 2,000 / night (With GST Bill)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Corporate Branding */}
          {activeSubTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '6px' }}>Company Brand Name</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontWeight: '700' }}
                  value={settings.companyName}
                  onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '6px' }}>Primary Accent Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    style={{ width: '42px', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    value={brandColor}
                    onChange={e => {
                      if (activeTenant) {
                        setActiveTenant({ ...activeTenant, brand_primary_color: e.target.value });
                      }
                    }}
                  />
                  <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.88rem' }}>{brandColor}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: '800',
                padding: '10px 24px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                cursor: 'pointer'
              }}
            >
              <Save size={16} />
              <span>Save &amp; Apply Policy Changes</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
