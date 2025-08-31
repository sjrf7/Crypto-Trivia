
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
    // This is a workaround to avoid a TypeError, as the library
    // doesn't seem to export a class or a default object correctly.
    // We directly call the method on the imported object.
    try {
        sdk.actions.ready();
    } catch(e) {
        console.log('Farcaster SDK not available.')
    }
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
