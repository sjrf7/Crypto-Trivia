import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { AuthKitProvider } from '@farcaster/auth-kit';

export const metadata: Metadata = {
  title: 'Crypto Trivia Showdown',
  description: 'AI-Powered Crypto Trivia Game for Farcaster',
};

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'example.com',
  siweUri: 'https://example.com/login',
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
        <AuthKitProvider config={farcasterAuthConfig}>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </AuthKitProvider>
      </body>
    </html>
  );
}
