// src/app/page.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';

type Mensaje = { de: 'usuario' | 'bot'; texto: string };

export default function Page() {
  const { data: session } = useSession();
  const [chat, setChat] = useState<Mensaje[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Si no hay sesión, mostramos botón de login
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center">
         <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          
          Login
        </button>
      </div>
    );
  }

  // Función para enviar mensaje
  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!msg) return;
    setLoading(true);

    const userEmail = session.user?.email ?? '';
    const userName = session.user?.name ?? 'Usuario desconocido';
    const sessionId = userEmail;

const urlParams = new URLSearchParams({
      id_agente: sessionId,
      msg: msg,
      display_name: userName,
    });

    const finalUrl = `/api/agent?${urlParams.toString()}`;

    const res = await fetch(finalUrl, { 
      method: 'GET'
    });

    const data = await res.json();
    const texto = data.response || "Error: La respuesta del agente no fue válida o no se pudo procesar.";

    // Actualizar historial
    setChat((c) => [
      ...c,
      { de: 'usuario', texto: msg },
      { de: 'bot',     texto }
    ]);

    setMsg('');
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <header className="mb-4 flex justify-between items-center border-b border-[var(--ui-primary)] pb-4">
        <div>
          <span className="font-medium text-[var(--foreground)]">
            ¡Hola, {session.user?.name}!
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-[var(--foreground)] hover:opacity-75"
        >
          Cerrar sesión
        </button>
      </header>

    {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto pb-4 chat-container">
        {chat.map((m, i) => (
          <div
            key={i}
            className={
              m.de === 'usuario'
                ? 'user-message-wrapper'
                : 'agent-message-wrapper'
            }
          >
            <div className={`message-text max-w-[70%] px-6 ${m.de === 'usuario' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT - MENSAJE */}
      <form onSubmit={enviar} className="mt-2 pt-4 flex gap-2 border-t border-[var(--ui-primary)]">
        <input
          className="flex-1 input-box px-4 py-3"
          placeholder="Preguntarle al agente"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? '…' : 'Enviar'}
        </button>
      </form>
    </div>
);
}
