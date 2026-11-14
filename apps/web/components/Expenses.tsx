'use client';

import { useState, type FormEvent } from 'react';
import { can, canApprove, fmtMoney } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

export function Expenses() {
  const { api, user } = useAuth();
  const claims = useLoad(() => api.listExpenses(), [api]);
  const [km, setKm] = useState(0);
  const [da, setDa] = useState<number | ''>('');
  const [hotel, setHotel] = useState(0);
  const [misc, setMisc] = useState(0);
  const [error, setError] = useState('');
  if (!user) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createExpense({ travelKm: km, dailyAllowance: da === '' ? undefined : da, hotelCharges: hotel, miscCharges: misc });
      setError('');
      await claims.reload();
    } catch (err) { setError(messageOf(err)); }
  }

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    const remarks = status === 'REJECTED' ? window.prompt('Reason for rejection?') ?? undefined : undefined;
    if (status === 'REJECTED' && !remarks) return;
    try { await api.decideExpense(id, status, remarks); await claims.reload(); } catch (err) { setError(messageOf(err)); }
  }

  return (
    <div className="stack">
      {can(user, 'expense.create') && (
        <Card title="New expense claim">
          <form className="grid" onSubmit={submit}>
            <Field label="Travel (km)"><input type="number" min={0} value={km} onChange={(e) => setKm(Number(e.target.value))} /></Field>
            <Field label="Daily allowance"><input type="number" min={0} placeholder="Company default" value={da} onChange={(e) => setDa(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
            <Field label="Hotel"><input type="number" min={0} value={hotel} onChange={(e) => setHotel(Number(e.target.value))} /></Field>
            <Field label="Miscellaneous"><input type="number" min={0} value={misc} onChange={(e) => setMisc(Number(e.target.value))} /></Field>
            <button>Submit claim</button>
          </form>
        </Card>
      )}
      <Card title="Expense claims">
        <ErrorBox message={error || claims.error} />
        <Table
          head={['Claim', 'Date', 'Rep', 'Amount', 'Status', 'Remarks', '']}
          rows={(claims.data?.data ?? []).map((c) => [
            c.claimNumber, c.date, c.mrName, fmtMoney(c.totalClaimAmount), <Status key="s" value={c.status} />, c.managerRemarks ?? '',
            canApprove(user, 'expense') && c.status === 'SUBMITTED'
              ? <span key="a" className="row"><button onClick={() => decide(c.id, 'APPROVED')}>Approve</button><button className="ghost" onClick={() => decide(c.id, 'REJECTED')}>Reject</button></span>
              : '',
          ])}
        />
      </Card>
    </div>
  );
}
