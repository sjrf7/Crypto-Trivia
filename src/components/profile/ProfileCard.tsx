import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/lib/types';
import { Award, Target, Gamepad2, Percent, Star } from 'lucide-react';

interface ProfileCardProps {
  player: Player;
}

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null }) => (
    <div className="flex flex-col items-center justify-center bg-secondary p-4 rounded-lg text-center">
        <Icon className="h-8 w-8 text-primary mb-2 drop-shadow-glow-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value ?? 'N/A'}</p>
    </div>
)

export function ProfileCard({ player }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
          <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="profile picture" />
          <AvatarFallback className="text-4xl">{player.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-4xl">{player.name}</CardTitle>
        <CardDescription>Crypto Trivia Enthusiast</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <StatItem icon={Award} label="Top Rank" value={player.stats.topRank} />
            <StatItem icon={Star} label="Total Score" value={player.stats.totalScore.toLocaleString()} />
            <StatItem icon={Gamepad2} label="Games Played" value={player.stats.gamesPlayed} />
            <StatItem icon={Target} label="Questions Answered" value={player.stats.questionsAnswered} />
            <StatItem icon={Percent} label="Accuracy" value={player.stats.accuracy} />
        </div>
      </CardContent>
    </Card>
  );
}
