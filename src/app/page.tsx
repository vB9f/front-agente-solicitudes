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
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
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
      {/* HEADER: */}
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
        {chat.map((m, i) => {
          const isUser = m.de === 'usuario';
          return (
            <div
              key={i}
              className={isUser ? 'user-message-wrapper' : 'agent-message-wrapper'}
            >
              {/* Contenedor del avatar */}
              <div 
                className={`avatar-icon mx-3`}
              >
                {/* Usamos las iniciales o un ícono simple. Usaré iniciales como ejemplo. */}
                {isUser ? session.user?.name?.[0].toUpperCase() || 'U' : 'AI'} 
              </div>

              {/* Contenedor del texto del mensaje */}
              <div 
                className={`message-text flex-1 px-3`}
              >
                <div 
                    className={`
                        max-w-[70%] 
                        ${isUser 
                            ? // ESTILOS DEL USUARIO (BURBUJA DINÁMICA Y GRIS SUTIL)
                              'ml-auto p-3 rounded-xl shadow-md' +
                              ' bg-[var(--ui-primary)] text-[var(--foreground)]' + 
                              ' w-fit'
                            : // ESTILOS DEL AGENTE (TEXTO PLANO)
                              'text-[var(--foreground)] text-left'
                        }
                    `}
                >
                  {m.texto}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT - MENSAJE */}
      <div className="mt-2 pt-4 flex justify-center border-t border-[var(--ui-primary)]">
        <form onSubmit={enviar} className="flex gap-2 w-full max-w-4xl">
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
            className="bg-gray-800 text-white px-6 py-3 rounded disabled:opacity-50 hover:bg-gray-900"
          >
            {loading ? '…' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
);
}
