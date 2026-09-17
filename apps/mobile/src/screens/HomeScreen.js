import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [dayStarted, setDayStarted] = useState(true);
  const [punchTime, setPunchTime] = useState('09:15 AM');

  const handleToggleDay = () => {
    if (dayStarted) {
      Alert.alert('End Day', 'Are you sure you want to punch out and end your field reporting for today?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Day', onPress: () => setDayStarted(false) }
      ]);
    } else {
      setDayStarted(true);
      setPunchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      Alert.alert('GPS Punch-In Success', 'Day started! Location: Saket Sector 4 (28.5284, 77.2185)');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeSub}>Welcome back,</Text>
          <Text style={styles.welcomeName}>Amit Verma (MR)</Text>
          <Text style={styles.territory}>South Delhi & Noida Territory</Text>
        </View>
        <TouchableOpacity
          style={[styles.punchBtn, { backgroundColor: dayStarted ? '#ef4444' : '#10b981' }]}
          onPress={handleToggleDay}
        >
          <Text style={styles.punchBtnText}>{dayStarted ? 'End Day' : 'Start Day'}</Text>
        </TouchableOpacity>
      </View>

      {/* GPS Status Card */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: dayStarted ? '#10b981' : '#94a3b8' }]} />
          <Text style={styles.statusText}>
            {dayStarted ? `Day Active (Punched In at ${punchTime})` : 'Day Inactive (Punched Out)'}
          </Text>
        </View>
        <Text style={styles.gpsCoord}>GPS: 28.5284° N, 77.2185° E (Accuracy: High)</Text>
      </View>

      {/* KPI Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>8 / 10</Text>
          <Text style={styles.statLabel}>Doctor Calls</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>3 / 4</Text>
          <Text style={styles.statLabel}>Chemist Audits</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>₹30.9k</Text>
          <Text style={styles.statLabel}>POB Value</Text>
        </View>
      </View>

      {/* Quick Action Grid */}
      <Text style={styles.sectionHeading}>Quick Field Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}
          onPress={() => navigation.navigate('DCR')}
        >
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={[styles.actionTitle, { color: '#1d4ed8' }]}>Log DCR Call</Text>
          <Text style={styles.actionDesc}>Record doctor/chemist visit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={[styles.actionTitle, { color: '#15803d' }]}>Book POB Order</Text>
          <Text style={styles.actionDesc}>Order direct to stockist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}
          onPress={() => navigation.navigate('Expenses')}
        >
          <Text style={styles.actionIcon}>💳</Text>
          <Text style={[styles.actionTitle, { color: '#c2410c' }]}>File TA / DA</Text>
          <Text style={styles.actionDesc}>Kilometer allowance claim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={[styles.actionTitle, { color: '#7e22ce' }]}>My Profile</Text>
          <Text style={styles.actionDesc}>Target & territory status</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Schedule */}
      <Text style={styles.sectionHeading}>Today's Scheduled Calls</Text>
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>10:00 AM</Text>
          <View style={styles.scheduleInfo}>
            <Text style={styles.docName}>Dr. Arvind Mehra (Cardiologist)</Text>
            <Text style={styles.docLoc}>Max Hospital, Saket • Focus: CardioShield 50mg</Text>
          </View>
          <Text style={styles.badgeDone}>Done</Text>
        </View>

        <View style={styles.scheduleDivider} />

        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>12:30 PM</Text>
          <View style={styles.scheduleInfo}>
            <Text style={styles.docName}>Apollo Medplus Pharmacy</Text>
            <Text style={styles.docLoc}>Saket Community Center • POB & Stock Audit</Text>
          </View>
          <Text style={styles.badgeDone}>Done</Text>
        </View>

        <View style={styles.scheduleDivider} />

        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>03:00 PM</Text>
          <View style={styles.scheduleInfo}>
            <Text style={styles.docName}>Dr. Sunita Rao (Diabetologist)</Text>
            <Text style={styles.docLoc}>Fortis Escorts • Focus: GlucoMet Forte</Text>
          </View>
          <Text style={styles.badgePending}>Upcoming</Text>
        </View>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8
  },
  welcomeSub: {
    fontSize: 13,
    color: colors.textSecondary
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  territory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600'
  },
  punchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  punchBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  gpsCoord: {
    fontSize: 12,
    color: colors.textSecondary
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600'
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  actionDesc: {
    fontSize: 11,
    color: colors.textSecondary
  },
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    width: 65
  },
  scheduleInfo: {
    flex: 1,
    paddingHorizontal: 8
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  docLoc: {
    fontSize: 11,
    color: colors.textSecondary
  },
  badgeDone: {
    fontSize: 10,
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontWeight: '700'
  },
  badgePending: {
    fontSize: 10,
    color: '#d97706',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    fontWeight: '700'
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4
  }
});
