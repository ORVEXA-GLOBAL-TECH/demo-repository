import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const handleSync = () => {
    Alert.alert('Cloud Sync', 'Offline DCRs, Orders and GPS logs synced with central Node.js API server!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AV</Text>
        </View>
        <Text style={styles.name}>Amit Verma</Text>
        <Text style={styles.role}>Medical Representative (Cardio & Diab)</Text>
        <Text style={styles.empId}>Employee ID: ALV-MR-2026-089</Text>
      </View>

      {/* Target Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Monthly Target Achievement (Sept 2026)</Text>
        
        <View style={styles.targetRow}>
          <Text style={styles.targetLabel}>Sales Target (₹4,50,000):</Text>
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
          <Text style={styles.infoLabel}>Headquarter:</Text>
          <Text style={styles.infoValue}>South Delhi (Saket Base)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reporting Manager:</Text>
          <Text style={styles.infoValue}>Priya Mukherjee (RSM)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Zone:</Text>
          <Text style={styles.infoValue}>North Zone India</Text>
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
    marginTop: 2
  },
  empId: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4
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
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
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
