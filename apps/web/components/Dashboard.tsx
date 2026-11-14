'use client';

import { fmtMoney, ROLE_TITLE } from '@alleviare/api-client';
import { useAuth } from '../lib/auth';
import { useLoad } from '../lib/useLoad';
import { Card, ErrorBox, Status, Table } from './ui';

const TILES: [string, string, boolean?][] = [
  ['callsThisMonth', 'Calls this month'],
  ['orders', 'Orders'],
  ['pendingOrders', 'Orders awaiting approval'],
  ['revenue', 'Order value', true],
  ['pendingExpenses', 'Expense claims pending'],
  ['pendingDcr', 'Call reports pending'],
  ['presentToday', 'Present today'],
  ['doctors', 'Doctors'],
  ['chemists', 'Chemists'],
  ['activeEmployees', 'Active employees'],
];

export function Dashboard() {
  const { api, user } = useAuth();
  const { data, error } = useLoad(() => api.dashboard(), [api]);
  if (!user) return null;
  const self = data?.scope === 'SELF';

  return (
    <div className="stack">
      <Card title={ROLE_TITLE[user.role]}>
        <p className="muted">{self ? 'Your personal numbers.' : 'Company-wide numbers.'}</p>
      </Card>
      <ErrorBox message={error} />
      <div className="tiles">
        {data && TILES.filter(([k]) => !(self && ['doctors', 'chemists', 'activeEmployees'].includes(k))).map(([key, label, money]) => (
          <div className="tile" key={key}>
            <div className="muted">{label}</div>
            <div className="big">{money ? fmtMoney(data.metrics[key]) : data.metrics[key]}</div>
          </div>
        ))}
      </div>
      {data && (
        <Card title="Recent orders">
          <Table
            head={['Order', 'Chemist', 'Value', 'Status']}
            rows={data.recentOrders.map((o) => [o.orderNumber, o.chemistName ?? '', fmtMoney(o.netAmount), <Status key={o.orderNumber} value={o.status} />])}
          />
        </Card>
      )}
    </div>
  );
}
