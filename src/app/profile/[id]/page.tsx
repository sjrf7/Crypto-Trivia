
'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, useParams } from 'next/navigation';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { SignInButton } from '@/components/profile/SignInButton';
import { Card as UICard, CardContent as UICardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { user, isAuthenticated, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    setIsLoading(true);
    let playerId = id;

    if (id === 'me') {
      if (isUserLoading) {
        // Wait for user loading to complete
        setIsLoading(true);
        return;
      }
      if (isAuthenticated && user?.username) {
        playerId = user.username;
      } else {
        // Not authenticated, show sign-in prompt
        setPlayer(null);
        setIsLoading(false);
        return;
      }
    }
    
    // Find player in mock data. In a real app, you'd fetch from an API.
    // For this example, we'll try to find a logged-in user in our mock data.
    const foundPlayer = PLAYERS.find((p) => p.id.toLowerCase() === playerId.toLowerCase());
    
    if (foundPlayer) {
      setPlayer(foundPlayer);
    } else if (id === 'me' && isAuthenticated && user) {
        // If the logged-in user is not in our mock data, create a temporary player object.
        setPlayer({
            id: user.username!,
            name: user.displayName || user.username!,
            avatar: user.pfpUrl || `https://placehold.co/128x128.png`,
            stats: {
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
      setPlayer(null);
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
