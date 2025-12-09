// src/app/api/agent/route.ts
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Configuración de la URL base de tu backend de Cloud Run (sin los parámetros finales)
  const backendUrl = 'https://apicloudia-10225299185.us-central1.run.app/agent';

  // Recrea la URL de tu API remota usando los parámetros de consulta capturados del frontend
  const url = `${backendUrl}?` +
    new URL(request.url).searchParams.toString();

  // forward
  const apiRes = await fetch(url);
  const text   = await apiRes.text();

  return new Response(text, {
    status: apiRes.status,
    headers: { 'Content-Type': 'text/plain' },
  });
}