import { query, checkDbHealth } from '../config/db.js';

// 24 Sovereign Countries Registry Data
export const SOVEREIGN_COUNTRIES = [
  // Southeast Asia
  { code: 'VN', name: 'Vietnam', native_name: 'Việt Nam', currency_code: 'VND', currency_symbol: '₫', primary_timezone: 'Asia/Ho_Chi_Minh', calling_code: '+84', tax_scheme: 'VAT 8/10%', social_security: 'VSS (Social/Health)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Drug Administration of Vietnam (DAV)' },
  { code: 'KH', name: 'Cambodia', native_name: 'កម្ពុជា', currency_code: 'KHR', currency_symbol: '៛', primary_timezone: 'Asia/Phnom_Penh', calling_code: '+855', tax_scheme: 'VAT 10%', social_security: 'NSSF (Cambodia)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Department of Drugs & Food (DDF)' },
  { code: 'LA', name: 'Laos', native_name: 'ປະເທດລາວ', currency_code: 'LAK', currency_symbol: '₭', primary_timezone: 'Asia/Vientiane', calling_code: '+856', tax_scheme: 'VAT 10%', social_security: 'NSSF Laos', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Food and Drug Department (FDD Laos)' },
  { code: 'TH', name: 'Thailand', native_name: 'ประเทศไทย', currency_code: 'THB', currency_symbol: '฿', primary_timezone: 'Asia/Bangkok', calling_code: '+66', tax_scheme: 'VAT 7%', social_security: 'SSO Thailand', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Thai Food and Drug Administration (FDA)' },
  { code: 'MM', name: 'Myanmar', native_name: 'မြန်မာ', currency_code: 'MMK', currency_symbol: 'K', primary_timezone: 'Asia/Yangon', calling_code: '+95', tax_scheme: 'Commercial Tax 5%', social_security: 'SSB Myanmar', fiscal_year: 'Oct 01 - Sep 30', regulatory_body: 'FDA Myanmar' },
  { code: 'MY', name: 'Malaysia', native_name: 'Malaysia', currency_code: 'MYR', currency_symbol: 'RM', primary_timezone: 'Asia/Kuala_Lumpur', calling_code: '+60', tax_scheme: 'SST 6/8%', social_security: 'EPF + SOCSO', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'National Pharmaceutical Regulatory Agency (NPRA)' },
  { code: 'SG', name: 'Singapore', native_name: 'Singapore', currency_code: 'SGD', currency_symbol: 'S$', primary_timezone: 'Asia/Singapore', calling_code: '+65', tax_scheme: 'GST 9%', social_security: 'CPF (Central Provident Fund)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Health Sciences Authority (HSA)' },
  { code: 'ID', name: 'Indonesia', native_name: 'Indonesia', currency_code: 'IDR', currency_symbol: 'Rp', primary_timezone: 'Asia/Jakarta', calling_code: '+62', tax_scheme: 'PPN 11%', social_security: 'BPJS Ketenagakerjaan', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'BPOM (Badan POM)' },
  { code: 'PH', name: 'Philippines', native_name: 'Pilipinas', currency_code: 'PHP', currency_symbol: '₱', primary_timezone: 'Asia/Manila', calling_code: '+63', tax_scheme: 'VAT 12%', social_security: 'SSS + PhilHealth', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Food and Drug Administration Philippines' },

  // South Asia
  { code: 'IN', name: 'India', native_name: 'भारत', currency_code: 'INR', currency_symbol: '₹', primary_timezone: 'Asia/Kolkata', calling_code: '+91', tax_scheme: 'GST (5/12/18%)', social_security: 'EPFO + ESIC', fiscal_year: 'Apr 01 - Mar 31', regulatory_body: 'CDSCO (Central Drugs Standard Control)' },
  { code: 'BD', name: 'Bangladesh', native_name: 'বাংলাদেশ', currency_code: 'BDT', currency_symbol: '৳', primary_timezone: 'Asia/Dhaka', calling_code: '+880', tax_scheme: 'VAT 15%', social_security: 'Labor Act Gratuity', fiscal_year: 'Jul 01 - Jun 30', regulatory_body: 'DGDA (Directorate General of Drug Admin)' },
  { code: 'NP', name: 'Nepal', native_name: 'नेपाल', currency_code: 'NPR', currency_symbol: '₨', primary_timezone: 'Asia/Kathmandu', calling_code: '+977', tax_scheme: 'VAT 13%', social_security: 'SSF (Social Security Fund)', fiscal_year: 'Jul 16 - Jul 15', regulatory_body: 'Department of Drug Administration (DDA Nepal)' },
  { code: 'LK', name: 'Sri Lanka', native_name: 'ශ්‍රී ලංකාව', currency_code: 'LKR', currency_symbol: 'Rs', primary_timezone: 'Asia/Colombo', calling_code: '+94', tax_scheme: 'VAT 18%', social_security: 'EPF + ETF', fiscal_year: 'Apr 01 - Mar 31', regulatory_body: 'National Medicines Regulatory Authority (NMRA)' },

  // Middle East / GCC
  { code: 'AE', name: 'United Arab Emirates', native_name: 'دولة الإمارات', currency_code: 'AED', currency_symbol: 'د.إ', primary_timezone: 'Asia/Dubai', calling_code: '+971', tax_scheme: 'VAT 5% + CT 9%', social_security: 'GPSSA Pension', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'MoHAP (Ministry of Health & Prevention)' },
  { code: 'SA', name: 'Saudi Arabia', native_name: 'المملكة العربية السعودية', currency_code: 'SAR', currency_symbol: '﷼', primary_timezone: 'Asia/Riyadh', calling_code: '+966', tax_scheme: 'VAT 15% (ZATCA)', social_security: 'GOSI Saudi', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Saudi Food and Drug Authority (SFDA)' },
  { code: 'QA', name: 'Qatar', native_name: 'دولة قطر', currency_code: 'QAR', currency_symbol: 'ر.ق', primary_timezone: 'Asia/Qatar', calling_code: '+974', tax_scheme: 'Zero VAT (Corporate Tax 10%)', social_security: 'GRSIA Qatar', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Ministry of Public Health (MOPH Qatar)' },
  { code: 'OM', name: 'Oman', native_name: 'سلطنة عمان', currency_code: 'OMR', currency_symbol: 'ر.ع.', primary_timezone: 'Asia/Muscat', calling_code: '+968', tax_scheme: 'VAT 5%', social_security: 'PASI Oman', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Directorate General of Pharmaceutical Affairs' },

  // East Asia & Pacific
  { code: 'JP', name: 'Japan', native_name: '日本', currency_code: 'JPY', currency_symbol: '¥', primary_timezone: 'Asia/Tokyo', calling_code: '+81', tax_scheme: 'Consumption Tax 10%', social_security: 'Shakai Hoken (Nenkin)', fiscal_year: 'Apr 01 - Mar 31', regulatory_body: 'PMDA (Pharmaceuticals and Medical Devices Agency)' },
  { code: 'KR', name: 'South Korea', native_name: '대한민국', currency_code: 'KRW', currency_symbol: '₩', primary_timezone: 'Asia/Seoul', calling_code: '+82', tax_scheme: 'VAT 10%', social_security: '4 Major Insurances (NHIS/NPS)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Ministry of Food and Drug Safety (MFDS)' },
  { code: 'AU', name: 'Australia', native_name: 'Australia', currency_code: 'AUD', currency_symbol: 'A$', primary_timezone: 'Australia/Sydney', calling_code: '+61', tax_scheme: 'GST 10%', social_security: 'Superannuation 11.5%', fiscal_year: 'Jul 01 - Jun 30', regulatory_body: 'Therapeutic Goods Administration (TGA)' },

  // Europe & Americas
  { code: 'GB', name: 'United Kingdom', native_name: 'United Kingdom', currency_code: 'GBP', currency_symbol: '£', primary_timezone: 'Europe/London', calling_code: '+44', tax_scheme: 'VAT 20%', social_security: 'National Insurance (NIC)', fiscal_year: 'Apr 06 - Apr 05', regulatory_body: 'MHRA (Medicines and Healthcare products)' },
  { code: 'DE', name: 'Germany', native_name: 'Deutschland', currency_code: 'EUR', currency_symbol: '€', primary_timezone: 'Europe/Berlin', calling_code: '+49', tax_scheme: 'VAT (MwSt 19%)', social_security: 'Social Insurance (DRV/GKV)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'BfArM (Federal Institute for Drugs)' },
  { code: 'US', name: 'United States', native_name: 'United States', currency_code: 'USD', currency_symbol: '$', primary_timezone: 'America/New_York', calling_code: '+1', tax_scheme: 'State Sales Tax (0-10%)', social_security: 'FICA (Social Security & Medicare)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'US Food and Drug Administration (FDA)' },
  { code: 'CA', name: 'Canada', native_name: 'Canada', currency_code: 'CAD', currency_symbol: 'CA$', primary_timezone: 'America/Toronto', calling_code: '+1', tax_scheme: 'GST/HST (5-15%)', social_security: 'CPP + EI (Canada Pension)', fiscal_year: 'Jan 01 - Dec 31', regulatory_body: 'Health Canada (Santé Canada)' },
];

async function seedDatabase() {
  console.log('🌱 Starting Database Seeding Process...');
  const health = await checkDbHealth();

  if (health.status !== 'CONNECTED') {
    console.error('❌ Cannot seed database: PostgreSQL is not connected.');
    process.exit(1);
  }

  try {
    // 1. Seed Sovereign Countries
    console.log(`🌍 Seeding ${SOVEREIGN_COUNTRIES.length} Sovereign Country Markets...`);
    for (const c of SOVEREIGN_COUNTRIES) {
      await query(`
        INSERT INTO sovereign_countries (
          code, name, native_name, currency_code, currency_symbol, 
          primary_timezone, calling_code, tax_scheme, social_security, 
          fiscal_year, regulatory_body, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          native_name = EXCLUDED.native_name,
          currency_code = EXCLUDED.currency_code,
          currency_symbol = EXCLUDED.currency_symbol,
          primary_timezone = EXCLUDED.primary_timezone,
          calling_code = EXCLUDED.calling_code,
          tax_scheme = EXCLUDED.tax_scheme,
          social_security = EXCLUDED.social_security,
          fiscal_year = EXCLUDED.fiscal_year,
          regulatory_body = EXCLUDED.regulatory_body;
      `, [
        c.code, c.name, c.native_name, c.currency_code, c.currency_symbol,
        c.primary_timezone, c.calling_code, c.tax_scheme, c.social_security,
        c.fiscal_year, c.regulatory_body
      ]);
    }
    console.log('✅ Sovereign countries seeded successfully!');

    // 2. Check if Super Admin exists, if not create default
    const adminCheck = await query(`
      SELECT id, email FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1
    `);

    if (adminCheck.rows.length === 0) {
      console.log('👑 Creating Master Platform Super Admin...');
      // bcrypt hash for 'SuperAdmin@2026!'
      const defaultHash = '$2b$10$wN3/sQjW3g2fGjW10K6gxe4zW5i3.QYlUv6.e/9kQxP0oVp5E7kKG';
      
      await query(`
        INSERT INTO users (
          email, password_hash, first_name, last_name, role, status
        )
        VALUES ($1, $2, $3, $4, 'SUPER_ADMIN', 'Active')
      `, ['superadmin@alleviaresfa.com', defaultHash, 'System', 'SuperAdmin']);
      console.log('✅ Default Super Admin created: superadmin@alleviaresfa.com');
    } else {
      console.log(`ℹ️ Super Admin already exists (${adminCheck.rows[0].email})`);
    }

    // 3. Check and log tenant counts
    const tenantCountRes = await query('SELECT count(*) as count FROM tenants_companies');
    console.log(`🏢 Active Tenant Companies in DB: ${tenantCountRes.rows[0].count}`);

    console.log('\n🎉 [COMPLETE] Database seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    process.exit(1);
  }
}

// Only run immediately if invoked directly via CLI (e.g. node seed.js or npm run db:seed)
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js')) {
  seedDatabase();
}

export { seedDatabase };
