import { PLAYERS } from '@/lib/mock-data';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
    return PLAYERS.map((player) => ({
      id: player.id,
    }));
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const player = PLAYERS.find((p) => p.id === params.id);

  if (!player) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <ProfileCard player={player} />
    </div>
  );
}
