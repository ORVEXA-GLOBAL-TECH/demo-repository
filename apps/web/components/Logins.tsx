'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

const ROLES = ['ADMIN', 'DIRECTOR', 'ACCOUNTANT', 'MANAGER', 'SALES_MANAGER', 'MR_SUPERVISOR', 'MR'];

/** Create employees and their login accounts, and activate / deactivate / reset them. */
export function Logins() {
  const { api, user } = useAuth();
  const accounts = useLoad(() => api.listUsers(), [api]);
  const [emp, setEmp] = useState({ code: '', firstName: '', lastName: '', email: '' });
  const [login, setLogin] = useState({ email: '', password: '', role: 'MR' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function run(fn: () => Promise<unknown>, ok: string) {
    try { await fn(); setError(''); setNotice(ok); await accounts.reload(); } catch (e) { setError(messageOf(e)); setNotice(''); }
  }

  const addEmployee = (e: FormEvent) => { e.preventDefault(); void run(() => api.createEmployee(emp), 'Employee created'); };
  const addLogin = (e: FormEvent) => { e.preventDefault(); void run(() => api.createUser(login), 'Login created'); };

  async function reset(id: string) {
    const password = window.prompt('New password (minimum length is set by the server)');
    if (password) await run(() => api.resetPassword(id, password), 'Password changed');
  }

  return (
    <div className="stack">
      <Card title="1. Add an employee">
        <form className="grid" onSubmit={addEmployee}>
          <Field label="Code"><input value={emp.code} onChange={(e) => setEmp({ ...emp, code: e.target.value })} required /></Field>
          <Field label="First name"><input value={emp.firstName} onChange={(e) => setEmp({ ...emp, firstName: e.target.value })} required /></Field>
          <Field label="Last name"><input value={emp.lastName} onChange={(e) => setEmp({ ...emp, lastName: e.target.value })} required /></Field>
          <Field label="Email"><input type="email" value={emp.email} onChange={(e) => setEmp({ ...emp, email: e.target.value })} required /></Field>
          <button>Add employee</button>
        </form>
      </Card>
      <Card title="2. Give them a login">
        <form className="grid" onSubmit={addLogin}>
          <Field label="Employee email"><input type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required /></Field>
          <Field label="Password"><input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required autoComplete="new-password" /></Field>
          <Field label="Role">
            <select value={login.role} onChange={(e) => setLogin({ ...login, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </Field>
          <button>Create login</button>
        </form>
        {notice && <div className="pill ok">{notice}</div>}
      </Card>
      <Card title="Logins">
        <ErrorBox message={error || accounts.error} />
        <Table
          head={['Name', 'Email', 'Role', 'Status', 'Last login', '']}
          rows={(accounts.data?.data ?? []).map((a) => [
            a.name, a.email, a.role.replace(/_/g, ' '), <Status key="s" value={a.status === 'Active' ? 'APPROVED' : 'REJECTED'} />, a.lastLogin ?? '',
            a.email === user?.email ? '' : (
              <span key="x" className="row">
                <button className="ghost" onClick={() => run(() => api.setUserStatus(a.id, a.status === 'Active' ? 'Inactive' : 'Active'), 'Status updated')}>
                  {a.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="ghost" onClick={() => reset(a.id)}>Reset password</button>
              </span>
            ),
          ])}
        />
      </Card>
    </div>
  );
}
