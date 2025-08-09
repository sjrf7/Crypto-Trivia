import { LEADERBOARD_DATA } from '@/lib/mock-data';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboardData = LEADERBOARD_DATA;

  return (
    <div>
       <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-primary drop-shadow-glow-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Leaderboard</CardTitle>
              <CardDescription>See who's at the top of the crypto trivia world.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeaderboardTable data={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  );
}
