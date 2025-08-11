
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/lib/types';
import { Award, Target, Gamepad2, Percent, Star } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/mock-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileCardProps {
  player: Player;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const StatItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | null }) => (
    <motion.div 
        className="flex flex-col items-center justify-center bg-secondary p-4 rounded-lg text-center"
        variants={itemVariants}
        whileHover={{scale: 1.05}}
    >
        <Icon className="h-8 w-8 text-primary mb-2 drop-shadow-glow-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value ?? 'N/A'}</p>
    </motion.div>
)

export function ProfileCard({ player }: ProfileCardProps) {
  const unlockedAchievements = player.achievements ? ACHIEVEMENTS.filter(ach => player.achievements.includes(ach.id)) : [];

  if (!player) {
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
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <motion.div variants={itemVariants}>
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="profile picture" />
                <AvatarFallback className="text-4xl">{player.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
        </motion.div>
        <motion.div variants={itemVariants}>
            <CardTitle className="font-headline text-4xl">{player.name}</CardTitle>
        </motion.div>
        <motion.div variants={itemVariants} transition={{delay: 0.1}}>
            <CardDescription>Crypto Trivia Enthusiast</CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6"
            variants={containerVariants}
        >
            <StatItem icon={Award} label="Top Rank" value={player.stats.topRank} />
            <StatItem icon={Star} label="Total Score" value={player.stats.totalScore.toLocaleString('en-US')} />
            <StatItem icon={Gamepad2} label="Games Played" value={player.stats.gamesPlayed} />
            <StatItem icon={Target} label="Questions Answered" value={player.stats.questionsAnswered} />
            <StatItem icon={Percent} label="Accuracy" value={player.stats.accuracy} />
        </motion.div>
      </CardContent>
      {unlockedAchievements.length > 0 && (
        <CardFooter className="flex-col items-start gap-4 pt-6">
            <motion.h3 className="font-headline text-2xl" variants={itemVariants}>Achievements</motion.h3>
            <motion.div className="flex flex-wrap gap-4" variants={containerVariants}>
            <TooltipProvider>
                {unlockedAchievements.map((ach) => (
                    <Tooltip key={ach.id}>
                        <TooltipTrigger asChild>
                           <motion.div variants={itemVariants} whileHover={{scale: 1.1, rotate: 5}}>
                             <div className="flex items-center justify-center bg-secondary p-4 rounded-lg h-20 w-20 cursor-pointer">
                                <ach.icon className="h-10 w-10 text-accent drop-shadow-glow-accent" />
                            </div>
                           </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold">{ach.name}</p>
                            <p>{ach.description}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
            </motion.div>
        </CardFooter>
      )}
    </Card>
    </motion.div>
  );
}

