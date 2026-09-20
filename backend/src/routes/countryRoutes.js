import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';
import { SOVEREIGN_COUNTRIES } from '../db/seed.js';

const router = Router();

// GET /api/sovereign-countries - List all sovereign country compliance records
router.get('/', async (req, res) => {
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM sovereign_countries ORDER BY name ASC');
      if (dbRes.rows.length > 0) {
        return res.json({ success: true, count: dbRes.rows.length, data: dbRes.rows });
      }
    }
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  } catch (err) {
    return res.json({ success: true, count: SOVEREIGN_COUNTRIES.length, data: SOVEREIGN_COUNTRIES });
  }
});

// POST /api/sovereign-countries - Register new sovereign jurisdiction
router.post('/', async (req, res) => {
  const {
    code,
    name,
    nativeName,
    currencyCode,
    currencySymbol,
    primaryTimezone,
    callingCode,
    taxScheme,
    socialSecurity,
    fiscalYear,
    regulatoryBody,
    fxRateToUSD,
    fx_rate_to_usd
  } = req.body;

  if (!code || !name || !currencyCode) {
    return res.status(400).json({ success: false, message: 'Country code, name, and currency are required.' });
  }

  const effectiveFx = Number(fxRateToUSD || fx_rate_to_usd || 1.0);

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const insertRes = await query(`
        INSERT INTO sovereign_countries (
          code, name, native_name, currency_code, currency_symbol,
          primary_timezone, calling_code, tax_scheme, social_security,
          fiscal_year, regulatory_body, is_active, fx_rate_to_usd
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12)
        ON CONFLICT (code) DO UPDATE
        SET name = EXCLUDED.name,
            currency_code = EXCLUDED.currency_code,
            currency_symbol = EXCLUDED.currency_symbol,
            primary_timezone = EXCLUDED.primary_timezone,
            tax_scheme = EXCLUDED.tax_scheme,
            fiscal_year = EXCLUDED.fiscal_year,
            regulatory_body = EXCLUDED.regulatory_body,
            fx_rate_to_usd = EXCLUDED.fx_rate_to_usd
        RETURNING *;
      `, [
        code.toUpperCase().trim(),
        name.trim(),
        nativeName || name,
        currencyCode.toUpperCase().trim(),
        currencySymbol || '$',
        primaryTimezone || 'UTC',
        callingCode || '+1',
        taxScheme || 'Standard Tax',
        socialSecurity || 'Statutory Social Care',
        fiscalYear || 'January - December',
        regulatoryBody || 'Ministry of Health',
        effectiveFx
      ]).catch(async (err) => {
        // Fallback if fx_rate_to_usd column doesn't exist yet
        return await query(`
          INSERT INTO sovereign_countries (
            code, name, native_name, currency_code, currency_symbol,
            primary_timezone, calling_code, tax_scheme, social_security,
            fiscal_year, regulatory_body, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
          ON CONFLICT (code) DO UPDATE
          SET name = EXCLUDED.name,
              currency_code = EXCLUDED.currency_code,
              currency_symbol = EXCLUDED.currency_symbol,
              primary_timezone = EXCLUDED.primary_timezone,
              tax_scheme = EXCLUDED.tax_scheme,
              fiscal_year = EXCLUDED.fiscal_year,
              regulatory_body = EXCLUDED.regulatory_body
          RETURNING *;
        `, [
          code.toUpperCase().trim(),
          name.trim(),
          nativeName || name,
          currencyCode.toUpperCase().trim(),
          currencySymbol || '$',
          primaryTimezone || 'UTC',
          callingCode || '+1',
          taxScheme || 'Standard Tax',
          socialSecurity || 'Statutory Social Care',
          fiscalYear || 'January - December',
          regulatoryBody || 'Ministry of Health'
        ]);
      });

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SOVEREIGN_COUNTRY_SAVED',
        'sovereign_countries',
        code,
        JSON.stringify({ country: name, code, fxRate: effectiveFx })
      ]).catch(() => {});

      return res.status(201).json({
        success: true,
        message: `Sovereign Country ${name} registered successfully.`,
        data: insertRes.rows[0]
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Country registered in demo mode.',
      data: req.body
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/sovereign-countries/:code - Update country compliance parameters
router.put('/:code', async (req, res) => {
  const { code } = req.params;
  const {
    name,
    nativeName,
    currencyCode,
    currencySymbol,
    primaryTimezone,
    taxScheme,
    socialSecurity,
    fiscalYear,
    regulatoryBody,
    isActive,
    fxRateToUSD,
    fx_rate_to_usd
  } = req.body;

  const effectiveFx = fxRateToUSD !== undefined ? Number(fxRateToUSD) : (fx_rate_to_usd !== undefined ? Number(fx_rate_to_usd) : null);

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const updateRes = await query(`
        UPDATE sovereign_countries
        SET
          name = COALESCE($1, name),
          native_name = COALESCE($2, native_name),
          currency_code = COALESCE($3, currency_code),
          currency_symbol = COALESCE($4, currency_symbol),
          primary_timezone = COALESCE($5, primary_timezone),
          tax_scheme = COALESCE($6, tax_scheme),
          social_security = COALESCE($7, social_security),
          fiscal_year = COALESCE($8, fiscal_year),
          regulatory_body = COALESCE($9, regulatory_body),
          is_active = COALESCE($10, is_active),
          fx_rate_to_usd = COALESCE($11, fx_rate_to_usd)
        WHERE code = $12
        RETURNING *;
      `, [
        name,
        nativeName,
        currencyCode,
        currencySymbol,
        primaryTimezone,
        taxScheme,
        socialSecurity,
        fiscalYear,
        regulatoryBody,
        isActive,
        effectiveFx,
        code.toUpperCase()
      ]).catch(async () => {
        // Fallback if fx_rate_to_usd column doesn't exist
        return await query(`
          UPDATE sovereign_countries
          SET
            name = COALESCE($1, name),
            native_name = COALESCE($2, native_name),
            currency_code = COALESCE($3, currency_code),
            currency_symbol = COALESCE($4, currency_symbol),
            primary_timezone = COALESCE($5, primary_timezone),
            tax_scheme = COALESCE($6, tax_scheme),
            social_security = COALESCE($7, social_security),
            fiscal_year = COALESCE($8, fiscal_year),
            regulatory_body = COALESCE($9, regulatory_body),
            is_active = COALESCE($10, is_active)
          WHERE code = $11
          RETURNING *;
        `, [
          name,
          nativeName,
          currencyCode,
          currencySymbol,
          primaryTimezone,
          taxScheme,
          socialSecurity,
          fiscalYear,
          regulatoryBody,
          isActive,
          code.toUpperCase()
        ]);
      });

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Country not found.' });
      }

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SOVEREIGN_COUNTRY_UPDATED',
        'sovereign_countries',
        code,
        JSON.stringify({ code, changes: req.body })
      ]).catch(() => {});

      return res.json({
        success: true,
        message: `Sovereign country ${code} updated.`,
        data: updateRes.rows[0]
      });
    }

    return res.json({
      success: true,
      message: 'Country updated in demo mode.',
      data: { code, ...req.body }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/sovereign-countries/:code - Delete country jurisdiction
router.delete('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      // Check if any tenants use this country
      const checkRes = await query('SELECT id FROM tenants_companies WHERE country_code = $1 LIMIT 1', [code.toUpperCase()]);
      if (checkRes.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Cannot delete country: Active pharma companies are assigned to this sovereign jurisdiction.' });
      }

      const delRes = await query('DELETE FROM sovereign_countries WHERE code = $1 RETURNING code;', [code.toUpperCase()]);
      if (delRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Country not found.' });
      }

      await query(`
        INSERT INTO platform_audit_logs (actor_email, actor_role, action, target_entity, entity_id, details)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        'superadmin@alleviaresfa.com',
        'SUPER_ADMIN',
        'SOVEREIGN_COUNTRY_DELETED',
        'sovereign_countries',
        code,
        JSON.stringify({ code })
      ]);

      return res.json({ success: true, message: `Sovereign country ${code} deleted.` });
    }

    return res.json({ success: true, message: `Country ${code} deleted in demo mode.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
