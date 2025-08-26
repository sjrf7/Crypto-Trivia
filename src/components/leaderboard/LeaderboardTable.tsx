
'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/hooks/use-i18n';

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

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { t } = useI18n();

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
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
  }, [data, sortKey, sortDirection]);

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
            <TableHead className="w-[80px] px-2 text-center">
                <Button variant="ghost" onClick={() => handleSort('rank')}>
                    {t('leaderboard.table.rank')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead className="text-center">{t('leaderboard.table.player')}</TableHead>
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
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell className="py-2 px-2 text-center font-medium text-lg">{entry.rank}</TableCell>
              <TableCell className="py-2 px-2">
                <Link href={`/profile/${entry.player.id}`} className="flex items-center justify-center gap-3 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.player.avatar} alt={entry.player.name} data-ai-hint="profile picture" />
                    <AvatarFallback>{entry.player.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:text-primary transition-colors">{entry.player.name}</span>
                </Link>
              </TableCell>
              <TableCell className="py-2 px-2 font-bold text-primary text-center">{entry.player.stats.totalScore.toLocaleString('en-US')}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
