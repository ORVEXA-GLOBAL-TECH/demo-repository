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

const APP_USERS = [
  { role: 'MR', name: 'Amit Verma', title: 'Senior Medical Representative', territory: 'South Delhi & Noida', empId: 'ALV-MR-2026-089' },
  { role: 'ASM', name: 'Suresh Raina', title: 'Area Sales Manager (Field Leader)', territory: 'Delhi NCR Region', empId: 'ALV-ASM-2026-014' },
  { role: 'RSM', name: 'Priya Mukherjee', title: 'Regional Sales Manager (North)', territory: 'North Zone India', empId: 'ALV-RSM-2026-003' }
];

export default function ProfileScreen() {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const activeUser = APP_USERS[selectedUserIndex];

  const handleAttemptAdminLogin = () => {
    Alert.alert(
      'Access Restricted',
      '⚠️ Super Admin and Admin accounts have Web Portal access ONLY.\n\nPlease sign in using your desktop or laptop web browser to access the full national administrative dashboard.'
    );
  };

  const handleSync = () => {
    Alert.alert('Cloud Sync', `Offline DCRs, Orders, and GPS logs synced with central Node.js API server for ${activeUser.name}!`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{activeUser.name.split(' ').map(n=>n[0]).join('')}</Text>
        </View>
        <Text style={styles.name}>{activeUser.name}</Text>
        <Text style={styles.role}>{activeUser.title}</Text>
        <Text style={styles.empId}>Employee ID: {activeUser.empId}</Text>
        <View style={styles.badgeBoth}>
          <Text style={styles.badgeBothText}>✓ Authorized: Mobile App + Web Portal</Text>
        </View>
      </View>

      {/* Switch Mobile Persona */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👥 Switch Field Persona (Mobile App Enabled)</Text>
        <View style={styles.personaRow}>
          {APP_USERS.map((u, idx) => (
            <TouchableOpacity
              key={u.role}
              style={[styles.personaBtn, selectedUserIndex === idx && styles.personaBtnActive]}
              onPress={() => setSelectedUserIndex(idx)}
            >
              <Text style={[styles.personaBtnText, selectedUserIndex === idx && styles.personaBtnTextActive]}>
                {u.role}
              </Text>
              <Text style={[styles.personaSubText, selectedUserIndex === idx && styles.personaSubTextActive]}>
                {u.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Admin Test Button */}
        <TouchableOpacity style={styles.adminRestrictedBtn} onPress={handleAttemptAdminLogin}>
          <Text style={styles.adminRestrictedText}>🛡️ Admin / Super Admin (Web Only Info)</Text>
        </TouchableOpacity>
      </View>

      {/* Target Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Monthly Territory Target ({activeUser.role} View)</Text>
        
        <View style={styles.targetRow}>
          <Text style={styles.targetLabel}>Sales Achievement (₹4,50,000 Target):</Text>
          <Text style={styles.targetVal}>₹3,85,400 (85.6%)</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '85.6%' }]} />
        </View>

        <View style={[styles.targetRow, { marginTop: 12 }]}>
          <Text style={styles.targetLabel}>Doctor Call Coverage (220 Visits):</Text>
          <Text style={styles.targetVal}>198 Calls (90%)</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '90%', backgroundColor: '#0d9488' }]} />
        </View>
      </View>

      {/* Territory & HQ Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Headquarters & Hierarchy</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned Territory:</Text>
          <Text style={styles.infoValue}>{activeUser.territory}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform Authorization:</Text>
          <Text style={[styles.infoValue, { color: '#16a34a' }]}>Web Portal + Mobile App</Text>
        </View>
      </View>

      {/* Sync Button */}
      <TouchableOpacity style={styles.syncBtn} onPress={handleSync}>
        <Text style={styles.syncBtnText}>🔄 Manual Sync with Server</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800'
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text
  },
  role: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  empId: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4
  },
  badgeBoth: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  badgeBothText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '700'
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
  },
  personaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  personaBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  personaBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  personaBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  },
  personaBtnTextActive: {
    color: '#ffffff'
  },
  personaSubText: {
    fontSize: 10,
    color: colors.textSecondary
  },
  personaSubTextActive: {
    color: '#e0e7ff'
  },
  adminRestrictedBtn: {
    backgroundColor: '#fffbeb',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fde68a'
  },
  adminRestrictedText: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: '700'
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  targetLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  targetVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  syncBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6
  },
  syncBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800'
  }
});
