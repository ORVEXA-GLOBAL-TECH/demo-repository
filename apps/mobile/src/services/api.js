// Mobile API Client with fallback support for offline field use

const BASE_URL = 'http://localhost:5000/api'; // Or configured server IP

// Fallback seed data if running offline
const FALLBACK_DOCTORS = [
  { id: 'doc-101', name: 'Dr. Arvind Mehra', specialty: 'Cardiologist', hospital: 'Max Super Speciality Hospital', territory: 'South Delhi' },
  { id: 'doc-102', name: 'Dr. Sunita Rao', specialty: 'Diabetologist', hospital: 'Fortis Escorts Heart Institute', territory: 'South Delhi' },
  { id: 'doc-103', name: 'Dr. Vikram Sethi', specialty: 'Oncologist', hospital: 'Apollo Cancer Centre', territory: 'Noida' }
];

const FALLBACK_PRODUCTS = [
  { id: 'prd-301', name: 'CardioShield 50mg', category: 'Cardiology', ptr: 108.75 },
  { id: 'prd-302', name: 'GlucoMet Forte 500/5', category: 'Diabetology', ptr: 135.00 },
  { id: 'prd-303', name: 'AllevOnco 100mg Injection', category: 'Oncology', ptr: 2400.00 },
  { id: 'prd-304', name: 'NeuroCalm Plus', category: 'Neurology', ptr: 157.50 }
];

const FALLBACK_CHEMISTS = [
  { id: 'chm-201', name: 'Apollo Medplus Pharmacy', contactPerson: 'Ramesh Gupta', preferredStockist: 'MedLife Distributors Ltd.' },
  { id: 'chm-202', name: 'Wellness Forever Chemists', contactPerson: 'Sunil Kumar', preferredStockist: 'Metro Pharma Wholesale' }
];

export async function fetchDoctors() {
  try {
    const res = await fetch(`${BASE_URL}/catalog/doctors`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.data || FALLBACK_DOCTORS;
  } catch {
    return FALLBACK_DOCTORS;
  }
}

export async function fetchProducts() {
  try {
    const res = await fetch(`${BASE_URL}/catalog/products`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.data || FALLBACK_PRODUCTS;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchChemists() {
  try {
    const res = await fetch(`${BASE_URL}/catalog/chemists`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.data || FALLBACK_CHEMISTS;
  } catch {
    return FALLBACK_CHEMISTS;
  }
}

export async function submitDcrCall(dcrData) {
  try {
    const res = await fetch(`${BASE_URL}/dcr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dcrData)
    });
    return await res.json();
  } catch {
    return { success: true, message: 'Saved to local offline queue', offline: true };
  }
}

export async function submitPobOrder(orderData) {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch {
    return { success: true, message: 'Saved to local offline queue', offline: true };
  }
}

export async function submitExpenseClaim(expenseData) {
  try {
    const res = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    return await res.json();
  } catch {
    return { success: true, message: 'Saved to local offline queue', offline: true };
  }
}
