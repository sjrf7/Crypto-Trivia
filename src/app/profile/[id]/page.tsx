
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
import { useI18n } from '@/hooks/use-i18n';

function ProfilePageContent() {
  const [player, setPlayer] = useState<Player | null>(null);
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { isAuthenticated, profile: user, loading: isUserLoading } = useProfile();
  const { t } = useI18n();

  useEffect(() => {
    // This effect's job is to figure out which player to display.
    
    // Don't do anything until the Farcaster auth state is resolved.
    if (isUserLoading) {
        return;
    }

    // Case 1: The user is viewing their own profile (/profile/me)
    if (id === 'me') {
      if (isAuthenticated && user) {
        // The user is logged in. Create a profile for them on the fly.
        setPlayer({
          id: user.username || `fid-${user.fid}`,
          name: user.displayName || user.username || `User ${user.fid}`,
          avatar: user.pfpUrl || `https://placehold.co/128x128.png`,
          stats: { // Default stats for a new user, or could be fetched from a DB
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
        // The user is not logged in and trying to see their own profile.
        // Set player to null to trigger the Sign In prompt.
        setPlayer(null);
      }
    
    // Case 2: The user is viewing a specific profile (e.g., /profile/vitalik)
    } else {
      const foundPlayer = PLAYERS.find((p) => p.id.toLowerCase() === id.toLowerCase());
      setPlayer(foundPlayer || null);
    }

  }, [id, user, isAuthenticated, isUserLoading]);


  if (isUserLoading) {
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

  // After loading, if the user is on /profile/me and not authenticated, show the sign-in card.
  if (id === 'me' && !isAuthenticated) {
    return (
      <UICard className="w-full max-w-md mx-auto text-center">
        <UICardContent className="pt-6">
            <h2 className="text-2xl font-headline mb-4">{t('profile.sign_in.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('profile.sign_in.description')}</p>
            <SignInButton />
        </UICardContent>
      </UICard>
    )
  }

  // After loading, if no player could be found (e.g., /profile/non-existent-user), show 404.
  if (!player && id !== 'me') {
    notFound();
  }
  
  if (player) {
    // If we have a player, show their profile.
    return (
      <div className="container mx-auto">
        <ProfileCard player={player} />
      </div>
    );
  }
  
  // Default case if something goes wrong, or if it's /me and the player hasn't been created yet.
  return null;
}

export default function ProfilePage() {
  // We can wrap the content component with the provider
  // if we need i18n but the page itself is a server component.
  // In this case, the whole page is a client component, so it's okay.
  return <ProfilePageContent />;
}


// Helper components for skeleton loading, assuming they are defined elsewhere or defined here
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
