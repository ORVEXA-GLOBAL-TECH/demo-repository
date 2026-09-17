import React, { useState, useEffect } from 'react';
import { Stethoscope, Store, Pill, Plus, Search } from 'lucide-react';
import { getDoctors, getChemists, getProducts, addDoctor } from '../services/api';

export default function CatalogPage() {
  const [activeSubTab, setActiveSubTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  // New Doctor form
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: 'Cardiologist',
    qualification: 'MD',
    hospital: '',
    territory: 'South Delhi',
    class: 'A',
    potential: 'High',
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 01:00 PM',
    phone: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [docRes, chmRes, prdRes] = await Promise.all([
        getDoctors(),
        getChemists(),
        getProducts()
      ]);
      setDoctors(docRes.data || []);
      setChemists(chmRes.data || []);
      setProducts(prdRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await addDoctor(newDoc);
      setShowDoctorModal(false);
      loadAllData();
    } catch (e) {
      alert('Failed to add doctor');
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.hospital.toLowerCase().includes(search.toLowerCase())
  );

  const filteredChemists = chemists.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.territory.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="card-section">
        {/* Sub-tabs and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="tabs-bar" style={{ marginBottom: 0 }}>
            <button
              className={`tab-btn ${activeSubTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('doctors')}
            >
              <Stethoscope size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Doctors Directory ({doctors.length})
            </button>
            <button
              className={`tab-btn ${activeSubTab === 'chemists' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('chemists')}
            >
              <Store size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Chemists & Retailers ({chemists.length})
            </button>
            <button
              className={`tab-btn ${activeSubTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('products')}
            >
              <Pill size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Product Catalog ({products.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ width: '240px', paddingLeft: '32px' }}
                placeholder="Search master data..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            </div>

            {activeSubTab === 'doctors' && (
              <button className="btn btn-primary" onClick={() => setShowDoctorModal(true)}>
                <Plus size={16} /> Add Doctor
              </button>
            )}
          </div>
        </div>

        {/* Doctors Table */}
        {activeSubTab === 'doctors' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty & Degree</th>
                <th>Hospital / Clinic Affiliation</th>
                <th>Territory</th>
                <th>Class & Potential</th>
                <th>Visiting Timing</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>ID: {doc.id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{doc.specialty}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.qualification}</div>
                  </td>
                  <td>{doc.hospital}</td>
                  <td>{doc.territory}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: doc.class === 'A+' ? '#fef3c7' : '#eff6ff',
                      color: doc.class === 'A+' ? '#b45309' : '#2563eb'
                    }}>
                      Class {doc.class} ({doc.potential})
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{doc.timing}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.visitingDays?.join(', ')}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{doc.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Chemists Table */}
        {activeSubTab === 'chemists' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Pharmacy / Chemist Name</th>
                <th>Key Contact Person</th>
                <th>Territory & Address</th>
                <th>Preferred Stockist</th>
                <th>Attached Key Doctors</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredChemists.map((chm) => (
                <tr key={chm.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{chm.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>ID: {chm.id}</div>
                  </td>
                  <td style={{ fontWeight: '500' }}>{chm.contactPerson}</td>
                  <td>
                    <div>{chm.territory}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{chm.address}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#2563eb' }}>{chm.preferredStockist}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(chm.attachedDoctors || []).map((doc, idx) => (
                        <span key={idx} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{chm.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Products Table */}
        {activeSubTab === 'products' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Composition & Indication</th>
                <th>Category</th>
                <th>Packaging</th>
                <th>MRP (₹)</th>
                <th>PTR (Retailer)</th>
                <th>PTS (Stockist)</th>
                <th>Sample Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6366f1' }}>ID: {p.id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{p.composition}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.indication}</div>
                  </td>
                  <td>
                    <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{p.packing}</td>
                  <td style={{ fontWeight: '700' }}>₹{p.mrp?.toFixed(2)}</td>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>₹{p.ptr?.toFixed(2)}</td>
                  <td style={{ fontWeight: '700', color: '#059669' }}>₹{p.pts?.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: p.sampleStock < 20 ? '#e11d48' : '#0f172a' }}>
                      {p.sampleStock} Units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showDoctorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Add Master Doctor Profile</h3>
            <form onSubmit={handleAddDoctor}>
              <div className="form-group">
                <label>Doctor Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Specialty</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newDoc.qualification}
                    onChange={(e) => setNewDoc({ ...newDoc, qualification: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hospital / Clinic Name & Location</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Apollo Hospital, Saket"
                  value={newDoc.hospital}
                  onChange={(e) => setNewDoc({ ...newDoc, hospital: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Doctor Class</label>
                  <select
                    className="form-control"
                    value={newDoc.class}
                    onChange={(e) => setNewDoc({ ...newDoc, class: e.target.value })}
                  >
                    <option value="A+">Class A+ (Very High Rx)</option>
                    <option value="A">Class A (High Rx)</option>
                    <option value="B">Class B (Medium Rx)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 98..."
                    value={newDoc.phone}
                    onChange={(e) => setNewDoc({ ...newDoc, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDoctorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
