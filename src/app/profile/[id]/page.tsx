'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, useParams } from 'next/navigation';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '@farcaster/auth-kit';
import { SignInButton } from '@/components/profile/SignInButton';
import { Card as UICard, CardContent as UICardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { isAuthenticated, profile: user, loading: isUserLoading } = useProfile();

  useEffect(() => {
    setIsLoading(true);

    // Case 1: The user is viewing their own profile (/profile/me)
    if (id === 'me') {
      if (isUserLoading) {
        // We are still waiting to see if the user is logged in
        return; 
      }

      if (isAuthenticated && user) {
        // User is logged in, create a profile for them on the fly
        setPlayer({
          id: user.username || `fid-${user.fid}`,
          name: user.displayName || user.username || `User ${user.fid}`,
          avatar: user.pfpUrl || `https://placehold.co/128x128.png`,
          stats: { // Default stats for a new user
            totalScore: 0,
            gamesPlayed: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            accuracy: '0%',
            topRank: null,
          },
          achievements: [],
        });
      } else {
        // User is not logged in and trying to see 'me', show nothing (SignIn prompt will be rendered)
        setPlayer(null);
      }
    
    // Case 2: The user is viewing a specific profile (e.g., /profile/vitalik)
    } else {
      const foundPlayer = PLAYERS.find((p) => p.id.toLowerCase() === id.toLowerCase());
      setPlayer(foundPlayer || null);
    }

    setIsLoading(false);

  }, [id, user, isAuthenticated, isUserLoading]);


  if (isLoading || isUserLoading) {
    return (
       <Card>
            <CardHeader>
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-10 w-48 mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center bg-secondary p-4 rounded-lg text-center">
                            <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-6 w-10" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
  }

  if (!player && id === 'me' && !isAuthenticated) {
    return (
      <UICard className="w-full max-w-md mx-auto text-center">
        <UICardContent className="pt-6">
            <h2 className="text-2xl font-headline mb-4">View Your Profile</h2>
            <p className="text-muted-foreground mb-6">Sign in with Farcaster to track your stats, view achievements, and more.</p>
            <SignInButton />
        </UICardContent>
      </UICard>
    )
  }

  if (!player) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <ProfileCard player={player} />
    </div>
  );
}


// Helper components for skeleton loading, assuming they are defined elsewhere or defined here
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;