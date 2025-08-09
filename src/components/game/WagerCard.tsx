
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Swords } from 'lucide-react';

interface WagerCardProps {
  challenger: string;
  wager: number;
  onAccept: () => void;
  onDecline: () => void;
}

export function WagerCard({ challenger, wager, onAccept, onDecline }: WagerCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="w-full max-w-md text-center shadow-2xl border-2 border-primary">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Swords className="h-10 w-10 text-primary drop-shadow-glow-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">A Duel is Proposed!</CardTitle>
                <CardDescription>
                    <span className="font-bold text-accent">{challenger}</span> has challenged you to a trivia showdown.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg">The proposed wager is:</p>
                <div className="text-4xl font-bold text-primary">{wager} ETH</div>
                <p className="text-xs text-muted-foreground">(On Base Sepolia Testnet)</p>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button onClick={onAccept} className="w-full" size="lg">
                    Accept Wager & Play
                </Button>
                <Button onClick={onDecline} variant="ghost" className="w-full">
                    Decline & Go Home
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4">
                    <Shield className="h-4 w-4"/>
                    <span>Funds will be held in a secure escrow contract.</span>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
