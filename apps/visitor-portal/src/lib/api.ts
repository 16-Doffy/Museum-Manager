export type ApiOptions = RequestInit & { auth?: boolean };

// Align with admin-portal: use same base and token key
// ADMIN uses VITE_API_URL (full .../api/v1). We'll support both env names.
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.VITE_API_URL ||
  'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';
const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Backward compatibility: also read old key if present
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('vp_token');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  // Keep old key in sync to avoid stale sessions
  if (token) localStorage.setItem('vp_token', token);
  else localStorage.removeItem('vp_token');
}

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.auth) {
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // Some endpoints may return empty body
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return undefined as unknown as T;
  return (await res.json()) as T;
}

// Visitor endpoints
export async function visitorLogin(payload: { username: string; password: string }): Promise<{ token: string }>
{ const res = await apiFetch<any>('/visitors/login', { method: 'POST', body: JSON.stringify(payload) });
  const token = res?.token || res?.accessToken || res?.data?.token || res?.data?.accessToken;
  if (!token) {
    // Return whole response for debugging but keep shape
    throw new Error(res?.message || res?.Message || 'Login response missing token');
  }
  return { token };
}

export async function visitorRegister(payload: { username: string; password: string }): Promise<any>
{ return apiFetch('/visitors/register', { method: 'POST', body: JSON.stringify(payload) }); }

export async function visitorMe(): Promise<{ id?: string; username?: string; email?: string }>
{ return apiFetch('/visitors/me', { auth: true }); }

export async function postInteraction(payload: { artifactId: string; comment?: string; rating?: number }): Promise<any>
{ return apiFetch('/visitors/interactions', { method: 'POST', auth: true, body: JSON.stringify(payload) }); }

export async function getInteractions(params: { pageIndex?: number; pageSize?: number; artifactId?: string } = {}): Promise<any>
{ const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v!==undefined) as any).toString();
  return apiFetch(`/visitors/interactions${qs ? `?${qs}` : ''}`, { auth: true }); }

// Get all interactions for a specific artifact (public, all users)
export async function getInteractionsByArtifact(artifactId: string, params: { pageIndex?: number; pageSize?: number } = {}): Promise<any> {
  // Try endpoint: GET /visitors/artifacts/{artifactId}/interactions
  try {
    const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v!==undefined) as any).toString();
    const res = await apiFetch<any>(`/visitors/artifacts/${artifactId}/interactions${qs ? `?${qs}` : ''}`, { auth: true });
    return res?.data || res;
  } catch (e) {
    // Fallback: try GET /visitors/interactions with artifactId filter
    const qs = new URLSearchParams(Object.entries({ ...params, artifactId }).filter(([,v]) => v!==undefined) as any).toString();
    const res = await apiFetch<any>(`/visitors/interactions${qs ? `?${qs}` : ''}`, { auth: true });
    return res?.data || res;
  }
}

// Museums
export interface MuseumSummary {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
}

export async function getMuseums(params: { pageIndex?: number; pageSize?: number; museumName?: string } = {}): Promise<MuseumSummary[]>
{ const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v!==undefined) as any).toString();
  const res = await apiFetch<any>(`/visitors/museums${qs ? `?${qs}` : ''}`, { auth: true });
  return (res?.data?.items as MuseumSummary[]) || (res?.items as MuseumSummary[]) || (Array.isArray(res) ? res : []);
}

export async function getMuseumDetail(id: string): Promise<any>
{ const res = await apiFetch<any>(`/visitors/museums/${id}`, { auth: true });
  return res?.data || res; }

export interface ArtifactSummary {
  id: string;
  name: string;
  periodTime?: string;
  areaName?: string;
  displayPositionName?: string;
  status?: string;
}

export async function getArtifactsByMuseum(
  museumId: string,
  params: { pageIndex?: number; pageSize?: number; artifactName?: string; periodTime?: string; areaName?: string; displayPositionName?: string } = {}
): Promise<ArtifactSummary[]>
{ const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v!==undefined && v!==null && v!=='') as any).toString();
  const res = await apiFetch<any>(`/visitors/museums/${museumId}/artifacts${qs ? `?${qs}` : ''}`, { auth: true });
  return (res?.data?.items as ArtifactSummary[]) || (res?.items as ArtifactSummary[]) || (Array.isArray(res) ? res : []);
}

export async function getArtifactDetail(artifactId: string): Promise<any>
{ const res = await apiFetch<any>(`/visitors/artifacts/${artifactId}`, { auth: true });
  return res?.data || res; }



