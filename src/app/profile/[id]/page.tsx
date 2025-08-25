
'use client';

import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound, useParams } from 'next/navigation';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    setIsLoading(true);

    if (!id) {
        return;
    }
    
    const foundPlayer = PLAYERS.find((p) => p.id === id);
    if (foundPlayer) {
      setPlayer(foundPlayer);
    } else {
      // If no player is found for a specific ID, show 404.
      // This also handles the case for '/profile/me' gracefully.
      notFound();
      return;
    }
    
    setIsLoading(false);

  }, [id]);


  if (isLoading) {
    return (
       <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center">
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
