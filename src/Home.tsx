import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

type IncomingCard = {
  id: string;
  type: 'text' | 'file';
  from: string;
  receivedAt: string;
  text?: string;
  fileName?: string;
  mimeType?: string;
  base64?: string;
  sizeBytes?: number;
};

const BOT_NUMBER = import.meta.env.VITE_BOT_NUMBER || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function randomSessionId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string>(() => randomSessionId());
  const [connected, setConnected] = useState(false);
  const [cards, setCards] = useState<IncomingCard[]>([]);

  const deepLink = useMemo(
    () => `https://wa.me/${BOT_NUMBER}?text=${encodeURIComponent(`Connect: ${sessionId}`)}`,
    [sessionId],
  );

  useEffect(() => {
    const socket: Socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socket.on('connect', () => {
      socket.emit('join-session', { sessionId });
    });

    socket.on('join-session-success', () => {
      setConnected(false);
    });

    socket.on('whatsapp-connected', (payload: { sessionId: string }) => {
      if (payload.sessionId === sessionId) {
        setConnected(true);
      }
    });

    socket.on('incoming-card', (payload: IncomingCard) => {
      setCards((prev) => [payload, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-6 text-slate-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Local-Link Bridge</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            connected ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        >
          {connected ? 'Connected' : 'Waiting for WhatsApp link'}
        </span>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-slate-900 p-5 shadow">
          <p className="mb-2 text-sm text-slate-400">Session ID</p>
          <p className="mb-4 text-3xl font-extrabold tracking-widest">{sessionId}</p>

          <div className="mb-4 inline-block rounded-lg bg-white p-3">
            <QRCodeSVG value={deepLink} size={220} />
          </div>

          <p className="mb-4 text-sm text-slate-300">
            Scan this QR — WhatsApp will open a chat with the <strong>bot number</strong>. Send{' '}
            <code>{`Connect: ${sessionId}`}</code> <strong>in that chat only</strong>.
          </p>
          <p className="mb-4 rounded-lg bg-amber-950/60 p-3 text-xs text-amber-100">
            <strong>Important:</strong> Sending from <em>web.whatsapp.com</em> in the &quot;You&quot;
            / self chat does <strong>not</strong> reach the backend bridge. The server uses its own
            browser session (Puppeteer), not this browser tab.
          </p>

          <button
            type="button"
            onClick={() => {
              setCards([]);
              setConnected(false);
              setSessionId(randomSessionId());
            }}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
          >
            New Session
          </button>
        </div>

        <div className="rounded-xl bg-slate-900 p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Incoming Transfer Cards</h2>
          <div className="space-y-3">
            {cards.length === 0 && (
              <p className="text-sm text-slate-400">No messages yet.</p>
            )}

            {cards.map((card) => (
              <article key={card.id} className="rounded-lg bg-slate-800 p-3">
                <p className="text-xs text-slate-400">
                  {card.from} • {new Date(card.receivedAt).toLocaleTimeString()}
                </p>

                {card.type === 'text' ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm">{card.text}</p>
                ) : (
                  <div className="mt-2 text-sm">
                    <p>{card.fileName || 'attachment'}</p>
                    <p className="text-xs text-slate-400">{card.mimeType}</p>
                    <p className="text-xs text-slate-400">{card.sizeBytes || 0} bytes</p>
                    {card.base64 && (
                      <a
                        className="mt-2 inline-block text-indigo-300 underline"
                        href={`data:${card.mimeType};base64,${card.base64}`}
                        download={card.fileName || 'file'}
                      >
                        Download
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
