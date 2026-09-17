import React, { useState, useEffect } from 'react';
import { Stethoscope, Store, Pill, Plus, Search, Truck, Eye, Star } from 'lucide-react';
import { getDoctors, getChemists, getProducts, getStockists, addDoctor } from '../services/api';

export default function CatalogPage() {
  const [activeSubTab, setActiveSubTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockists, setStockists] = useState([]);
  const [search, setSearch] = useState('');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  // New Doctor form
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialty: 'Cardiologist',
    qualification: 'MD, DM',
    hospital: '',
    territory: 'South Delhi',
    class: 'A+',
    potential: 'Very High (150+ Rx/mo)',
    monthlyTargetVisits: 3,
    visitingDays: ['Mon', 'Wed', 'Fri'],
    timing: '10:00 AM - 01:00 PM',
    phone: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [docRes, chmRes, prdRes, stkRes] = await Promise.all([
        getDoctors(),
        getChemists(),
        getProducts(),
        getStockists()
      ]);
      setDoctors(docRes.data || []);
      setChemists(chmRes.data || []);
      setProducts(prdRes.data || []);
      setStockists(stkRes.data || []);
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
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.composition.toLowerCase().includes(search.toLowerCase())
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
            <button
              className={`tab-btn ${activeSubTab === 'stockists' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('stockists')}
            >
              <Truck size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Stockist Network ({stockists.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ width: '240px', paddingLeft: '34px' }}
                placeholder="Search master registries..."
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
                <th>Class & Potential</th>
                <th>Monthly Target Visits</th>
                <th>Prescribing Focus</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>ID: {doc.id} • {doc.territory}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{doc.specialty}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.qualification}</div>
                  </td>
                  <td>{doc.hospital}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      backgroundColor: doc.class === 'A+' ? '#fef3c7' : '#eff6ff',
                      color: doc.class === 'A+' ? '#b45309' : '#2563eb',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Star size={12} /> Class {doc.class} ({doc.potential})
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>
                      {doc.completedVisitsThisMonth || 0} / {doc.monthlyTargetVisits} Visits Done
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.timing}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(doc.keyPrescribingProducts || []).map((p, i) => (
                        <span key={i} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {p}
                        </span>
                      ))}
                    </div>
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
                <th>Key Contact</th>
                <th>Territory & Address</th>
                <th>Assigned Stockist</th>
                <th>Credit Limit & Due</th>
                <th>Attached Key Doctors</th>
              </tr>
            </thead>
            <tbody>
              {filteredChemists.map((chm) => (
                <tr key={chm.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{chm.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>ID: {chm.id}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{chm.contactPerson}</td>
                  <td>
                    <div>{chm.territory}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{chm.address}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#2563eb' }}>{chm.preferredStockist}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>₹{chm.creditLimit?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>Due: ₹{chm.outstandingDue?.toLocaleString('en-IN')}</div>
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
                <th>Therapeutic Category</th>
                <th>MRP (₹)</th>
                <th>PTR (Retailer)</th>
                <th>PTS (Stockist)</th>
                <th>Sample Stock</th>
                <th>Visual Detailing</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6366f1' }}>{p.packing} • GST: {p.gstPercent || 12}%</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{p.composition}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.indication}</div>
                  </td>
                  <td>
                    <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{p.mrp?.toFixed(2)}</td>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>₹{p.ptr?.toFixed(2)}</td>
                  <td style={{ fontWeight: '700', color: '#059669' }}>₹{p.pts?.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: '800', color: p.sampleStock < 20 ? '#e11d48' : '#0f172a' }}>
                      {p.sampleStock} Units
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPreviewProduct(p)}
                    >
                      <Eye size={13} /> Visual Aid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Stockist Network Table */}
        {activeSubTab === 'stockists' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Stockist Name</th>
                <th>Contact Person & Phone</th>
                <th>Territory Coverage</th>
                <th>Credit Policy</th>
                <th>Credit Limit</th>
                <th>Active Orders</th>
              </tr>
            </thead>
            <tbody>
              {stockists.map((stk) => (
                <tr key={stk.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{stk.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stk.address}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{stk.contactPerson}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>{stk.phone}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{stk.territoryCoverage}</td>
                  <td>
                    <span style={{ background: '#f8fafc', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700' }}>
                      {stk.creditTerms}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700' }}>₹{stk.creditLimit?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="status-badge badge-pending">
                      {stk.activeOrdersCount} Pending Deliveries
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Visual Aid Preview Modal */}
      {previewProduct && (
        <div className="modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Digital Visual Aid: {previewProduct.name}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setPreviewProduct(null)}>Close</button>
            </div>
            <img
              src={previewProduct.visualAidUrl}
              alt={previewProduct.name}
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }}
            />
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>Composition: {previewProduct.composition}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}><strong>Indications:</strong> {previewProduct.indication}</div>
              <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '6px', fontWeight: '600' }}>
                Key Detailing Points: Superior bioavailability, once-daily dosage, patient compliance profile.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showDoctorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Add Master Doctor Profile</h3>
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
                  placeholder="e.g. Max Hospital, Saket"
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
                    <option value="A+">Class A+ (Very High Rx / 150+ Rx)</option>
                    <option value="A">Class A (High Rx / 100+ Rx)</option>
                    <option value="B">Class B (Medium Rx / 50+ Rx)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monthly Target Visits</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newDoc.monthlyTargetVisits}
                    onChange={(e) => setNewDoc({ ...newDoc, monthlyTargetVisits: Number(e.target.value) })}
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
