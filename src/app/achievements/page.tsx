import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ACHIEVEMENTS } from '@/lib/mock-data';
import { Award, CheckCircle } from 'lucide-react';

// This is a placeholder for actual user data.
// In a real app, you would fetch the authenticated user's unlocked achievements.
const unlockedAchievementIds = ['first-game', 'novice-quizzer'];

export default function AchievementsPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary drop-shadow-glow-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Achievements</CardTitle>
              <CardDescription>Complete challenges to unlock rewards.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievementIds.includes(achievement.id);
              return (
                <Card 
                  key={achievement.id}
                  className={`relative overflow-hidden transition-all duration-300 ${!isUnlocked ? 'opacity-50' : 'border-primary shadow-primary/20'}`}
                >
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  <CardHeader className="items-center text-center">
                    <div className={`p-4 rounded-full mb-2 ${isUnlocked ? 'bg-primary/10' : 'bg-secondary'}`}>
                      <achievement.icon className={`h-12 w-12 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <CardTitle className="text-xl font-headline">{achievement.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm text-muted-foreground">
                    {achievement.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
