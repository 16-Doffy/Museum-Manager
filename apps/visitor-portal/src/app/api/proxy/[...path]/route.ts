import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getBackendOrigin(): string {
  // Default to production API from Swagger docs
  const origin = process.env.BACKEND_API_ORIGIN || 'https://museum-system-api-160202770359.asia-southeast1.run.app';
  return origin.replace(/\/$/, '');
}

async function handle(req: NextRequest, { params }: { params: { path: string[] } }) {
  const origin = getBackendOrigin();
  const subPath = params.path.join('/');
  const targetUrl = `${origin}/api/v1/${subPath}`;

  // Remove client authorization headers (we'll add server-side token if needed)
  const clientHeaders = new Headers(req.headers);
  clientHeaders.delete('authorization');
  clientHeaders.delete('Authorization');

  const init: RequestInit = {
    method: req.method,
    headers: clientHeaders,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text(),
    redirect: 'manual',
  };

  // Add server-side token if configured (keep tokens server-side only)
  if (process.env.BACKEND_API_TOKEN) {
    init.headers = new Headers(init.headers);
    (init.headers as Headers).set('Authorization', `Bearer ${process.env.BACKEND_API_TOKEN}`);
    console.log(`[Proxy] Added token to request: ${targetUrl}`);
  } else {
    console.warn(`[Proxy] No BACKEND_API_TOKEN found in environment for: ${targetUrl}`);
  }

  try {
    const res = await fetch(targetUrl, init);
    const headers = new Headers(res.headers);
    headers.set('access-control-allow-origin', '*');
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[Proxy Error] ${targetUrl}: ${res.status} - ${text.substring(0, 200)}`);
      return new NextResponse(text || res.statusText, { status: res.status, headers });
    }
    return new NextResponse(res.body, { status: res.status, headers });
  } catch (e: unknown) {
    console.error(`[Proxy Fetch Error] ${targetUrl}:`, e);
    return NextResponse.json({ error: (e as Error).message, targetUrl }, { status: 502 });
  }
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };


