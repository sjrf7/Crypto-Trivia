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
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

const FarcasterIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 mx-auto"
    >
      <path
        d="M13.25 4.5H10.75L9 6.25V10.75L10.75 12.5H13.25L15 10.75V6.25L13.25 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.5H15V17.75L12 19.5L9 17.75V13.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

export function Dock() {
  const pathname = usePathname();
  const {
    profile: {
      data: userProfile,
      isAuthenticated,
    },
    signOut,
  } = useProfile();

  const navLinks = [
    { href: '/', label: 'Play', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="container grid grid-cols-3 items-center justify-items-center h-full text-center">
          {navLinks.map((link) => (
             <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={cn(
                    "flex flex-col items-center justify-center h-full w-full rounded-lg",
                    pathname === link.href ? 'text-primary' : 'text-foreground/60 hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                <link.icon className="h-8 w-8" />
              </Link>
          ))}
          {isAuthenticated ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="Profile" className="flex flex-col items-center justify-center h-full w-full rounded-lg text-foreground/60 hover:bg-accent/50 hover:text-accent-foreground">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.pfpUrl} alt={userProfile?.displayName ?? ''} data-ai-hint="profile picture" />
                        <AvatarFallback>{userProfile?.displayName?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="mb-2 w-48" side="top">
                <DropdownMenuItem asChild>
                  <Link href="/profile/me">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                   <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton>
                <button title="Sign In" className="flex flex-col items-center justify-center h-full w-full rounded-lg text-foreground/60 hover:bg-accent/50 hover:text-accent-foreground">
                    <FarcasterIcon />
                </button>
            </SignInButton>
          )}
      </nav>
    </div>
  );
}
