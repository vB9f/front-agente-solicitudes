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
            <aside className="w-80 bg-[var(--ui-primary)] text-[var(--foreground)] p-4 text-xl font-semibold border-r border-gray-600/50">
              Multiagente de Reembolsos
            </aside>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
