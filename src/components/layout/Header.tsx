'use client';

import Link from 'next/link';
import { Bitcoin, Gamepad2, Trophy, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignInButton, useProfile } from '@farcaster/auth-kit';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const {
    profile: {
      data,
      isAuthenticated,
    },
  } = useProfile();

  const pfpUrl = data?.pfpUrl;
  const displayName = data?.displayName;

  const navLinks = [
    { href: '/', label: 'Play', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-2 md:mr-6 flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-primary drop-shadow-glow-primary" />
            <span className="font-bold font-headline text-lg hidden sm:inline-block">
              Crypto Trivia
            </span>
             <span className="font-bold font-headline text-lg hidden lg:inline-block">
              Showdown
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2 ml-auto">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              <Link
                href={link.href}
                className="flex items-center gap-2 px-2 sm:px-3"
              >
                <link.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            </Button>
          ))}
          {isAuthenticated ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="flex items-center gap-2 px-2 sm:px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={pfpUrl} alt={displayName} data-ai-hint="profile picture" />
                    <AvatarFallback>{displayName?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile/me">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                   <SignInButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="px-2 sm:px-3">
              <SignInButton />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
