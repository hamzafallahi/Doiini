import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Doiini - Modern Task Management',
  description: 'A cyberpunk-themed task management application with Pomodoro timer and calendar integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} matrix-bg`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}