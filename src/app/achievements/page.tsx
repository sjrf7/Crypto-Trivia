
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ACHIEVEMENTS } from '@/lib/mock-data';
import { Award, CheckCircle, Loader, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

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

export default function AchievementsPage() {
  const [minting, setMinting] = useState<string | null>(null);
  const [minted, setMinted] = useState<string[]>([]);

  // This is a placeholder for actual user data.
  // In a real app, you would fetch this from a user profile or onchain data.
  const unlockedAchievementIds = ['first-game', 'novice-quizzer', 'crypto-enthusiast'];

  const handleMint = (achievementId: string) => {
    setMinting(achievementId);
    // Simulate a blockchain transaction
    setTimeout(() => {
      setMinting(null);
      setMinted((prev) => [...prev, achievementId]);
    }, 2500);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary drop-shadow-glow-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Achievements</CardTitle>
              <CardDescription>Mint your unlocked achievements as onchain Soul-Bound Tokens (SBTs) on Base.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MotionDiv 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievementIds.includes(achievement.id);
              const isMinted = minted.includes(achievement.id);
              const isMinting = minting === achievement.id;

              return (
                <motion.div key={achievement.id} variants={itemVariants}>
                  <Card 
                    className={`relative overflow-hidden transition-all duration-300 flex flex-col h-full ${!isUnlocked ? 'opacity-50' : 'border-primary shadow-primary/20 hover:shadow-primary/40 hover:scale-105'}`}
                  >
                    {isUnlocked && (
                      <div className={`absolute top-2 right-2 rounded-full p-1 ${isMinted ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                        {isMinted ? <ShieldCheck className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </div>
                    )}
                    <CardHeader className="items-center text-center">
                      <div className={`p-4 rounded-full mb-2 ${isUnlocked ? 'bg-primary/10' : 'bg-secondary'}`}>
                        <achievement.icon className={`h-12 w-12 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-xl font-headline">{achievement.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground flex-grow">
                      {achievement.description}
                    </CardContent>
                    <CardContent className="mt-auto">
                      {isUnlocked && (
                        isMinted ? (
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="https://sepolia.basescan.org/" target="_blank">
                              View on BaseScan
                            </Link>
                          </Button>
                        ) : (
                          <Button className="w-full" onClick={() => handleMint(achievement.id)} disabled={isMinting}>
                            {isMinting ? <Loader className="animate-spin mr-2" /> : null}
                            {isMinting ? 'Minting...' : 'Mint NFT'}
                          </Button>
                        )
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </MotionDiv>
        </CardContent>
      </Card>
    </div>
  );
}
