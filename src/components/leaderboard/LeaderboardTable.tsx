
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry, Player } from '@/lib/types';
import { ArrowUpDown, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/use-i18n';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/use-user-stats';
import { PLAYERS } from '@/lib/mock-data';
import { useFarcasterUser } from '@/hooks/use-farcaster-user';

type SortKey = 'rank' | 'totalScore';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

const RankCell = ({ rank }: { rank: number }) => {
  const medalColor = 
    rank === 1 ? 'text-yellow-400' :
    rank === 2 ? 'text-slate-400' :
    rank === 3 ? 'text-amber-700' :
    'text-sky-500';
  
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="font-medium text-lg w-6 text-center">{rank}</span>
      {rank <= 5 ? (
        <Medal className={cn('h-5 w-5', medalColor)} />
      ) : (
        <div className="h-5 w-5" /> // Placeholder to maintain alignment
      )}
    </div>
  );
}

export function LeaderboardTable({ data: initialData }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { t } = useI18n();

  const { farcasterUser } = useFarcasterUser();
  const isAuthenticated = !!farcasterUser;
  const { stats: userStats, updateRank, checkTopPlayerAchievement } = useUserStats(farcasterUser?.fid?.toString());
  
  const mergedData = useMemo(() => {
    const data = [...initialData];
    if (isAuthenticated && farcasterUser) {
        const userInLeaderboard = data.find(entry => entry.player.id === (farcasterUser.username || `fid-${farcasterUser.fid}`));
        if (userInLeaderboard) {
            // Update existing user in leaderboard
            userInLeaderboard.player.stats = userStats;
        } else {
            // Add new user to leaderboard
            const newPlayer: Player = {
                id: farcasterUser.username || `fid-${farcasterUser.fid}`,
                name: farcasterUser.display_name || `User ${farcasterUser.fid}`,
                avatar: farcasterUser.pfp_url || '',
                stats: userStats,
                achievements: userStats.unlockedAchievements,
            };
            data.push({ rank: 0, player: newPlayer });
        }
    }
     // Sort by score to determine ranks
    return data
        .sort((a, b) => b.player.stats.totalScore - a.player.stats.totalScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

  }, [initialData, isAuthenticated, farcasterUser, userStats]);


  const sortedData = useMemo(() => {
    return [...mergedData].sort((a, b) => {
      let valA, valB;

      switch(sortKey) {
        case 'rank':
          valA = a.rank;
          valB = b.rank;
          break;
        case 'totalScore':
          valA = a.player.stats.totalScore;
          valB = b.player.stats.totalScore;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });
  }, [mergedData, sortKey, sortDirection]);

  useEffect(() => {
      if(isAuthenticated && farcasterUser) {
          const userEntry = sortedData.find(e => e.player.id === (farcasterUser.username || `fid-${farcasterUser.fid}`));
          if(userEntry) {
              updateRank(userEntry.rank);
              checkTopPlayerAchievement();
          }
      }
  }, [sortedData, isAuthenticated, farcasterUser, updateRank, checkTopPlayerAchievement]);


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection(key === 'rank' ? 'asc' : 'desc');
    }
  };

  const SortableHeader = ({ tkey, label, className }: { tkey: SortKey; label: string, className?: string }) => (
    <TableHead className={className}>
      <Button variant="ghost" onClick={() => handleSort(tkey)}>
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center px-2">
                <Button variant="ghost" onClick={() => handleSort('rank')}>
                    {t('leaderboard.table.rank')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead>{t('leaderboard.table.player')}</TableHead>
            <TableHead className="text-center">
                 <Button variant="ghost" onClick={() => handleSort('totalScore')}>
                    {t('leaderboard.table.score')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, i) => (
            <motion.tr
              key={entry.player.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className={cn(
                  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
                  isAuthenticated && farcasterUser && (entry.player.id === farcasterUser.username || entry.player.id === `fid-${farcasterUser.fid}`) && "bg-primary/20 hover:bg-primary/30"
              )}
            >
              <TableCell className="p-0 text-center">
                  <RankCell rank={entry.rank} />
              </TableCell>
              <TableCell className="p-2">
                <Link href={`/profile/${entry.player.id}`} className="flex items-center gap-3 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.player.avatar} alt={entry.player.name} data-ai-hint="profile picture" />
                    <AvatarFallback>{entry.player.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:text-primary transition-colors">{entry.player.name}</span>
                </Link>
              </TableCell>
              <TableCell className="p-2 font-bold text-primary text-center">{entry.player.stats.totalScore.toLocaleString('en-US')}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
