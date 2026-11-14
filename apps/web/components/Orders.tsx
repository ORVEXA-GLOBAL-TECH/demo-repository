'use client';

import { useState, type FormEvent } from 'react';
import { canApprove, can, fmtMoney } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

export function Orders() {
  const { api, user } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const orders = useLoad(() => api.listOrders(filter), [api, filter]);
  const products = useLoad(() => (user && can(user, 'product.view') ? api.listProducts() : Promise.resolve({ count: 0, data: [] })), [api]);
  const chemists = useLoad(() => (user && can(user, 'chemist.view') ? api.listChemists() : Promise.resolve({ count: 0, data: [] })), [api]);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [chemistId, setChemistId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  if (!user) return null;

  async function book(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createOrder({ chemistId: chemistId || undefined, discountPercent: discount, items: [{ productId, qty }] });
      setError('');
      await orders.reload();
    } catch (err) { setError(messageOf(err)); }
  }

  async function decide(id: string, status: string) {
    try { await api.setOrderStatus(id, status); await orders.reload(); } catch (err) { setError(messageOf(err)); }
  }

  return (
    <div className="stack">
      {can(user, 'order.create') && (
        <Card title="Book an order">
          <form className="grid" onSubmit={book}>
            <Field label="Product">
              <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                <option value="">Select…</option>
                {products.data?.data.map((p) => <option key={p.id} value={p.id}>{p.name} ({fmtMoney(p.ptr)})</option>)}
              </select>
            </Field>
            <Field label="Quantity"><input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} /></Field>
            <Field label="Chemist">
              <select value={chemistId} onChange={(e) => setChemistId(e.target.value)}>
                <option value="">Not specified</option>
                {chemists.data?.data.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Discount %"><input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></Field>
            <button>Place order</button>
          </form>
        </Card>
      )}
      <Card
        title="Orders"
        actions={
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SHIPPED', 'DELIVERED'].map((s) => <option key={s}>{s}</option>)}
          </select>
        }
      >
        <ErrorBox message={error || orders.error} />
        <Table
          head={['Order', 'Date', 'Rep', 'Chemist', 'Items', 'Value', 'Status', '']}
          rows={(orders.data?.data ?? []).map((o) => [
            o.orderNumber, o.orderDate, o.mrName, o.chemistName ?? '',
            o.items.map((i) => `${i.productName} × ${i.qty}`).join(', '), fmtMoney(o.netAmount), <Status key="s" value={o.status} />,
            canApprove(user, 'order') && o.status === 'PENDING_APPROVAL'
              ? <span key="a" className="row"><button onClick={() => decide(o.id, 'APPROVED')}>Approve</button><button className="ghost" onClick={() => decide(o.id, 'REJECTED')}>Reject</button></span>
              : '',
          ])}
        />
      </Card>
    </div>
  );
}
