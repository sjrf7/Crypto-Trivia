
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { Dock } from '@/components/layout/Dock';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { BackgroundMusicProvider } from '@/components/layout/BackgroundMusic';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // The sdk.ready() call signals to the Farcaster client that the Mini App
    // has finished loading and is ready for interaction.
    sdk.ready();
  }, []);

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          'flex flex-col'
        )}
      >
        <Providers>
         <BackgroundMusicProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 pb-24 relative">
              {children}
            </main>
            <Dock />
            <Toaster />
          </BackgroundMusicProvider>
        </Providers>
      </body>
    </html>
  );
}
