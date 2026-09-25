import React, { useState, useEffect } from 'react';
import { Plus, Check, X, ShoppingCart, ArrowRight, FileText, Send, CheckCircle2 } from 'lucide-react';
import { getOrders, createOrder, updateOrderStatus, getChemists, getProducts, getStockists } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { role, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Form states
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockists, setStockists] = useState([]);
  const [selectedChemist, setSelectedChemist] = useState('');
  const [selectedStockist, setSelectedStockist] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState(5);
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
      const [chmRes, prdRes, stkRes] = await Promise.all([getChemists(), getProducts(), getStockists()]);
      setChemists(chmRes.data || []);
      setProducts(prdRes.data || []);
      setStockists(stkRes.data || []);
      if (chmRes.data?.length > 0) {
        setSelectedChemist(chmRes.data[0].name);
        setSelectedStockist(chmRes.data[0].preferredStockist || 'MedLife Distributors Ltd.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (product) => {
    const existing = orderItems.find(i => i.productId === product.id);
    if (existing) {
      setOrderItems(orderItems.map(i => i.productId === product.id ? { ...i, qty: i.qty + 20 } : i));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        productName: product.name,
        qty: 20,
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
      alert('Error updating order status');
    }
  };

  return (
    <div>
      <div className="card-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Personal Order Bookings (POB) & Secondary Distribution</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Chemist sales generation, wholesale stockist routing & multi-tier trade discount calculation
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
              <th>Net Order Value</th>
              <th>Status</th>
              <th>Enterprise Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id}>
                <td>
                  <div style={{ fontWeight: '800', color: '#2563eb' }}>{ord.orderNumber}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Date: {ord.orderDate}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '700' }}>{ord.chemistName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.territory}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>{ord.stockistName}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {(ord.items || []).map((item, idx) => (
                      <span key={idx} style={{ fontSize: '0.8rem', color: '#334155' }}>
                        • <strong>{item.qty}x</strong> {item.productName} (@ ₹{item.ptr})
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                    ₹{ord.netAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  {ord.discountPercent > 0 && (
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700' }}>
                      Incl. {ord.discountPercent}% Trade Discount
                    </div>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${
                    ord.status === 'APPROVED' ? 'badge-approved' :
                    ord.status === 'INVOICED' ? 'badge-invoiced' :
                    ord.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
                  }`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInvoiceOrder(ord)}
                      title="View Invoice"
                    >
                      <FileText size={13} /> Invoice
                    </button>

                    {(role === 'ADMIN' || role === 'SALES_MANAGER' || role === 'MANAGER' || role === 'RSM' || role === 'ASM') && ord.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusUpdate(ord.id, 'APPROVED')}
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleStatusUpdate(ord.id, 'REJECTED')}
                        >
                          <X size={13} />
                        </button>
                      </>
                    )}

                    {(role === 'ADMIN' || role === 'SALES_MANAGER' || role === 'RSM') && ord.status === 'APPROVED' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(ord.id, 'INVOICED')}
                      >
                        Generate Invoice
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {invoiceOrder && (
        <div className="modal-overlay" onClick={() => setInvoiceOrder(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>ALLEVIARE PHARMACEUTICALS</h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Commercial POB Tax Invoice & Delivery Indent</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#2563eb' }}>{invoiceOrder.orderNumber}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Date: {invoiceOrder.orderDate}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#0f172a' }}>Billed / Retail Chemist:</strong>
                <div>{invoiceOrder.chemistName}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{invoiceOrder.territory}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#0f172a' }}>Assigned Stockist:</strong>
                <div>{invoiceOrder.stockistName}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Payment Terms: {invoiceOrder.paymentTerms}</div>
              </div>
            </div>

            <table className="custom-table" style={{ marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th>Product Description</th>
                  <th>Quantity</th>
                  <th>PTR (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(invoiceOrder.items || []).map((it, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{it.productName}</td>
                    <td>{it.qty} Units</td>
                    <td>₹{it.ptr?.toFixed(2)}</td>
                    <td style={{ fontWeight: '700' }}>₹{(it.qty * it.ptr).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', textAlign: 'right', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Total Gross: ₹{invoiceOrder.totalAmount?.toFixed(2)}</div>
              <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '700' }}>Less Trade Discount ({invoiceOrder.discountPercent}%): - ₹{(invoiceOrder.totalAmount * (invoiceOrder.discountPercent / 100)).toFixed(2)}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e40af', marginTop: '4px' }}>
                Net Payable: ₹{invoiceOrder.netAmount?.toFixed(2)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setInvoiceOrder(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { alert('Invoice PDF downloaded'); setInvoiceOrder(null); }}>Print / Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Book Order Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Book New Chemist POB Order</h3>
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
                  <select
                    className="form-control"
                    value={selectedStockist}
                    onChange={(e) => setSelectedStockist(e.target.value)}
                  >
                    {stockists.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
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
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.productName}</span>
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
                        <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>₹{(item.qty * item.ptr).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Trade Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Order Remarks / Delivery Instructions</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Urgent stock replenishment"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit & Route Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
