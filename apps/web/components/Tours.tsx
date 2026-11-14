'use client';

import { useState, type FormEvent } from 'react';
import { can } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { messageOf, useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Field, Status, Table } from './ui';

export function Tours() {
  const { api, user } = useAuth();
  const plans = useLoad(() => api.listTourPlans(), [api]);
  const [date, setDate] = useState('');
  const [route, setRoute] = useState('');
  const [objective, setObjective] = useState('');
  const [targets, setTargets] = useState(5);
  const [error, setError] = useState('');
  if (!user) return null;

  async function add(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createTourPlan({ date, route, objective, targetDoctors: targets });
      setRoute(''); setObjective(''); setError('');
      await plans.reload();
    } catch (err) { setError(messageOf(err)); }
  }

  return (
    <div className="stack">
      {can(user, 'tour.create') && (
        <Card title="Plan a day">
          <form className="grid" onSubmit={add}>
            <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
            <Field label="Route"><input value={route} onChange={(e) => setRoute(e.target.value)} required /></Field>
            <Field label="Objective"><input value={objective} onChange={(e) => setObjective(e.target.value)} /></Field>
            <Field label="Target doctors"><input type="number" min={0} value={targets} onChange={(e) => setTargets(Number(e.target.value))} /></Field>
            <button>Add</button>
          </form>
        </Card>
      )}
      <Card title="Tour plans">
        <ErrorBox message={error || plans.error} />
        <Table
          head={['Date', 'Rep', 'Route', 'Objective', 'Doctors', 'Status']}
          rows={(plans.data?.data ?? []).map((p) => [p.date, p.mrName, p.route, p.objective ?? '', p.targetDoctors, <Status key="s" value={p.status} />])}
        />
      </Card>
    </div>
  );
}
