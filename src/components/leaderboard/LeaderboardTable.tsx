
'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type SortKey = 'rank' | 'totalScore' | 'gamesPlayed';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        case 'gamesPlayed':
          valA = a.player.stats.gamesPlayed;
          valB = b.player.stats.gamesPlayed;
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

  const SortableHeader = ({ tkey, label }: { tkey: SortKey; label: string }) => (
    <TableHead>
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
            <SortableHeader tkey="rank" label="Rank" />
            <TableHead>Player</TableHead>
            <SortableHeader tkey="totalScore" label="Score" />
            <SortableHeader tkey="gamesPlayed" label="Games Played" />
            <TableHead>Accuracy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry) => (
            <TableRow key={entry.player.id}>
              <TableCell className="font-medium text-lg">{entry.rank}</TableCell>
              <TableCell>
                <Link href={`/profile/${entry.player.id}`} className="flex items-center gap-4 group">
                  <Avatar>
                    <AvatarImage src={entry.player.avatar} alt={entry.player.name} data-ai-hint="profile picture" />
                    <AvatarFallback>{entry.player.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:text-primary transition-colors">{entry.player.name}</span>
                </Link>
              </TableCell>
              <TableCell className="font-bold text-primary">{entry.player.stats.totalScore.toLocaleString()}</TableCell>
              <TableCell>{entry.player.stats.gamesPlayed}</TableCell>
              <TableCell className="text-accent">{entry.player.stats.accuracy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
