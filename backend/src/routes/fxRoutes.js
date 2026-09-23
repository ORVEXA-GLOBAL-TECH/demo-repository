import { Router } from 'express';
import { query, checkDbHealth } from '../config/db.js';

const router = Router();

// Fallback seed rates against USD
const DEFAULT_FX_RATES = [
  { from_currency: 'USD', to_currency: 'USD', rate: 1.0, inverse_rate: 1.0, provider: 'System Base' },
  { from_currency: 'USD', to_currency: 'EUR', rate: 0.9215, inverse_rate: 1.085187, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'GBP', rate: 0.7850, inverse_rate: 1.273885, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'INR', rate: 83.4500, inverse_rate: 0.011983, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'JPY', rate: 156.8000, inverse_rate: 0.006378, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'CAD', rate: 1.3680, inverse_rate: 0.730994, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'AUD', rate: 1.5050, inverse_rate: 0.664452, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'AED', rate: 3.6725, inverse_rate: 0.272294, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'SGD', rate: 1.3490, inverse_rate: 0.741290, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'CHF', rate: 0.8980, inverse_rate: 1.113586, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'BRL', rate: 5.4200, inverse_rate: 0.184502, provider: 'OpenExchangeRates' },
  { from_currency: 'USD', to_currency: 'ZAR', rate: 18.2500, inverse_rate: 0.054795, provider: 'OpenExchangeRates' },
];

let inMemoryRates = [...DEFAULT_FX_RATES];
let lastFxSyncTime = new Date().toISOString();

// Helper to auto-ensure table exists in PostgreSQL
let tableInitialized = false;
async function ensureFxRatesTable() {
  if (tableInitialized) return;
  try {
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      await query(`
        CREATE TABLE IF NOT EXISTS public.fx_rates (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
          to_currency VARCHAR(10) NOT NULL,
          rate NUMERIC(18, 6) NOT NULL,
          inverse_rate NUMERIC(18, 6) NOT NULL,
          provider VARCHAR(64) DEFAULT 'OpenExchangeRates',
          is_manual_override BOOLEAN DEFAULT FALSE,
          last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_currency_pair UNIQUE (from_currency, to_currency)
        );
      `);

      // Seed default rates if table is empty
      const checkRes = await query('SELECT COUNT(*) FROM public.fx_rates');
      if (parseInt(checkRes.rows[0].count, 10) === 0) {
        for (const item of DEFAULT_FX_RATES) {
          await query(`
            INSERT INTO public.fx_rates (from_currency, to_currency, rate, inverse_rate, provider)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (from_currency, to_currency) DO NOTHING;
          `, [item.from_currency, item.to_currency, item.rate, item.inverse_rate, item.provider]);
        }
      }
      tableInitialized = true;
    }
  } catch (err) {
    console.warn('⚠️ [FX TABLE INIT]:', err.message);
  }
}

// Perform initial check on file load
ensureFxRatesTable().catch(() => {});

/**
 * Fetch live exchange rates from Open Exchange Rates API
 */
export const syncLiveFxRatesToDb = async () => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data.result === 'success' && data.rates) {
      lastFxSyncTime = new Date().toISOString();
      const newMemoryRates = [];

      for (const [targetCurr, rateNum] of Object.entries(data.rates)) {
        const rate = Number(rateNum);
        const inverse = rate > 0 ? Number((1 / rate).toFixed(6)) : 0;
        newMemoryRates.push({
          from_currency: 'USD',
          to_currency: targetCurr,
          rate,
          inverse_rate: inverse,
          provider: 'OpenExchangeRates',
          last_updated: lastFxSyncTime
        });
      }

      if (newMemoryRates.length > 0) {
        inMemoryRates = newMemoryRates;
      }

      const dbHealth = await checkDbHealth();
      if (dbHealth.status === 'CONNECTED') {
        await ensureFxRatesTable();
        for (const r of newMemoryRates) {
          await query(`
            INSERT INTO public.fx_rates (from_currency, to_currency, rate, inverse_rate, provider, last_updated)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (from_currency, to_currency) DO UPDATE
            SET rate = EXCLUDED.rate,
                inverse_rate = EXCLUDED.inverse_rate,
                last_updated = NOW()
            WHERE fx_rates.is_manual_override = FALSE;
          `, ['USD', r.to_currency, r.rate, r.inverse_rate, 'OpenExchangeRates']).catch(() => {});
        }
      }
      return { success: true, count: newMemoryRates.length, lastSyncedAt: lastFxSyncTime };
    }
    throw new Error('API returned invalid format');
  } catch (err) {
    console.warn('⚠️ [FX SYNC WARNING]:', err.message);
    return { success: false, error: err.message };
  }
};

// Periodic auto-sync every 6 hours
setInterval(() => syncLiveFxRatesToDb().catch(() => {}), 6 * 60 * 60 * 1000);

// GET /api/fx-rates - List all foreign exchange rates
router.get('/', async (req, res) => {
  try {
    await ensureFxRatesTable();
    const dbHealth = await checkDbHealth();
    if (dbHealth.status === 'CONNECTED') {
      const result = await query('SELECT * FROM public.fx_rates ORDER BY to_currency ASC');
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          count: result.rows.length,
          source: 'DATABASE',
          lastSyncedAt: lastFxSyncTime,
          data: result.rows
        });
      }
    }

    return res.json({
      success: true,
      count: inMemoryRates.length,
      source: 'IN_MEMORY',
      lastSyncedAt: lastFxSyncTime,
      data: inMemoryRates
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/fx-rates/convert?from=USD&to=EUR&amount=100 - Currency conversion calculation
router.get('/convert', async (req, res) => {
  const from = (req.query.from || 'USD').toUpperCase();
  const to = (req.query.to || 'USD').toUpperCase();
  const amount = parseFloat(req.query.amount || '1');

  if (isNaN(amount) || amount < 0) {
    return res.status(400).json({ success: false, message: 'Invalid conversion amount' });
  }

  if (from === to) {
    return res.json({
      success: true,
      from,
      to,
      amount,
      convertedAmount: amount,
      rate: 1.0,
      inverseRate: 1.0,
      timestamp: new Date().toISOString()
    });
  }

  try {
    await ensureFxRatesTable();
    const dbHealth = await checkDbHealth();

    let ratesList = inMemoryRates;
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM public.fx_rates');
      if (dbRes.rows.length > 0) {
        ratesList = dbRes.rows;
      }
    }

    // Convert via USD base currency
    const fromRateObj = ratesList.find(r => r.to_currency === from || r.from_currency === from) || { rate: 1.0 };
    const toRateObj = ratesList.find(r => r.to_currency === to) || { rate: 1.0 };

    const fromRateToUSD = from === 'USD' ? 1.0 : (Number(fromRateObj.rate) || 1.0);
    const toRateToUSD = to === 'USD' ? 1.0 : (Number(toRateObj.rate) || 1.0);

    // Amount in USD = amount / fromRateToUSD
    const amountInUSD = amount / fromRateToUSD;
    const finalAmount = amountInUSD * toRateToUSD;
    const effectiveRate = toRateToUSD / fromRateToUSD;

    return res.json({
      success: true,
      from,
      to,
      amount,
      convertedAmount: Number(finalAmount.toFixed(4)),
      rate: Number(effectiveRate.toFixed(6)),
      inverseRate: effectiveRate > 0 ? Number((1 / effectiveRate).toFixed(6)) : 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/fx-rates/sync - Manual trigger to sync live FX rates from global provider
router.post('/sync', async (req, res) => {
  const syncResult = await syncLiveFxRatesToDb();
  try {
    await ensureFxRatesTable();
    const dbHealth = await checkDbHealth();
    let ratesList = inMemoryRates;
    if (dbHealth.status === 'CONNECTED') {
      const dbRes = await query('SELECT * FROM public.fx_rates ORDER BY to_currency ASC');
      ratesList = dbRes.rows;
    }
    return res.json({
      success: syncResult.success,
      message: syncResult.success ? 'FX exchange rates synchronized with live global provider.' : 'Failed to sync with live provider.',
      error: syncResult.error,
      lastSyncedAt: lastFxSyncTime,
      count: ratesList.length,
      data: ratesList
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/fx-rates - Create or update manual FX exchange rate
router.post('/', async (req, res) => {
  const { from_currency = 'USD', to_currency, rate, is_manual_override = true } = req.body;

  if (!to_currency || !rate || isNaN(Number(rate))) {
    return res.status(400).json({ success: false, message: 'Valid to_currency and numerical rate are required.' });
  }

  const fromCurr = from_currency.toUpperCase().trim();
  const toCurr = to_currency.toUpperCase().trim();
  const rateNum = Number(rate);
  const inverseNum = rateNum > 0 ? Number((1 / rateNum).toFixed(6)) : 0;

  try {
    await ensureFxRatesTable();
    const dbHealth = await checkDbHealth();

    if (dbHealth.status === 'CONNECTED') {
      const upsertRes = await query(`
        INSERT INTO public.fx_rates (from_currency, to_currency, rate, inverse_rate, provider, is_manual_override, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (from_currency, to_currency) DO UPDATE
        SET rate = EXCLUDED.rate,
            inverse_rate = EXCLUDED.inverse_rate,
            provider = EXCLUDED.provider,
            is_manual_override = EXCLUDED.is_manual_override,
            last_updated = NOW()
        RETURNING *;
      `, [fromCurr, toCurr, rateNum, inverseNum, 'Manual Override', Boolean(is_manual_override)]);

      return res.status(201).json({
        success: true,
        message: `FX rate for ${fromCurr}/${toCurr} set to ${rateNum}`,
        data: upsertRes.rows[0]
      });
    }

    // In-memory fallback
    const idx = inMemoryRates.findIndex(r => r.from_currency === fromCurr && r.to_currency === toCurr);
    const item = {
      from_currency: fromCurr,
      to_currency: toCurr,
      rate: rateNum,
      inverse_rate: inverseNum,
      provider: 'Manual Override',
      is_manual_override: true,
      last_updated: new Date().toISOString()
    };

    if (idx >= 0) {
      inMemoryRates[idx] = item;
    } else {
      inMemoryRates.push(item);
    }

    return res.status(201).json({
      success: true,
      message: `[Demo Mode] FX rate for ${fromCurr}/${toCurr} set to ${rateNum}`,
      data: item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/fx-rates/:fromCurrency/:toCurrency - Delete rate override
router.delete('/:fromCurrency/:toCurrency', async (req, res) => {
  const fromCurr = req.params.fromCurrency.toUpperCase();
  const toCurr = req.params.toCurrency.toUpperCase();

  try {
    await ensureFxRatesTable();
    const dbHealth = await checkDbHealth();

    if (dbHealth.status === 'CONNECTED') {
      await query('DELETE FROM public.fx_rates WHERE from_currency = $1 AND to_currency = $2', [fromCurr, toCurr]);
      return res.json({ success: true, message: `FX rate pair ${fromCurr}/${toCurr} deleted.` });
    }

    inMemoryRates = inMemoryRates.filter(r => !(r.from_currency === fromCurr && r.to_currency === toCurr));
    return res.json({ success: true, message: `[Demo Mode] FX rate pair ${fromCurr}/${toCurr} deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
