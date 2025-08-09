'use client';

import Link from 'next/link';
import { Gamepad2, Trophy, User } from 'lucide-react';
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

export function Dock() {
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
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="container flex items-center justify-around h-full">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                'flex-col h-full px-2',
                pathname === link.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              <Link
                href={link.href}
                className="flex flex-col items-center justify-center h-full gap-1"
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs">{link.label}</span>
              </Link>
            </Button>
          ))}
          {isAuthenticated ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="flex-col h-full px-2 text-foreground/60">
                   <div className="flex flex-col items-center justify-center h-full gap-1">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={pfpUrl} alt={displayName} data-ai-hint="profile picture" />
                            <AvatarFallback>{displayName?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">Profile</span>
                    </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2">
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
  );
}
