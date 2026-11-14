'use client';

import { useState, type FormEvent } from 'react';
import { can, fmtMoney } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Table } from './ui';

export function Chemists() {
  const { api, user } = useAuth();
  const [search, setSearch] = useState('');
  const rows = useLoad(() => api.listChemists(search), [api, search]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  if (!user) return null;

  async function add(e: FormEvent) {
    e.preventDefault();
    try { await api.createChemist({ name, contactPerson: contact }); setName(''); setContact(''); setError(''); await rows.reload(); }
    catch (err) { setError(messageOf(err)); }
  }

  return (
    <Card title="Chemists" actions={<input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />}>
      {can(user, 'chemist.create') && (
        <form className="grid" onSubmit={add}>
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Contact person"><input value={contact} onChange={(e) => setContact(e.target.value)} /></Field>
          <button>Add chemist</button>
        </form>
      )}
      <ErrorBox message={error || rows.error} />
      <Table head={['Name', 'Contact', 'Phone', 'Drug licence', 'Stockist']}
        rows={(rows.data?.data ?? []).map((c) => [c.name, c.contactPerson ?? '', c.phone ?? '', c.drugLicense ?? '', c.preferredStockist ?? ''])} />
    </Card>
  );
}

export function Products() {
  const { api, user } = useAuth();
  const [search, setSearch] = useState('');
  const rows = useLoad(() => api.listProducts(search), [api, search]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [mrp, setMrp] = useState(0);
  const [ptr, setPtr] = useState(0);
  const [pts, setPts] = useState(0);
  const [error, setError] = useState('');
  if (!user) return null;

  async function add(e: FormEvent) {
    e.preventDefault();
    try { await api.createProduct({ name, category, mrp, ptr, pts }); setName(''); setError(''); await rows.reload(); }
    catch (err) { setError(messageOf(err)); }
  }

  return (
    <Card title="Products" actions={<input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />}>
      {can(user, 'product.create') && (
        <form className="grid" onSubmit={add}>
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="Category"><input value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
          <Field label="MRP"><input type="number" min={0} value={mrp} onChange={(e) => setMrp(Number(e.target.value))} /></Field>
          <Field label="PTR"><input type="number" min={0} value={ptr} onChange={(e) => setPtr(Number(e.target.value))} /></Field>
          <Field label="PTS"><input type="number" min={0} value={pts} onChange={(e) => setPts(Number(e.target.value))} /></Field>
          <button>Add product</button>
        </form>
      )}
      <ErrorBox message={error || rows.error} />
      <Table head={['SKU', 'Name', 'Category', 'MRP', 'PTR', 'PTS']}
        rows={(rows.data?.data ?? []).map((p) => [p.sku, p.name, p.category ?? '', fmtMoney(p.mrp), fmtMoney(p.ptr), fmtMoney(p.pts)])} />
    </Card>
  );
}

export function Employees() {
  const { api } = useAuth();
  const rows = useLoad(() => api.listEmployees(), [api]);
  return (
    <Card title="Employees">
      <ErrorBox message={rows.error} />
      <Table head={['Code', 'Name', 'Email', 'Phone', 'Manager', 'Status']}
        rows={(rows.data?.data ?? []).map((e) => [e.code, e.name, e.email, e.phone ?? '', e.manager ?? '', e.status])} />
    </Card>
  );
}
