import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTenants } from '../services/api';

const TenantThemeContext = createContext(null);

// Curated default enterprise tenants if API is loading or offline
export const FALLBACK_TENANTS = [
  {
    id: 'tc-alleviare',
    code: 'alleviare',
    name: 'Alleviare Health Sciences',
    legal_name: 'Alleviare LifeSciences International Ltd.',
    brand_primary_color: '#2563eb',
    logo_url: '',
    country_code: 'IN',
    country_name: 'India',
    currency_code: 'INR',
    currency_symbol: '₹',
    plan: 'ENTERPRISE',
    status: 'Active',
    subdomain: 'alleviare.alleviaresfa.com',
    industry_segment: 'Pharmaceuticals & Biologics',
    default_timezone: 'Asia/Kolkata'
  },
  {
    id: 'tc-pfizer',
    code: 'pfizer',
    name: 'Pfizer BioPharma Global',
    legal_name: 'Pfizer Specialty Therapeutics Ltd.',
    brand_primary_color: '#0284c7',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_%282021%29.svg',
    country_code: 'US',
    country_name: 'United States',
    currency_code: 'USD',
    currency_symbol: '$',
    plan: 'ENTERPRISE_SOVEREIGN',
    status: 'Active',
    subdomain: 'pfizer.alleviaresfa.com',
    industry_segment: 'Vaccines & Oncology',
    default_timezone: 'America/New_York'
  },
  {
    id: 'tc-novartis',
    code: 'novartis',
    name: 'Novartis Healthcare',
    legal_name: 'Novartis Pharma AG',
    brand_primary_color: '#7c3aed',
    logo_url: '',
    country_code: 'CH',
    country_name: 'Switzerland',
    currency_code: 'EUR',
    currency_symbol: '€',
    plan: 'PROFESSIONAL',
    status: 'Active',
    subdomain: 'novartis.alleviaresfa.com',
    industry_segment: 'Cardiovascular & Immunology',
    default_timezone: 'Europe/Zurich'
  },
  {
    id: 'tc-sunpharma',
    code: 'sunpharma',
    name: 'Sun Pharma Industries',
    legal_name: 'Sun Pharmaceutical Industries Ltd.',
    brand_primary_color: '#ea580c',
    logo_url: '',
    country_code: 'IN',
    country_name: 'India',
    currency_code: 'INR',
    currency_symbol: '₹',
    plan: 'ENTERPRISE',
    status: 'Active',
    subdomain: 'sunpharma.alleviaresfa.com',
    industry_segment: 'Generic Formulations & API',
    default_timezone: 'Asia/Kolkata'
  },
  {
    id: 'tc-astrazeneca',
    code: 'astrazeneca',
    name: 'AstraZeneca Biologics',
    legal_name: 'AstraZeneca Oncology Division',
    brand_primary_color: '#059669',
    logo_url: '',
    country_code: 'GB',
    country_name: 'United Kingdom',
    currency_code: 'GBP',
    currency_symbol: '£',
    plan: 'GROWTH',
    status: 'Active',
    subdomain: 'astrazeneca.alleviaresfa.com',
    industry_segment: 'Respiratory & Immunology',
    default_timezone: 'Europe/London'
  },
  {
    id: 'tc-drreddys',
    code: 'drreddys',
    name: 'Dr. Reddy’s Laboratories',
    legal_name: 'Dr. Reddy’s Labs SFA Enterprise',
    brand_primary_color: '#dc2626',
    logo_url: '',
    country_code: 'IN',
    country_name: 'India',
    currency_code: 'INR',
    currency_symbol: '₹',
    plan: 'ENTERPRISE',
    status: 'Active',
    subdomain: 'drreddys.alleviaresfa.com',
    industry_segment: 'Generics & Biosimilars',
    default_timezone: 'Asia/Kolkata'
  }
];

// Helper to darken a hex color for hover states
function adjustColorBrightness(hex, percent) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return '#1d4ed8';
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return '#1d4ed8';
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Convert hex to rgb components
function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return '37, 99, 235';
  const c = hex.replace('#', '');
  if (c.length === 3) {
    const r = parseInt(c[0] + c[0], 16);
    const g = parseInt(c[1] + c[1], 16);
    const b = parseInt(c[2] + c[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '37, 99, 235';
}

export function TenantThemeProvider({ children }) {
  const [tenants, setTenants] = useState(FALLBACK_TENANTS);
  const [activeTenant, setActiveTenantState] = useState(() => {
    try {
      const saved = localStorage.getItem('orvexa_active_tenant');
      return saved ? JSON.parse(saved) : FALLBACK_TENANTS[0];
    } catch {
      return FALLBACK_TENANTS[0];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Apply tenant theme CSS variables to document root
  const applyTenantTheme = (tenant) => {
    if (!tenant) return;
    const primaryColor = tenant.brand_primary_color || tenant.brandPrimaryColor || '#2563eb';
    const primaryHover = adjustColorBrightness(primaryColor, -25);
    const primaryRgb = hexToRgb(primaryColor);

    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--primary-hover', primaryHover);
    root.style.setProperty('--primary-light', `rgba(${primaryRgb}, 0.08)`);
    root.style.setProperty('--primary-glow', `rgba(${primaryRgb}, 0.22)`);
    root.style.setProperty('--primary-border', `rgba(${primaryRgb}, 0.35)`);
    root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${primaryColor}, ${primaryHover})`);

    // Dynamically update document title
    if (typeof document !== 'undefined') {
      document.title = `${tenant.name || 'Company'} - SFA Admin Portal`;
    }
  };

  // Set active tenant and persist
  const setActiveTenant = (tenant) => {
    if (!tenant) return;
    setActiveTenantState(tenant);
    applyTenantTheme(tenant);
    try {
      localStorage.setItem('orvexa_active_tenant', JSON.stringify(tenant));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Fetch tenants on mount
  useEffect(() => {
    loadTenants();
  }, []);

  // Re-apply theme when active tenant changes
  useEffect(() => {
    if (activeTenant) {
      applyTenantTheme(activeTenant);
    }
  }, [activeTenant]);

  const loadTenants = async () => {
    setIsLoading(true);
    try {
      const res = await getTenants();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Merge DB tenants with fallback list (avoiding duplicate codes)
        const dbList = res.data;
        const seenCodes = new Set(dbList.map(t => (t.code || t.name || '').toLowerCase()));
        const merged = [...dbList];

        FALLBACK_TENANTS.forEach(fb => {
          if (!seenCodes.has((fb.code || fb.name || '').toLowerCase())) {
            merged.push(fb);
          }
        });

        setTenants(merged);

        // If activeTenant matches one in the list, refresh its data
        const currentMatch = merged.find(
          t => t.id === activeTenant?.id || (t.code && t.code.toLowerCase() === activeTenant?.code?.toLowerCase())
        );
        if (currentMatch) {
          setActiveTenantState(currentMatch);
          applyTenantTheme(currentMatch);
        }
      }
    } catch (err) {
      console.warn('Backend tenants load fallback to default companies:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TenantThemeContext.Provider
      value={{
        tenants,
        activeTenant,
        setActiveTenant,
        refreshTenants: loadTenants,
        isLoading,
        applyTenantTheme
      }}
    >
      {children}
    </TenantThemeContext.Provider>
  );
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext);
  if (!context) {
    throw new Error('useTenantTheme must be used within a TenantThemeProvider');
  }
  return context;
}
