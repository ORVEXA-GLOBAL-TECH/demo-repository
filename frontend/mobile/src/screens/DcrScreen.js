import React, { useState, useEffect } from 'react';
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
import { fetchDoctors, fetchChemists, fetchProducts, submitDcrCall } from '../services/api';

export default function DcrScreen() {
  const [targetType, setTargetType] = useState('DOCTOR');
  const [doctors, setDoctors] = useState([]);
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [sampleQty, setSampleQty] = useState('2');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [d, c, p] = await Promise.all([fetchDoctors(), fetchChemists(), fetchProducts()]);
    setDoctors(d);
    setChemists(c);
    setProducts(p);
    if (d.length > 0) setSelectedTarget(d[0]);
  };

  const toggleProduct = (name) => {
    if (selectedProducts.includes(name)) {
      setSelectedProducts(selectedProducts.filter(p => p !== name));
    } else {
      setSelectedProducts([...selectedProducts, name]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTarget) {
      Alert.alert('Error', 'Please select a doctor or chemist');
      return;
    }
    if (!feedback) {
      Alert.alert('Error', 'Please enter visit remarks and feedback');
      return;
    }

    const payload = {
      targetType,
      targetId: selectedTarget.id,
      targetName: selectedTarget.name,
      hospital: selectedTarget.hospital || selectedTarget.contactPerson,
      productsDetailed: selectedProducts,
      feedback,
      samplesGiven: selectedProducts.map(p => ({ product: p, qty: Number(sampleQty) || 1 })),
      mrName: 'Amit Verma',
      mrId: 'usr-003',
      geoLat: 28.5284,
      geoLng: 77.2185
    };

    const res = await submitDcrCall(payload);
    Alert.alert('DCR Logged', `Call for ${selectedTarget.name} has been submitted successfully!`);
    setFeedback('');
    setSelectedProducts([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Record Field Call (DCR)</Text>
      <Text style={styles.headerSub}>GPS Geo-tagging enabled for Saket & South Delhi</Text>

      {/* Target Type Selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, targetType === 'DOCTOR' && styles.tabActive]}
          onPress={() => {
            setTargetType('DOCTOR');
            if (doctors.length > 0) setSelectedTarget(doctors[0]);
          }}
        >
          <Text style={[styles.tabText, targetType === 'DOCTOR' && styles.tabTextActive]}>
            👨‍⚕️ Doctor Visit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, targetType === 'CHEMIST' && styles.tabActive]}
          onPress={() => {
            setTargetType('CHEMIST');
            if (chemists.length > 0) setSelectedTarget(chemists[0]);
          }}
        >
          <Text style={[styles.tabText, targetType === 'CHEMIST' && styles.tabTextActive]}>
            🏪 Chemist Audit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Target Selection */}
      <Text style={styles.label}>Select {targetType === 'DOCTOR' ? 'Doctor' : 'Chemist'}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {(targetType === 'DOCTOR' ? doctors : chemists).map((item) => {
          const isSelected = selectedTarget?.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.selectCard, isSelected && styles.selectCardActive]}
              onPress={() => setSelectedTarget(item)}
            >
              <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.specialty || item.contactPerson || item.territory}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products Detailed */}
      <Text style={styles.label}>Products Detailed / Promoted</Text>
      <View style={styles.chipContainer}>
        {products.map((p) => {
          const isSelected = selectedProducts.includes(p.name);
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => toggleProduct(p.name)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {isSelected ? '✓ ' : '+ '} {p.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Samples Handed Over */}
      <Text style={styles.label}>Sample Quantity (Packs Handed Over)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={sampleQty}
        onChangeText={setSampleQty}
      />

      {/* Doctor Call Feedback */}
      <Text style={styles.label}>Call Discussion & Feedback Remarks</Text>
      <TextInput
        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
        multiline
        placeholder="Rx commitment, new therapy feedback, competitor activity..."
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit DCR Entry</Text>
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: colors.primary
  },
  tabText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.textSecondary
  },
  tabTextActive: {
    color: '#ffffff'
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12
  },
  horizontalScroll: {
    marginBottom: 8
  },
  selectCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    width: 180
  },
  selectCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  cardTitleActive: {
    color: colors.primary
  },
  cardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text
  },
  chipTextActive: {
    color: '#ffffff'
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 14,
    color: colors.text
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
