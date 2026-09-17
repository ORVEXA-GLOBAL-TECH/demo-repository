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
import { fetchChemists, fetchProducts, submitPobOrder } from '../services/api';

export default function OrderScreen() {
  const [chemists, setChemists] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedChemist, setSelectedChemist] = useState(null);
  const [cart, setCart] = useState({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [c, p] = await Promise.all([fetchChemists(), fetchProducts()]);
    setChemists(c);
    setProducts(p);
    if (c.length > 0) setSelectedChemist(c[0]);
  };

  const updateQuantity = (productId, delta) => {
    const current = cart[productId] || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      const copy = { ...cart };
      delete copy[productId];
      setCart(copy);
    } else {
      setCart({ ...cart, [productId]: next });
    }
  };

  const calculateTotal = () => {
    let sum = 0;
    Object.keys(cart).forEach((id) => {
      const prod = products.find(p => p.id === id);
      if (prod) sum += prod.ptr * cart[id];
    });
    return sum;
  };

  const handleBookOrder = async () => {
    const items = Object.keys(cart).map((id) => {
      const p = products.find(prod => prod.id === id);
      return {
        productId: p.id,
        productName: p.name,
        qty: cart[id],
        ptr: p.ptr,
        amount: cart[id] * p.ptr
      };
    });

    if (items.length === 0) {
      Alert.alert('Empty Order', 'Please add at least one product to the cart');
      return;
    }

    const payload = {
      chemistName: selectedChemist?.name || 'Selected Chemist',
      stockistName: selectedChemist?.preferredStockist || 'MedLife Distributors Ltd.',
      mrName: 'Amit Verma',
      mrId: 'usr-003',
      items,
      discountPercent: 5,
      remarks
    };

    const res = await submitPobOrder(payload);
    Alert.alert('POB Order Placed', `Order booked for ${payload.chemistName}! Total: ₹${calculateTotal().toFixed(2)}`);
    setCart({});
    setRemarks('');
  };

  const grandTotal = calculateTotal();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Personal Order Booking (POB)</Text>
      <Text style={styles.headerSub}>Chemist Order Generation & Stockist Routing</Text>

      {/* Chemist Selector */}
      <Text style={styles.label}>Select Retail Chemist</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {chemists.map((c) => {
          const isSelected = selectedChemist?.id === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.selectCard, isSelected && styles.selectCardActive]}
              onPress={() => setSelectedChemist(c)}
            >
              <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>{c.name}</Text>
              <Text style={styles.cardSub}>Stockist: {c.preferredStockist}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products & Quantity Selector */}
      <Text style={styles.label}>Select Products & Order Quantity</Text>
      <View style={styles.productList}>
        {products.map((prod) => {
          const qty = cart[prod.id] || 0;
          return (
            <View key={prod.id} style={styles.productRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prodName}>{prod.name}</Text>
                <Text style={styles.prodMeta}>PTR: ₹{prod.ptr?.toFixed(2)} • {prod.category}</Text>
              </View>
              <View style={styles.qtyControl}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(prod.id, -10)}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(prod.id, 10)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Order Remarks */}
      <Text style={styles.label}>Order Instructions / Remarks</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Deliver before weekend stock audit"
        value={remarks}
        onChangeText={setRemarks}
      />

      {/* Total Card */}
      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Gross Order Value:</Text>
          <Text style={styles.totalVal}>₹{grandTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.discountLabel}>Trade Discount (5%):</Text>
          <Text style={styles.discountVal}>- ₹{(grandTotal * 0.05).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#e2e8f0' }]}>
          <Text style={styles.netLabel}>Net Payable Value:</Text>
          <Text style={styles.netVal}>₹{(grandTotal * 0.95).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, grandTotal === 0 && { opacity: 0.6 }]}
        onPress={handleBookOrder}
        disabled={grandTotal === 0}
      >
        <Text style={styles.submitBtnText}>Confirm & Book POB Order</Text>
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
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12
  },
  selectCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    width: 200
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
  productList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  prodName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  prodMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe'
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  qtyVal: {
    fontSize: 14,
    fontWeight: '700',
    width: 30,
    textAlign: 'center'
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 13,
    color: colors.text
  },
  totalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  totalVal: {
    fontSize: 13,
    fontWeight: '700'
  },
  discountLabel: {
    fontSize: 13,
    color: '#059669'
  },
  discountVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669'
  },
  netLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  netVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
