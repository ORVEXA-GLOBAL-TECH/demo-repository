'use client';

import type { ReactNode } from 'react';

export function Table({ head, rows, empty = 'Nothing here yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          {rows.length === 0 && <tr><td colSpan={head.length} className="muted">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function Status({ value }: { value: string }) {
  const tone = /APPROVED|DELIVERED|SHIPPED|PRESENT/.test(value) ? 'ok' : /REJECT/.test(value) ? 'bad' : 'wait';
  return <span className={`pill ${tone}`}>{value.replace(/_/g, ' ')}</span>;
}

export function ErrorBox({ message }: { message: string }) {
  return message ? <div className="error" role="alert">{message}</div> : null;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label>{label}{children}</label>;
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="card">
      {(title || actions) && (
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {title && <h3>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
