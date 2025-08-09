'use client';

import Link from 'next/link';
import { Bitcoin, Gamepad2, Trophy, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Play', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/profile/dwr', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-primary drop-shadow-glow-primary" />
            <span className="font-bold font-headline text-lg">
              Crypto Trivia Showdown
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 ml-auto">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'transition-colors hover:text-foreground/80',
                (pathname === link.href || (link.href.startsWith('/profile') && pathname.startsWith('/profile'))) ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              <Link
                href={link.href}
                className="flex items-center gap-2"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
