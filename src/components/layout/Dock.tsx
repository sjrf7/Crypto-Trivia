
'use client';

import Link from 'next/link';
import { Gamepad2, Trophy, User, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Dock() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Play', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/achievements', label: 'Achievements', icon: Award },
    { href: '/profile/me', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="container grid grid-cols-4 items-center justify-items-center h-full text-center">
          {navLinks.map((link) => (
             <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className="flex items-center justify-center h-full w-full"
              >
                <motion.div
                  className={cn(
                      "flex flex-col items-center justify-center h-full w-full rounded-lg transition-colors p-2",
                      pathname === link.href ? 'text-primary' : 'text-foreground/60 hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <link.icon className="h-8 w-8" />
                </motion.div>
              </Link>
          ))}
      </nav>
    </div>
  );
}
