'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ApiError, type Doctor } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';

export function Doctors() {
  const { api, user } = useAuth();
  const [rows, setRows] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const canCreate = !!user && (user.permissions.includes('*') || user.permissions.includes('doctor.create'));

  const load = useCallback(async () => {
    try {
      setRows((await api.listDoctors(search)).data);
      setError('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load doctors');
    }
  }, [api, search]);

  useEffect(() => { void load(); }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createDoctor({ name });
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add doctor');
    }
  }

  return (
    <div className="card">
      <div className="row">
        <input placeholder="Search doctors" value={search} onChange={(e) => setSearch(e.target.value)} />
        {canCreate && (
          <form className="row" onSubmit={add}>
            <input placeholder="New doctor name" value={name} onChange={(e) => setName(e.target.value)} required />
            <button>Add</button>
          </form>
        )}
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Qualification</th><th>Phone</th><th>Monthly visits</th></tr></thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td><td>{d.qualification ?? ''}</td><td>{d.phone ?? ''}</td><td>{d.monthlyTargetVisits ?? ''}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="muted">No doctors found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
