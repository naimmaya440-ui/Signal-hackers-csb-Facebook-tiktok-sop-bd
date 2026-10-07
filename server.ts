import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper to make SMM Panel API requests with smart fallback
async function callSmmProvider(apiUrl: string, params: Record<string, string | number>) {
  const urlsToTry = [apiUrl];
  if (apiUrl.includes('my.smmsun.com')) {
    urlsToTry.push('https://smmsun.com/api/v2');
  } else if (apiUrl.includes('smmsun.com')) {
    urlsToTry.push('https://my.smmsun.com/api/v2');
  }

  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, String(value));
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
        },
        body: formData.toString(),
        redirect: 'follow',
      });

      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (err) {
        lastError = {
          rawResponse: text.slice(0, 150),
          error: 'SMM Provider returned HTML or Cloudflare challenge instead of JSON.',
        };
      }
    } catch (err: any) {
      lastError = { error: err.message || 'Network fetch failure' };
    }
  }

  return lastError || { error: 'Provider returned invalid response' };
}

// 1. Check Provider Balance & Connection
app.post('/api/smm/balance', async (req, res) => {
  try {
    const { apiUrl, apiKey } = req.body;
    if (!apiUrl || !apiKey) {
      return res.status(400).json({ error: 'API URL and API Key are required' });
    }

    const data = await callSmmProvider(apiUrl, {
      key: apiKey,
      action: 'balance',
    });

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to connect to SMM Provider' });
  }
});

// 2. Submit Real Order to SMM Provider
app.post('/api/smm/order', async (req, res) => {
  try {
    const { apiUrl, apiKey, serviceId, link, quantity } = req.body;
    if (!apiUrl || !apiKey || !serviceId || !link || !quantity) {
      return res.status(400).json({
        error: 'Missing required parameters: apiUrl, apiKey, serviceId, link, quantity',
      });
    }

    const data = await callSmmProvider(apiUrl, {
      key: apiKey,
      action: 'add',
      service: serviceId,
      link: link,
      quantity: quantity,
    });

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send order to SMM provider' });
  }
});

// 3. Check Order Status on Provider
app.post('/api/smm/status', async (req, res) => {
  try {
    const { apiUrl, apiKey, providerOrderId } = req.body;
    if (!apiUrl || !apiKey || !providerOrderId) {
      return res.status(400).json({
        error: 'Missing required parameters: apiUrl, apiKey, providerOrderId',
      });
    }

    const data = await callSmmProvider(apiUrl, {
      key: apiKey,
      action: 'status',
      order: providerOrderId,
    });

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch status from SMM provider' });
  }
});

// Mount Vite or serve static
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BoostBangla server running at http://0.0.0.0:${PORT}`);
});
