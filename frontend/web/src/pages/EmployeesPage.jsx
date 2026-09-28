import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, ShieldCheck, Mail, Phone, MapPin, Building,
  Plus, Search, Filter, X, CheckCircle2, ChevronRight, Briefcase
} from 'lucide-react';
import { getEmployees, addEmployee } from '../services/api';
import { useTenantTheme } from '../context/TenantThemeContext';

export default function EmployeesPage({ initialFilter = 'ALL' }) {
  const { activeTenant } = useTenantTheme();
  const [employees, setEmployees] = useState([]);
  const [filterRole, setFilterRole] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newEmp, setNewEmp] = useState({
    code: '',
    name: '',
    email: '',
    role: 'MR',
    designation: 'Medical Representative (Field Officer)',
    department: 'Field Sales Force',
    territory: 'South Delhi & Noida',
    phone: '+91 98110 ' + Math.floor(10000 + Math.random() * 90000)
  });

  const brandColor = activeTenant?.brand_primary_color || '#2563eb';

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await getEmployees();
      if (res && res.data) {
        setEmployees(res.data);
      }
    } catch (e) {
      console.warn('Employees load error:', e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const created = {
      id: `EMP-${Date.now()}`,
      ...newEmp,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    try {
      await addEmployee(created);
    } catch (err) {
      console.warn('Local employee add:', err);
    }
    setEmployees(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewEmp({
      code: '',
      name: '',
      email: '',
      role: 'MR',
      designation: 'Medical Representative (Field Officer)',
      department: 'Field Sales Force',
      territory: 'South Delhi & Noida',
      phone: '+91 98110 ' + Math.floor(10000 + Math.random() * 90000)
    });
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchRole = filterRole === 'ALL' || emp.role === filterRole;
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.code.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.territory.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [employees, filterRole, search]);

  const counts = useMemo(() => {
    return {
      all: employees.length,
      managers: employees.filter(e => e.role === 'MANAGER' || e.role === 'SALES_MANAGER').length,
      supervisors: employees.filter(e => e.role === 'MR_SUPERVISOR').length,
      mrs: employees.filter(e => e.role === 'MR').length
    };
  }, [employees]);

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
              <Users size={20} color="#93c5fd" />
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Corporate Field Force &amp; Enterprise Staff Directory
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '4px' }}>
              Personnel Management &amp; Role Assignments
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '4px' }}>
              Field Medical Reps • Area Supervisors • Sales Managers • Commercial Directors
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
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card-section" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        
        {/* Toggle Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div className="tabs-bar">
            <button
              type="button"
              className={`tab-btn ${filterRole === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterRole('ALL')}
            >
              <Users size={16} />
              <span>All Staff</span>
              <span className="tab-badge">{counts.all}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterRole === 'MANAGER' ? 'active' : ''}`}
              onClick={() => setFilterRole('MANAGER')}
            >
              <Briefcase size={16} />
              <span>Commercial Managers</span>
              <span className="tab-badge">{counts.managers}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterRole === 'MR_SUPERVISOR' ? 'active' : ''}`}
              onClick={() => setFilterRole('MR_SUPERVISOR')}
            >
              <ShieldCheck size={16} />
              <span>MR Supervisors</span>
              <span className="tab-badge">{counts.supervisors}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${filterRole === 'MR' ? 'active' : ''}`}
              onClick={() => setFilterRole('MR')}
            >
              <Users size={16} />
              <span>Field MRs</span>
              <span className="tab-badge">{counts.mrs}</span>
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
              placeholder="Search by name, role, territory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Employee Records Table */}
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table className="custom-table" style={{ margin: 0, width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 14px' }}>Employee Code &amp; Name</th>
                <th style={{ padding: '12px 14px' }}>System Role &amp; Title</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Assigned Territory</th>
                <th style={{ padding: '12px 14px' }}>Official Contact</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>{emp.code}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.82rem' }}>{emp.designation}</div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: emp.role === 'ADMIN' ? '#fef3c7' : (emp.role === 'MR' ? '#eff6ff' : '#f1f5f9'),
                        color: emp.role === 'ADMIN' ? '#b45309' : (emp.role === 'MR' ? '#2563eb' : '#475569')
                      }}
                    >
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.8rem' }}>{emp.department}</td>
                  <td style={{ padding: '12px 14px', color: '#334155', fontSize: '0.8rem' }}>📍 {emp.territory}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#475569' }}>
                    <div>✉️ {emp.email}</div>
                    <div>📞 {emp.phone}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>● {emp.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedEmployee(emp)}
                      style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      View 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>+ Onboard New Staff / Field Officer</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newEmp.name}
                    onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Employee Code *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    placeholder="e.g. ALV-E109"
                    value={newEmp.code}
                    onChange={e => setNewEmp({ ...newEmp, code: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>System Role *</label>
                  <select
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newEmp.role}
                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                  >
                    <option value="MR">MR (Field Representative)</option>
                    <option value="MR_SUPERVISOR">MR Supervisor</option>
                    <option value="MANAGER">Operations Manager</option>
                    <option value="SALES_MANAGER">Regional Sales Manager</option>
                    <option value="ACCOUNTANT">Financial Accountant</option>
                    <option value="ADMIN">Corporate Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Official Email *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newEmp.email}
                    onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Territory Assignment</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newEmp.territory}
                    onChange={e => setNewEmp({ ...newEmp, territory: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    value={newEmp.phone}
                    onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff' }}>Save &amp; Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View 360° Profile Drawer/Modal */}
      {selectedEmployee && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{selectedEmployee.name}</h3>
              </div>
              <button type="button" onClick={() => setSelectedEmployee(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>{selectedEmployee.designation}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Code: {selectedEmployee.code} • Joined: {selectedEmployee.joinDate}</div>
              <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '4px' }}>Territory: {selectedEmployee.territory}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#475569', marginBottom: '16px' }}>
              <div><strong>Email:</strong> {selectedEmployee.email}</div>
              <div><strong>Phone:</strong> {selectedEmployee.phone}</div>
              <div><strong>Department:</strong> {selectedEmployee.department}</div>
              <div><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: '700' }}>Active</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedEmployee(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
