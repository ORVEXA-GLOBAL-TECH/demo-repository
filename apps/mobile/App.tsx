import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View,
} from 'react-native';
import { ApiError, createClient, setCurrency, visibleModules, type ApiClient, type ModuleId, type User } from '@alleviare/api-client';
import {
  AttendanceScreen, ChemistsScreen, DoctorsScreen, EmployeesScreen, ExpensesScreen, HomeScreen,
  OrdersScreen, ProductsScreen, ToursScreen, VisitsScreen,
} from './screens';
import { s } from './styles';

// Injected at build time (see eas.json); there is deliberately no built-in default.
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const SESSION_KEY = 'alleviare.session';

type Session = { token: string; user: User };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Session;
        setCurrency(saved.user.currency);
        setSession(saved);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const signOut = useCallback(() => {
    void SecureStore.deleteItemAsync(SESSION_KEY);
    setSession(null);
  }, []);

  const api = useMemo(
    () => createClient(API_URL, { get: () => session?.token ?? null }, signOut),
    [session, signOut],
  );

  async function signIn(email: string, password: string) {
    const res = await createClient(API_URL, { get: () => null }).login(email.trim(), password, 'app');
    const next = { token: res.token, user: res.user };
    setCurrency(res.user.currency);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  }

  if (!API_URL) return <View style={s.center}><Text style={s.error}>This build has no server address configured (EXPO_PUBLIC_API_URL).</Text></View>;
  if (!ready) return <View style={s.center}><ActivityIndicator /></View>;
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      {session ? <Main user={session.user} api={api} onSignOut={signOut} /> : <Login onSubmit={signIn} />}
    </SafeAreaView>
  );
}

function Login({ onSubmit }: { onSubmit: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setError('');
    try {
      await onSubmit(email, password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.center}>
      <View style={[s.card, { gap: 12 }]}>
        <Text style={s.h1}>Alleviare Field</Text>
        <Text style={s.muted}>Sign in with your employee credentials.</Text>
        <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address"
          value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {!!error && <Text style={s.error}>{error}</Text>}
        <Pressable style={[s.btn, busy && { opacity: 0.6 }]} disabled={busy || !email || !password} onPress={go}>
          <Text style={s.btnText}>{busy ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Main({ user, api, onSignOut }: { user: User; api: ApiClient; onSignOut: () => void }) {
  const modules = visibleModules(user).filter((m) => m.mobile);
  const [open, setOpen] = useState<ModuleId | null>(null);
  const label = modules.find((m) => m.id === open)?.label;

  return (
    <View style={s.flex}>
      <View style={s.top}>
        {open && <Pressable onPress={() => setOpen(null)}><Text style={s.link}>‹ Back</Text></Pressable>}
        <View style={s.flex}>
          <Text style={s.h2}>{label ?? 'Home'}</Text>
          <Text style={s.muted}>{user.name} · {user.role.replace(/_/g, ' ')}</Text>
        </View>
        <Pressable onPress={onSignOut}><Text style={s.link}>Sign out</Text></Pressable>
      </View>
      <View style={s.flex}>
        {!open && <HomeScreen user={user} api={api} modules={modules} open={setOpen} />}
        {open === 'visits' && <VisitsScreen user={user} api={api} />}
        {open === 'orders' && <OrdersScreen user={user} api={api} />}
        {open === 'expenses' && <ExpensesScreen user={user} api={api} />}
        {open === 'attendance' && <AttendanceScreen user={user} api={api} />}
        {open === 'tours' && <ToursScreen api={api} />}
        {open === 'doctors' && <DoctorsScreen api={api} />}
        {open === 'chemists' && <ChemistsScreen api={api} />}
        {open === 'products' && <ProductsScreen api={api} />}
        {open === 'employees' && <EmployeesScreen api={api} />}
      </View>
    </View>
  );
}
