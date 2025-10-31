export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  nextOptions?: RequestInit;
}

// Prefer server-side proxy route to avoid CORS and rewrite pitfalls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy';

export async function http<TResponse>(path: string, options: HttpOptions = {}): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.NEXT_PUBLIC_API_TOKEN ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    ...options.nextOptions,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  // Some endpoints may return no content
  if (res.status === 204) return undefined as unknown as TResponse;

  return (await res.json()) as TResponse;
}


