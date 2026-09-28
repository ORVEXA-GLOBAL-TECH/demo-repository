import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Globe2, MapPin, Plus, Search, ChevronRight,
  ShieldCheck, Users, TrendingUp, CheckCircle2, Filter, X
} from 'lucide-react';
import { getOrganizationHierarchy, addTerritory } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function OrganizationPage({ initialSubTab = 'hierarchy' }) {
  const { activeTenant } = useTenantTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  const [orgData, setOrgData] = useState({
    zones: [],
    regions: [],
    areas: [],
    territories: [],
    headquarters: []
  });
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTerritory, setNewTerritory] = useState({
    code: '',
    name: '',
    hqName: 'South Delhi HQ',
    mrAssigned: 'Amit Verma',
    monthlyTarget: '₹ 15.0 Lakh'
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadOrgData();
  }, []);

  const loadOrgData = async () => {
    try {
      const res = await getOrganizationHierarchy();
      if (res) {
        setOrgData({
          zones: res.zones || [],
          regions: res.regions || [],
          areas: res.areas || [],
          territories: res.territories || [],
          headquarters: res.headquarters || []
        });
      }
    } catch (e) {
      console.warn('Org data load error:', e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `TER-${Date.now()}`,
      ...newTerritory,
      doctorsCount: 40,
      chemistsCount: 20,
      status: 'Active'
    };
    try {
      await addTerritory(created);
    } catch (err) {
      console.warn('Local territory add:', err);
    }
    setOrgData(prev => ({
      ...prev,
      territories: [created, ...prev.territories]
    }));
    setShowAddModal(false);
    setNewTerritory({
      code: '',
      name: '',
      hqName: 'South Delhi HQ',
      mrAssigned: 'Amit Verma',
      monthlyTarget: '₹ 15.0 Lakh'
    });
  };

  const filteredTerritories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return orgData.territories;
    return orgData.territories.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.mrAssigned.toLowerCase().includes(q) ||
      t.hqName.toLowerCase().includes(q)
    );
  }, [orgData.territories, search]);

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
              <Building2 size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Corporate Territory &amp; Field Hierarchy Master
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Organizational Tree &amp; Geofence Demarcation
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              4 Strategic Zones • 8 Regional Sales Divisions • 16 District Areas • 32 Field Rep Territories
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Add Territory</span>
          </button>
        </div>
      </div>

      {/* Main Content Card with Segmented Toggle Bar */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'hierarchy' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('hierarchy')}
            >
              <Building2 size={16} />
              <span>Full Hierarchy Tree</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'zones' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('zones')}
            >
              <Globe2 size={16} />
              <span>Zones</span>
              <span className="tab-badge">{orgData.zones.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'regions' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('regions')}
            >
              <Globe2 size={16} />
              <span>Regions</span>
              <span className="tab-badge">{orgData.regions.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'areas' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('areas')}
            >
              <MapPin size={16} />
              <span>Areas</span>
              <span className="tab-badge">{orgData.areas.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'territories' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('territories')}
            >
              <MapPin size={16} />
              <span>Territories</span>
              <span className="tab-badge">{orgData.territories.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeSubTab === 'headquarters' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('headquarters')}
            >
              <Building2 size={16} />
              <span>Headquarters</span>
              <span className="tab-badge">{orgData.headquarters.length}</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Filter hierarchy nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 1. Full Hierarchy Tree View */}
        {activeSubTab === 'hierarchy' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {orgData.zones.map((zone) => (
              <div key={zone.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.94rem' }}>{zone.name}</div>
                  <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                    {zone.code}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '8px' }}>
                  <strong>Zone Head:</strong> {zone.head}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span>Territories: <strong>{zone.territoriesCount}</strong></span>
                  <span>Active Reps: <strong>{zone.repsCount}</strong></span>
                  <span>Target: <strong>{zone.quarterlyTarget}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Zones View */}
        {activeSubTab === 'zones' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Zone Name &amp; Code</th>
                  <th style={{ padding: '12px 14px' }}>Regional Head</th>
                  <th style={{ padding: '12px 14px' }}>Territories Count</th>
                  <th style={{ padding: '12px 14px' }}>Active Reps</th>
                  <th style={{ padding: '12px 14px' }}>Quarterly Target</th>
                  <th style={{ padding: '12px 14px' }}>Achievement</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orgData.zones.map((z) => (
                  <tr key={z.id}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {z.name} <span style={{ color: '#2563eb', fontSize: '0.74rem' }}>({z.code})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{z.head}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{z.territoriesCount} Territories</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{z.repsCount} Field MRs</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{z.quarterlyTarget}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '800' }}>
                        {z.achievementPct}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>● {z.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Territories View */}
        {activeSubTab === 'territories' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Territory Code &amp; Name</th>
                  <th style={{ padding: '12px 14px' }}>Assigned HQ</th>
                  <th style={{ padding: '12px 14px' }}>Assigned MR (Field Rep)</th>
                  <th style={{ padding: '12px 14px' }}>Doctors Covered</th>
                  <th style={{ padding: '12px 14px' }}>Chemists Network</th>
                  <th style={{ padding: '12px 14px' }}>Monthly Quota</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerritories.map((t) => (
                  <tr key={t.id}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{t.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>{t.code}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{t.hqName}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1e293b' }}>👨‍💼 {t.mrAssigned}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{t.doctorsCount} HCPs</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{t.chemistsCount} Retailers</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{t.monthlyTarget}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>● {t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Regions View */}
        {activeSubTab === 'regions' && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Region ID &amp; Name</th>
                  <th style={{ padding: '12px 14px' }}>Parent Zone</th>
                  <th style={{ padding: '12px 14px' }}>Regional Manager</th>
                  <th style={{ padding: '12px 14px' }}>Territories Count</th>
                  <th style={{ padding: '12px 14px' }}>Active Reps</th>
                  <th style={{ padding: '12px 14px' }}>Monthly Target</th>
                </tr>
              </thead>
              <tbody>
                {orgData.regions.map((r) => (
                  <tr key={r.id}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {r.name} <span style={{ color: '#2563eb', fontSize: '0.72rem' }}>({r.id})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{r.zoneName}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600' }}>{r.manager}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{r.territoryCount} Territories</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{r.activeReps} MRs</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{r.monthlyTarget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Areas & Headquarters Views */}
        {(activeSubTab === 'areas' || activeSubTab === 'headquarters') && (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="custom-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 14px' }}>Name / Location</th>
                  <th style={{ padding: '12px 14px' }}>Supervisor / Lead Stockist</th>
                  <th style={{ padding: '12px 14px' }}>Associated Field Staff</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(activeSubTab === 'areas' ? orgData.areas : orgData.headquarters).map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                      {item.name} <span style={{ color: '#2563eb', fontSize: '0.72rem' }}>({item.id})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{item.supervisor || item.leadStockist}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {item.mrCount ? `${item.mrCount} MRs Assigned` : `${item.activeMRs} Active MRs`}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>● {item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add Territory Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>+ Register New Field Territory</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Territory Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  placeholder="e.g. South Extension &amp; Lajpat Nagar"
                  value={newTerritory.name}
                  onChange={e => setNewTerritory({ ...newTerritory, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Territory Code *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    placeholder="e.g. DEL-SEXT"
                    value={newTerritory.code}
                    onChange={e => setNewTerritory({ ...newTerritory, code: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned HQ</label>
                  <select
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTerritory.hqName}
                    onChange={e => setNewTerritory({ ...newTerritory, hqName: e.target.value })}
                  >
                    <option value="South Delhi HQ">South Delhi HQ</option>
                    <option value="Central Delhi HQ">Central Delhi HQ</option>
                    <option value="Noida Regional HQ">Noida Regional HQ</option>
                    <option value="Gurugram Commercial HQ">Gurugram Commercial HQ</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned MR</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTerritory.mrAssigned}
                    onChange={e => setNewTerritory({ ...newTerritory, mrAssigned: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Monthly Quota</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newTerritory.monthlyTarget}
                    onChange={e => setNewTerritory({ ...newTerritory, monthlyTarget: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Save Territory</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
