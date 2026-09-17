import React, { useState, useEffect } from 'react';
import { Plus, Check, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { getOrders, createOrder, updateOrderStatus, getChemists, getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { role, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedChemist, setSelectedChemist] = useState('');
  const [selectedStockist, setSelectedStockist] = useState('MedLife Distributors Ltd.');
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadOrders();
    loadCatalogData();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCatalogData = async () => {
    try {
      const [chmRes, prdRes] = await Promise.all([getChemists(), getProducts()]);
      setChemists(chmRes.data || []);
      setProducts(prdRes.data || []);
      if (chmRes.data?.length > 0) {
        setSelectedChemist(chmRes.data[0].name);
        setSelectedStockist(chmRes.data[0].preferredStockist || 'Standard Stockist');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (product) => {
    const existing = orderItems.find(i => i.productId === product.id);
    if (existing) {
      setOrderItems(orderItems.map(i => i.productId === product.id ? { ...i, qty: i.qty + 10 } : i));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        productName: product.name,
        qty: 10,
        ptr: product.ptr
      }]);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add at least one product item to the order');
      return;
    }
    try {
      await createOrder({
        chemistName: selectedChemist,
        stockistName: selectedStockist,
        mrName: currentUser.name,
        mrId: currentUser.id,
        items: orderItems,
        discountPercent: Number(discount),
        remarks
      });
      setShowModal(false);
      setOrderItems([]);
      loadOrders();
    } catch (e) {
      alert('Failed to place order');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (e) {
      alert('Error updating order');
    }
  };

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Personal Order Bookings (POB) & Distribution</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Direct chemist sales generation routed to regional stockists with credit tracking
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Book New POB Order</span>
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Chemist / Retailer</th>
              <th>Assigned Stockist</th>
              <th>Order Items & Quantities</th>
              <th>Total & Net Value</th>
              <th>Status</th>
              <th>Management Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>{ord.orderNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {ord.orderDate}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>{ord.chemistName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.territory}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#475569' }}>{ord.stockistName}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {(ord.items || []).map((item, idx) => (
                      <span key={idx} style={{ fontSize: '0.8rem', color: '#334155' }}>
                        • <strong>{item.qty}x</strong> {item.productName} (@ ₹{item.ptr})
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>
                    ₹{ord.netAmount?.toLocaleString('en-IN')}
                  </div>
                  {ord.discountPercent > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#059669' }}>
                      Incl. {ord.discountPercent}% Trade Discount
                    </div>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${
                    ord.status === 'APPROVED' ? 'badge-approved' : ord.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
                  }`}>
                    {ord.status}
                  </span>
                </td>
                <td>
                  {(role === 'ADMIN' || role === 'MANAGER') && ord.status === 'PENDING_APPROVAL' ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(ord.id, 'APPROVED')}
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusUpdate(ord.id, 'REJECTED')}
                      >
                        <X size={14} />
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

      {/* Book Order Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Book New Chemist POB Order</h3>
            <form onSubmit={handleCreateOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Select Chemist</label>
                  <select
                    className="form-control"
                    value={selectedChemist}
                    onChange={(e) => {
                      const c = chemists.find(x => x.name === e.target.value);
                      setSelectedChemist(e.target.value);
                      if (c?.preferredStockist) setSelectedStockist(c.preferredStockist);
                    }}
                  >
                    {chemists.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Stockist</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedStockist}
                    onChange={(e) => setSelectedStockist(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Add Products to Basket</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {products.map(p => (
                    <button
                      type="button"
                      key={p.id}
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddItem(p)}
                    >
                      + {p.name} (₹{p.ptr})
                    </button>
                  ))}
                </div>
              </div>

              {orderItems.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px' }}>Order Line Items:</div>
                  {orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>{item.productName}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: '80px', padding: '4px 8px' }}
                          value={item.qty}
                          min="1"
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setOrderItems(orderItems.map((it, i) => i === idx ? { ...it, qty: val } : it));
                          }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>₹{(item.qty * item.ptr).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Order Remarks / Instructions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Urgent stock requirement"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
