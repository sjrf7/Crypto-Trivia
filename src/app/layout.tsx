import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { Dock } from '@/components/layout/Dock';

export const metadata: Metadata = {
  title: 'Crypto Trivia Showdown',
  description: 'AI-Powered Crypto Trivia Game for Farcaster',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          'flex flex-col'
        )}
      >
        <Providers>
          <main className="flex-grow container mx-auto px-4 py-8 pb-24">
            {children}
          </main>
          <Dock />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
