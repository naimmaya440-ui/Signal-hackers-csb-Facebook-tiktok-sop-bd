export interface SmmBalanceResponse {
  balance?: string | number;
  currency?: string;
  error?: string;
}

export interface SmmOrderResponse {
  order?: number | string;
  error?: string;
  rawResponse?: string;
}

export interface SmmStatusResponse {
  charge?: string;
  start_count?: string;
  status?: string;
  remains?: string;
  currency?: string;
  error?: string;
}

export async function fetchSmmBalance(apiUrl: string, apiKey: string): Promise<SmmBalanceResponse> {
  const res = await fetch('/api/smm/balance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiUrl, apiKey }),
  });
  return res.json();
}

export async function submitSmmOrder(
  apiUrl: string,
  apiKey: string,
  serviceId: string,
  link: string,
  quantity: number
): Promise<SmmOrderResponse> {
  const res = await fetch('/api/smm/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiUrl, apiKey, serviceId, link, quantity }),
  });
  return res.json();
}

export async function fetchSmmOrderStatus(
  apiUrl: string,
  apiKey: string,
  providerOrderId: string
): Promise<SmmStatusResponse> {
  const res = await fetch('/api/smm/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiUrl, apiKey, providerOrderId }),
  });
  return res.json();
}
