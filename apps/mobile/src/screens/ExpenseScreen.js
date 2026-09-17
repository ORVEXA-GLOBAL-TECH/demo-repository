import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { colors } from '../theme/colors';
import { submitExpenseClaim } from '../services/api';

export default function ExpenseScreen() {
  const [km, setKm] = useState('38');
  const [da, setDa] = useState('350');
  const [misc, setMisc] = useState('60');
  const [miscDetails, setMiscDetails] = useState('Doctor clinic parking charges');

  const fareRate = 4.5;
  const travelAllowance = (Number(km) || 0) * fareRate;
  const total = travelAllowance + (Number(da) || 0) + (Number(misc) || 0);

  const handleSubmit = async () => {
    const payload = {
      travelKm: Number(km),
      fareRatePerKm: fareRate,
      dailyAllowance: Number(da),
      hotelCharges: 0,
      miscellaneousCharges: Number(misc),
      miscDescription: miscDetails,
      mrName: 'Amit Verma',
      mrId: 'usr-003'
    };

    const res = await submitExpenseClaim(payload);
    Alert.alert('Expense Submitted', `TA/DA claim of ₹${total.toFixed(2)} submitted for manager approval.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Daily Field Expense Claim</Text>
      <Text style={styles.headerSub}>Automatic KM Allowance Calculation (₹4.50/KM)</Text>

      {/* Travel Allowance */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>🚗 Travel Allowance (TA)</Text>
        <Text style={styles.label}>Total Field Distance Covered (KM):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={km}
          onChangeText={setKm}
        />
        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Calculated TA ({km} KM × ₹{fareRate}):</Text>
          <Text style={styles.calcValue}>₹{travelAllowance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Daily Allowance */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>🍱 Daily Field Allowance (DA)</Text>
        <Text style={styles.label}>Standard Allowance (₹):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={da}
          onChangeText={setDa}
        />
      </View>

      {/* Miscellaneous */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>🧾 Parking & Toll Miscellany</Text>
        <Text style={styles.label}>Misc Amount (₹):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={misc}
          onChangeText={setMisc}
        />
        <Text style={styles.label}>Details / Purpose:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Hospital parking ticket"
          value={miscDetails}
          onChangeText={setMiscDetails}
        />
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Claim Submission:</Text>
        <Text style={styles.summaryAmount}>₹{total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Claim for Approval</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 6
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    fontSize: 13,
    color: colors.text
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  calcLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  calcValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  summaryCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    marginVertical: 10
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534'
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#15803d',
    marginTop: 4
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
