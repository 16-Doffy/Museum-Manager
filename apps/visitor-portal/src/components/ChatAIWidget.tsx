'use client';

import { useEffect, useState } from 'react';

export default function ChatAIWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [museums, setMuseums] = useState<any[]>([]);
  const [artifactsByMuseum, setArtifactsByMuseum] = useState<Record<string, any[]>>({});

  // Use same API base as other API calls (with /api/v1 prefix)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.VITE_API_URL ||
    'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('auth_token') || localStorage.getItem('vp_token')
      : undefined;

  async function fetchMuseums() {
    try {
      const res = await fetch(`${API_BASE}/visitors/museums?pageIndex=1&pageSize=100`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => null);
      const list = data?.data?.items || data?.items || [];
      setMuseums(list);
      return list as any[];
    } catch {
      return [] as any[];
    }
  }

  async function fetchArtifacts(museumId: string) {
    try {
      const res = await fetch(`${API_BASE}/visitors/museums/${museumId}/artifacts?pageIndex=1&pageSize=100`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => null);
      const list = data?.data?.items || data?.items || [];
      setArtifactsByMuseum((prev) => ({ ...prev, [museumId]: list }));
      return list as any[];
    } catch {
      return [] as any[];
    }
  }

  useEffect(() => {
    if (!open) return;
    if (museums.length === 0) {
      fetchMuseums().then((list) => {
        // preload a few artifacts (first 3 museums)
        list.slice(0, 3).forEach((m) => fetchArtifacts(m.id));
      });
    }
  }, [open]);

  function normalize(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  function answerFromLocal(p: string): string | null {
    const q = normalize(p);
    if (q.includes('danh sach bao tang') || q.includes('bao tang nao')) {
      const names = museums.map((m) => m.name).join(', ');
      if (names) return `Hiện có các bảo tàng: ${names}.`;
    }
    // try find museum mentioned
    const foundMuseum = museums.find((m) => q.includes(normalize(m.name || '')));
    if (foundMuseum) {
      if (q.includes('hien vat') || q.includes('do vat') || q.includes('artifact')) {
        const arts = artifactsByMuseum[foundMuseum.id] || [];
        if (arts.length === 0) return `Đang tải hiện vật của ${foundMuseum.name}… vui lòng thử lại trong giây lát.`;
        const list = arts.map((a) => a.name).join(', ');
        return list ? `Hiện vật trong ${foundMuseum.name}: ${list}.` : `Chưa có hiện vật hiển thị trong ${foundMuseum.name}.`;
      }
      if (q.includes('mo ta') || q.includes('gioi thieu') || q.includes('thong tin')) {
        const desc = foundMuseum.description || 'Chưa có mô tả.';
        return `${foundMuseum.name}: ${desc}. Địa điểm: ${foundMuseum.location || '—'}.`;
      }
    }
    // try find artifact mentioned
    const allArts: any[] = Object.values(artifactsByMuseum).flat();
    const foundArtifact = allArts.find((a) => q.includes(normalize(a.name || '')));
    if (foundArtifact) {
      const info = [
        foundArtifact.description ? `Mô tả: ${foundArtifact.description}` : '',
        foundArtifact.periodTime ? `Niên đại: ${foundArtifact.periodTime}` : '',
        foundArtifact.areaName ? `Khu vực: ${foundArtifact.areaName}` : '',
        foundArtifact.displayPositionName ? `Vị trí: ${foundArtifact.displayPositionName}` : '',
        foundArtifact.status ? `Trạng thái: ${foundArtifact.status}` : '',
      ]
        .filter(Boolean)
        .join('. ');
      return info || 'Chưa có thêm thông tin.';
    }
    return null;
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!prompt.trim() || loading) return;
    const p = prompt.trim();
    setMessages((prev) => [...prev, { role: 'user', text: p }]);
    setPrompt('');
    setLoading(true);
    try {
      // Get museumId - priority: 1) from URL, 2) from prompt, 3) first museum
      let museumId: string | undefined;
      
      // Try to get museumId from current URL (if on museum detail page)
      if (typeof window !== 'undefined') {
        const pathMatch = window.location.pathname.match(/\/museums\/([a-f0-9-]+)/i);
        if (pathMatch && pathMatch[1]) {
          museumId = pathMatch[1];
          console.log('Found museumId from URL:', museumId);
        }
      }
      
      // If not from URL, try to find from prompt
      if (!museumId) {
        const foundMuseum = museums.find((m) => normalize(p).includes(normalize(m.name || '')));
        if (foundMuseum) {
          museumId = foundMuseum.id;
          console.log('Found museumId from prompt:', museumId, foundMuseum.name);
        }
      }
      
      // If still not found, use first museum
      if (!museumId && museums.length > 0) {
        museumId = museums[0].id;
        console.log('Using first museum:', museumId, museums[0].name);
      }

      // Only use local answers for simple queries (museum list, basic info)
      // For artifact queries or complex questions, always use API
      const q = normalize(p);
      const foundMuseumForLocal = museums.find((m) => normalize(p).includes(normalize(m.name || '')));
      const isSimpleQuery = 
        q.includes('danh sach bao tang') || 
        q.includes('bao tang nao') ||
        (foundMuseumForLocal && !q.includes('hien vat') && !q.includes('do vat') && !q.includes('artifact') && (q.includes('mo ta') || q.includes('gioi thieu') || q.includes('thong tin')));
      
      if (isSimpleQuery) {
        const local = answerFromLocal(p);
        if (local) {
          setMessages((prev) => [...prev, { role: 'ai', text: local }]);
          setLoading(false);
          return;
        }
      }

      if (!museumId) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Xin lỗi, chưa có thông tin bảo tàng. Vui lòng thử lại sau khi hệ thống tải xong dữ liệu.',
          },
        ]);
        setLoading(false);
        return;
      }

      // Call AI chat API
      console.log('Calling API with:', { prompt: p, museumId, API_BASE: `${API_BASE}/chat/generate` });
      
      const res = await fetch(`${API_BASE}/chat/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: p, museumId }),
      });

      console.log('API Response status:', res.status, 'Content-Type:', res.headers.get('content-type'));

      // Check if response is ok
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        console.error('API Error:', res.status, errorText);
        // Check if error is HTML (like 404 page)
        if (errorText.trim().startsWith('<!DOCTYPE') || errorText.trim().startsWith('<html')) {
          throw new Error(`API endpoint không khả dụng (${res.status}). Vui lòng kiểm tra kết nối với server.`);
        }
        throw new Error(`Lỗi API: ${res.status} - ${errorText || res.statusText}`);
      }

      // Check content type
      const contentType = res.headers.get('content-type') || '';
      const raw = await res.text();
      
      console.log('API Raw response length:', raw.length, 'Content-Type:', contentType);
      console.log('API Raw response (first 300 chars):', raw.substring(0, 300));
      
      // If response is HTML, it's an error
      if (raw.trim().startsWith('<!DOCTYPE') || raw.trim().startsWith('<html')) {
        throw new Error('Server trả về HTML thay vì text. Endpoint có thể không tồn tại hoặc có lỗi cấu hình.');
      }

      let text = raw.trim();
      
      // API returns text/plain, but try to parse as JSON first (in case format changes)
      if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
        try {
          const data = JSON.parse(text);
          console.log('Parsed JSON data:', data);
          text =
            data?.data?.content ||
            data?.content ||
            data?.message ||
            data?.result ||
            data?.answer ||
            data?.output ||
            data?.data?.message ||
            text;
        } catch (parseError) {
          // If JSON parse fails, use raw text
          console.log('JSON parse failed, using raw text');
        }
      } else {
        // Content-Type is text/plain, use raw text directly
        console.log('Response is text/plain, using raw text');
      }

      if (!text || text.trim().length === 0) {
        text = 'Không có phản hồi từ server.';
      }

      console.log('Final text to display (length:', text.length, '):', text.substring(0, 300));
      setMessages((prev) => [...prev, { role: 'ai', text: text }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'ai', text: err?.message || 'Lỗi gọi Chat AI.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-5 bottom-5 z-[70]">
      {/* Floating button */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 focus:outline-none"
          title="Chat AI"
        >
          AI
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div className="w-[340px] sm:w-[380px] rounded-xl shadow-2xl border border-neutral-200 overflow-hidden" style={{ background: '#ede7dd' }}>
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: 'linear-gradient(90deg, #F28076 0%, #FFB6AF 20%, #FAE0C7 45%, #FBC193 70%, #4EB09B 100%)' }}>
            <div className="font-semibold">Chat AI</div>
            <button onClick={() => setOpen(false)} className="opacity-90 hover:opacity-100">✕</button>
          </div>
          <div className="max-h-[320px] overflow-y-auto p-3 space-y-3 text-sm">
            {messages.length === 0 ? (
              <div className="text-neutral-500">Hãy hỏi mình bất cứ điều gì về bảo tàng hoặc hiện vật…</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                  <div
                    className={
                      'inline-block rounded-2xl px-3 py-2 ' +
                      (m.role === 'user'
                        ? 'text-white'
                        : 'text-neutral-800')
                    }
                    style={{
                      ...(m.role === 'user' ? { background: '#4EB09B' } : { background: '#FAE0C7' }),
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendMessage} className="border-t border-neutral-200 p-3 flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập câu hỏi…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Đang gửi…' : 'Gửi'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}


