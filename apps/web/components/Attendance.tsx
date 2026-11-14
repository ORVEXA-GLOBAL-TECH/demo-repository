'use client';

import { useState, type FormEvent } from 'react';
import { can } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

export function Attendance() {
  const { api, user } = useAuth();
  const att = useLoad(() => api.listAttendance(), [api]);
  const leave = useLoad(() => (user && can(user, 'leave.create') ? api.leaveSummary() : Promise.resolve(null)), [api]);
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  if (!user) return null;

  async function act(fn: () => Promise<unknown>) {
    try { await fn(); setError(''); await att.reload(); await leave.reload(); } catch (err) { setError(messageOf(err)); }
  }

  function apply(e: FormEvent) {
    e.preventDefault();
    void act(() => api.requestLeave({ leaveType: type, fromDate: from, toDate: to, reason }));
  }

  return (
    <div className="stack">
      {can(user, 'attendance.create') && (
        <Card title="Today">
          <div className="row">
            <button onClick={() => act(() => api.punchIn('Web'))}>Punch in</button>
            <button className="ghost" onClick={() => act(() => api.punchOut('Web'))}>Punch out</button>
          </div>
        </Card>
      )}
      <ErrorBox message={error || att.error} />
      <Card title="Attendance log">
        <Table
          head={['Date', 'Rep', 'In', 'Out', 'Hours', 'Status']}
          rows={(att.data?.data ?? []).map((a) => [a.date, a.mrName, a.punchInTime ?? '', a.punchOutTime ?? '', a.totalHours, <Status key="s" value={a.status} />])}
        />
      </Card>
      {leave.data && (
        <Card title="Leave">
          <div className="tiles">
            {leave.data.balances.map((b) => (
              <div className="tile" key={b.code}><div className="muted">{b.name}</div><div className="big">{b.total - b.used} left</div></div>
            ))}
          </div>
          <form className="grid" onSubmit={apply}>
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select…</option>
                {leave.data.balances.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="From"><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></Field>
            <Field label="To"><input type="date" value={to} onChange={(e) => setTo(e.target.value)} required /></Field>
            <Field label="Reason"><input value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
            <button>Request leave</button>
          </form>
          <Table
            head={['Type', 'From', 'To', 'Days', 'Status']}
            rows={leave.data.requests.map((r) => [r.leaveType, r.fromDate, r.toDate, r.days, <Status key="s" value={r.status} />])}
          />
        </Card>
      )}
    </div>
  );
}
