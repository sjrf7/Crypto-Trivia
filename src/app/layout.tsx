
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { Dock } from '@/components/layout/Dock';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { BackgroundMusicProvider } from '@/components/layout/BackgroundMusic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://crypto-trivia.vercel.app';

export const metadata: Metadata = {
  title: 'Crypto Trivia Showdown',
  description: 'An AI-Powered Crypto Trivia Game for Farcaster.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'Crypto Trivia Showdown',
    description: 'An AI-Powered Crypto Trivia Game for Farcaster.',
    images: [`/splash.png`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${APP_URL}/splash.png`,
    'fc:frame:button:1': 'Start Game',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${APP_URL}/play`,
  },
};


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
