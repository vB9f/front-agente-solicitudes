// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AuthProvider from './AuthProvider';

export const metadata = {
  title: 'Multiagente de Reembolsos',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen">
          <AuthProvider>
            <aside className="w-64 bg-[var(--ui-primary)] text-[var(--foreground)] p-4 text-xl font-semibold border-r border-gray-600/50">
              Multiagente - Reembolsos
            </aside>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
