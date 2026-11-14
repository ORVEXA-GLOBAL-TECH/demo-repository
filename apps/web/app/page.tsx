'use client';

import { useState, type FormEvent, type ReactElement } from 'react';
import { ApiError, ROLE_TITLE, visibleModules, type ModuleId } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { Attendance } from '../components/Attendance';
import { Chemists, Employees, Products } from '../components/Catalog';
import { Dashboard } from '../components/Dashboard';
import { Doctors } from '../components/Doctors';
import { Expenses } from '../components/Expenses';
import { Orders } from '../components/Orders';
import { Tours } from '../components/Tours';
import { Visits } from '../components/Visits';
import { Logins } from '../components/Logins';

export default function Home() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Shell /> : <Login />;
}

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="center">
      <form className="card login" onSubmit={submit}>
        <h1>Alleviare Platform</h1>
        <p className="muted">Sign in with your employee credentials. Your role decides your workspace.</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {error && <div className="error" role="alert">{error}</div>}
        <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}

const PAGES: Record<ModuleId, () => ReactElement | null> = {
  visits: Visits, orders: Orders, expenses: Expenses, attendance: Attendance, tours: Tours,
  doctors: Doctors, chemists: Chemists, products: Products, employees: Employees, users: Logins,
};

function Shell() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState<ModuleId | 'home'>('home');
  if (!user) return null;
  const modules = visibleModules(user);
  const Page = active === 'home' ? Dashboard : PAGES[active];
  const title = active === 'home' ? ROLE_TITLE[user.role] : modules.find((m) => m.id === active)?.label;

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Alleviare</div>
        <nav>
          <button className={active === 'home' ? 'on' : ''} onClick={() => setActive('home')}>Dashboard</button>
          {modules.map((m) => (
            <button key={m.id} className={active === m.id ? 'on' : ''} onClick={() => setActive(m.id)}>{m.label}</button>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="top">
          <h2>{title}</h2>
          <div className="who">
            <span className="chip">{user.role.replace(/_/g, ' ')}</span>
            <span>{user.name}</span>
            <button className="ghost" onClick={logout}>Sign out</button>
          </div>
        </header>
        <section className="content"><Page /></section>
      </div>
    </div>
  );
}
