import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  ApiError, can, canApprove, fmtMoney, ROLE_TITLE,
  type ApiClient, type ModuleId, type User,
} from '@alleviare/api-client';
import { s } from './styles';

type Api = ApiClient;

function useLoad<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await fn()); setError(''); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Something went wrong'); }
    finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  return { data, error, loading, reload, setError };
}

const msg = (e: unknown) => (e instanceof ApiError ? e.message : 'Something went wrong');

function Box({ children }: { children: ReactNode }) {
  return <View style={s.card}>{children}</View>;
}

function Input(p: { label: string; value: string; onChange: (v: string) => void; numeric?: boolean }) {
  return (
    <View>
      <Text style={s.label}>{p.label}</Text>
      <TextInput style={s.input} value={p.value} onChangeText={p.onChange} keyboardType={p.numeric ? 'numeric' : 'default'} />
    </View>
  );
}

function Button({ title, onPress, ghost }: { title: string; onPress: () => void; ghost?: boolean }) {
  return (
    <Pressable style={[s.btn, ghost && s.btnGhost]} onPress={onPress}>
      <Text style={[s.btnText, ghost && s.btnGhostText]}>{title}</Text>
    </Pressable>
  );
}

function Badge({ value }: { value: string }) {
  const tone = /APPROVED|DELIVERED|PRESENT/.test(value) ? s.ok : /REJECT/.test(value) ? s.bad : s.wait;
  return <Text style={[s.badge, tone]}>{value.replace(/_/g, ' ')}</Text>;
}

function Screen({ error, loading, children }: { error: string; loading: boolean; children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={s.pad}>
      {!!error && <Text style={s.error}>{error}</Text>}
      {loading && <ActivityIndicator />}
      {children}
    </ScrollView>
  );
}

// ---------- Home ----------

export function HomeScreen({ user, api, modules, open }: { user: User; api: Api; modules: { id: ModuleId; label: string }[]; open: (m: ModuleId) => void }) {
  const d = useLoad(() => api.dashboard());
  const m = d.data?.metrics;
  return (
    <Screen error={d.error} loading={d.loading}>
      <Text style={s.h3}>{ROLE_TITLE[user.role]}</Text>
      {m && (
        <View style={s.tiles}>
          {[['Calls this month', m.callsThisMonth], ['Orders', m.orders], ['Pending orders', m.pendingOrders],
            ['Order value', fmtMoney(m.revenue)], ['Pending claims', m.pendingExpenses], ['Pending calls', m.pendingDcr]]
            .map(([k, v]) => (
              <View key={String(k)} style={s.stat}><Text style={s.muted}>{k}</Text><Text style={s.big}>{String(v)}</Text></View>
            ))}
        </View>
      )}
      <Text style={s.h3}>Modules</Text>
      {modules.map((x) => (
        <Pressable key={x.id} style={s.tile} onPress={() => open(x.id)}><Text style={s.tileText}>{x.label}</Text></Pressable>
      ))}
    </Screen>
  );
}

// ---------- Visits ----------

export function VisitsScreen({ user, api }: { user: User; api: Api }) {
  const calls = useLoad(() => api.listDcr());
  const doctors = useLoad(() => (can(user, 'doctor.view') ? api.listDoctors() : Promise.resolve({ count: 0, data: [] })));
  const [doctorId, setDoctorId] = useState('');
  const [feedback, setFeedback] = useState('');

  async function log() {
    try { await api.createDcr({ targetType: 'DOCTOR', targetId: doctorId, feedback }); setFeedback(''); await calls.reload(); }
    catch (e) { calls.setError(msg(e)); }
  }
  async function decide(id: string, st: 'APPROVED' | 'REJECTED') {
    try { await api.setDcrStatus(id, st); await calls.reload(); } catch (e) { calls.setError(msg(e)); }
  }

  return (
    <Screen error={calls.error} loading={calls.loading}>
      {can(user, 'dcr.create') && (
        <Box>
          <Text style={s.h3}>Log a doctor call</Text>
          <Text style={s.label}>Doctor</Text>
          <View style={s.chips}>
            {doctors.data?.data.slice(0, 12).map((d) => (
              <Pressable key={d.id} onPress={() => setDoctorId(d.id)} style={[s.chip, doctorId === d.id && s.chipOn]}>
                <Text style={doctorId === d.id ? s.chipOnText : s.chipText}>{d.name}</Text>
              </Pressable>
            ))}
          </View>
          <Input label="Feedback" value={feedback} onChange={setFeedback} />
          <Button title="Submit call" onPress={log} />
        </Box>
      )}
      {calls.data?.data.map((c) => (
        <Box key={c.id}>
          <Text style={s.rowTitle}>{c.targetName}</Text>
          <Text style={s.muted}>{c.date} · {c.mrName}</Text>
          {!!c.feedback && <Text>{c.feedback}</Text>}
          <Badge value={c.status} />
          {canApprove(user, 'dcr') && c.status === 'SUBMITTED' && (
            <View style={s.rowBtns}><Button title="Approve" onPress={() => decide(c.id, 'APPROVED')} /><Button ghost title="Reject" onPress={() => decide(c.id, 'REJECTED')} /></View>
          )}
        </Box>
      ))}
    </Screen>
  );
}

// ---------- Orders ----------

export function OrdersScreen({ user, api }: { user: User; api: Api }) {
  const orders = useLoad(() => api.listOrders());
  const products = useLoad(() => (can(user, 'product.view') ? api.listProducts() : Promise.resolve({ count: 0, data: [] })));
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');

  async function book() {
    try { await api.createOrder({ items: [{ productId, qty: Number(qty) }] }); await orders.reload(); }
    catch (e) { orders.setError(msg(e)); }
  }
  async function decide(id: string, st: string) {
    try { await api.setOrderStatus(id, st); await orders.reload(); } catch (e) { orders.setError(msg(e)); }
  }

  return (
    <Screen error={orders.error} loading={orders.loading}>
      {can(user, 'order.create') && (
        <Box>
          <Text style={s.h3}>Book an order</Text>
          <View style={s.chips}>
            {products.data?.data.slice(0, 12).map((p) => (
              <Pressable key={p.id} onPress={() => setProductId(p.id)} style={[s.chip, productId === p.id && s.chipOn]}>
                <Text style={productId === p.id ? s.chipOnText : s.chipText}>{p.name}</Text>
              </Pressable>
            ))}
          </View>
          <Input label="Quantity" value={qty} onChange={setQty} numeric />
          <Button title="Place order" onPress={book} />
        </Box>
      )}
      {orders.data?.data.map((o) => (
        <Box key={o.id}>
          <Text style={s.rowTitle}>{o.orderNumber} · {fmtMoney(o.netAmount)}</Text>
          <Text style={s.muted}>{o.orderDate} · {o.mrName}</Text>
          <Text>{o.items.map((i) => `${i.productName} × ${i.qty}`).join(', ')}</Text>
          <Badge value={o.status} />
          {canApprove(user, 'order') && o.status === 'PENDING_APPROVAL' && (
            <View style={s.rowBtns}><Button title="Approve" onPress={() => decide(o.id, 'APPROVED')} /><Button ghost title="Reject" onPress={() => decide(o.id, 'REJECTED')} /></View>
          )}
        </Box>
      ))}
    </Screen>
  );
}

// ---------- Expenses ----------

export function ExpensesScreen({ user, api }: { user: User; api: Api }) {
  const claims = useLoad(() => api.listExpenses());
  const [km, setKm] = useState('');
  const [da, setDa] = useState('');
  const [hotel, setHotel] = useState('');

  async function submit() {
    try { await api.createExpense({ travelKm: Number(km || 0), dailyAllowance: da === '' ? undefined : Number(da), hotelCharges: Number(hotel || 0) }); await claims.reload(); }
    catch (e) { claims.setError(msg(e)); }
  }
  async function decide(id: string, st: 'APPROVED' | 'REJECTED') {
    try { await api.decideExpense(id, st, st === 'REJECTED' ? 'Rejected from mobile' : undefined); await claims.reload(); }
    catch (e) { claims.setError(msg(e)); }
  }

  return (
    <Screen error={claims.error} loading={claims.loading}>
      {can(user, 'expense.create') && (
        <Box>
          <Text style={s.h3}>New claim</Text>
          <Input label="Travel (km)" value={km} onChange={setKm} numeric />
          <Input label="Daily allowance (blank = company default)" value={da} onChange={setDa} numeric />
          <Input label="Hotel" value={hotel} onChange={setHotel} numeric />
          <Button title="Submit claim" onPress={submit} />
        </Box>
      )}
      {claims.data?.data.map((c) => (
        <Box key={c.id}>
          <Text style={s.rowTitle}>{c.claimNumber} · {fmtMoney(c.totalClaimAmount)}</Text>
          <Text style={s.muted}>{c.date} · {c.mrName}</Text>
          {!!c.managerRemarks && <Text>{c.managerRemarks}</Text>}
          <Badge value={c.status} />
          {canApprove(user, 'expense') && c.status === 'SUBMITTED' && (
            <View style={s.rowBtns}><Button title="Approve" onPress={() => decide(c.id, 'APPROVED')} /><Button ghost title="Reject" onPress={() => decide(c.id, 'REJECTED')} /></View>
          )}
        </Box>
      ))}
    </Screen>
  );
}

// ---------- Attendance & leave ----------

export function AttendanceScreen({ user, api }: { user: User; api: Api }) {
  const att = useLoad(() => api.listAttendance());
  const leave = useLoad(() => (can(user, 'leave.create') ? api.leaveSummary() : Promise.resolve(null)));
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [type, setType] = useState('');

  async function act(fn: () => Promise<unknown>, ok?: string) {
    try { await fn(); await att.reload(); await leave.reload(); if (ok) Alert.alert(ok); }
    catch (e) { att.setError(msg(e)); }
  }

  return (
    <Screen error={att.error} loading={att.loading}>
      {can(user, 'attendance.create') && (
        <Box>
          <Text style={s.h3}>Today</Text>
          <View style={s.rowBtns}>
            <Button title="Punch in" onPress={() => act(() => api.punchIn('Mobile'), 'Punched in')} />
            <Button ghost title="Punch out" onPress={() => act(() => api.punchOut('Mobile'), 'Punched out')} />
          </View>
        </Box>
      )}
      {leave.data && (
        <Box>
          <Text style={s.h3}>Leave balance</Text>
          {leave.data.balances.map((b) => <Text key={b.code}>{b.name}: {b.total - b.used} left</Text>)}
          <View style={s.chips}>
            {leave.data.balances.map((b) => (
              <Pressable key={b.code} onPress={() => setType(b.code)} style={[s.chip, type === b.code && s.chipOn]}>
                <Text style={type === b.code ? s.chipOnText : s.chipText}>{b.name}</Text>
              </Pressable>
            ))}
          </View>
          <Input label="From (YYYY-MM-DD)" value={from} onChange={setFrom} />
          <Input label="To (YYYY-MM-DD)" value={to} onChange={setTo} />
          <Button title="Request leave" onPress={() => act(() => api.requestLeave({ leaveType: type, fromDate: from, toDate: to }), 'Leave requested')} />
        </Box>
      )}
      {att.data?.data.map((a) => (
        <Box key={a.id}>
          <Text style={s.rowTitle}>{a.date}</Text>
          <Text style={s.muted}>{a.punchInTime ?? '-'} to {a.punchOutTime ?? '-'} · {a.totalHours} h</Text>
          <Badge value={a.status} />
        </Box>
      ))}
    </Screen>
  );
}

// ---------- Read-only lists ----------

function SimpleList<T extends { id: string }>({ load, title, sub }: { load: () => Promise<{ data: T[] }>; title: (x: T) => string; sub: (x: T) => string }) {
  const r = useLoad(load);
  return (
    <View style={s.flex}>
      {!!r.error && <Text style={[s.error, s.pad]}>{r.error}</Text>}
      {r.loading && <ActivityIndicator />}
      <FlatList data={r.data?.data ?? []} keyExtractor={(x) => x.id} contentContainerStyle={s.pad}
        ListEmptyComponent={r.loading ? null : <Text style={s.muted}>Nothing here yet.</Text>}
        renderItem={({ item }) => (
          <View style={s.row}><Text style={s.rowTitle}>{title(item)}</Text><Text style={s.muted}>{sub(item)}</Text></View>
        )} />
    </View>
  );
}

export const DoctorsScreen = ({ api }: { api: Api }) => (
  <SimpleList load={() => api.listDoctors()} title={(d) => d.name} sub={(d) => [d.qualification, d.phone].filter(Boolean).join(' · ')} />
);
export const ChemistsScreen = ({ api }: { api: Api }) => (
  <SimpleList load={() => api.listChemists()} title={(c) => c.name} sub={(c) => [c.contactPerson, c.phone].filter(Boolean).join(' · ')} />
);
export const ProductsScreen = ({ api }: { api: Api }) => (
  <SimpleList load={() => api.listProducts()} title={(p) => p.name} sub={(p) => `${p.category ?? ''} · PTR ${fmtMoney(p.ptr)}`} />
);
export const EmployeesScreen = ({ api }: { api: Api }) => (
  <SimpleList load={() => api.listEmployees()} title={(e) => e.name} sub={(e) => `${e.code} · ${e.email}`} />
);
export const ToursScreen = ({ api }: { api: Api }) => (
  <SimpleList load={() => api.listTourPlans()} title={(t) => `${t.date} · ${t.route}`} sub={(t) => `${t.mrName} · ${t.targetDoctors} doctors · ${t.status}`} />
);
