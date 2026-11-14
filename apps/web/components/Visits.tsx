'use client';

import { useState, type FormEvent } from 'react';
import { can, canApprove } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

export function Visits() {
  const { api, user } = useAuth();
  const calls = useLoad(() => api.listDcr(), [api]);
  const doctors = useLoad(() => (user && can(user, 'doctor.view') ? api.listDoctors() : Promise.resolve({ count: 0, data: [] })), [api]);
  const [doctorId, setDoctorId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  if (!user) return null;

  async function log(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createDcr({ targetType: 'DOCTOR', targetId: doctorId, purpose, feedback });
      setPurpose(''); setFeedback(''); setError('');
      await calls.reload();
    } catch (err) { setError(messageOf(err)); }
  }

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    try { await api.setDcrStatus(id, status); await calls.reload(); } catch (err) { setError(messageOf(err)); }
  }

  return (
    <div className="stack">
      {can(user, 'dcr.create') && (
        <Card title="Log a doctor call">
          <form className="grid" onSubmit={log}>
            <Field label="Doctor">
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                <option value="">Select…</option>
                {doctors.data?.data.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Purpose"><input value={purpose} onChange={(e) => setPurpose(e.target.value)} /></Field>
            <Field label="Feedback"><input value={feedback} onChange={(e) => setFeedback(e.target.value)} /></Field>
            <button>Submit call</button>
          </form>
        </Card>
      )}
      <Card title="Daily call reports">
        <ErrorBox message={error || calls.error} />
        <Table
          head={['Date', 'Rep', 'Type', 'Visited', 'Purpose', 'Feedback', 'Status', '']}
          rows={(calls.data?.data ?? []).map((c) => [
            c.date, c.mrName, c.targetType, c.targetName, c.purpose ?? '', c.feedback ?? '', <Status key="s" value={c.status} />,
            canApprove(user, 'dcr') && c.status === 'SUBMITTED'
              ? <span key="a" className="row"><button onClick={() => decide(c.id, 'APPROVED')}>Approve</button><button className="ghost" onClick={() => decide(c.id, 'REJECTED')}>Reject</button></span>
              : '',
          ])}
        />
      </Card>
    </div>
  );
}
