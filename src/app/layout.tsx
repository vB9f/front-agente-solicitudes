// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import AuthProvider from './AuthProvider';

export const metadata = {
  title: 'Multiagente de reembolsos',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen">
          <AuthProvider>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
