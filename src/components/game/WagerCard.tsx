
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';
import { Shield, Swords } from 'lucide-react';
import { useFarcasterIdentity } from '@/hooks/use-farcaster-identity.tsx';
import { useEffect } from 'react';

interface WagerCardProps {
  challenger: string;
  wager: number;
  message?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function WagerCard({ challenger, wager, message, onAccept, onDecline }: WagerCardProps) {
  const { t } = useI18n();
  const { identity, connect, loading } = useFarcasterIdentity();
  const isAuthenticated = !!identity.profile;

  const defaultMessage = t('wager.default_message');
  
  useEffect(() => {
    // If user is not authenticated when this component loads, prompt them to connect.
    if (!isAuthenticated && !loading) {
      connect();
    }
  }, [isAuthenticated, loading, connect]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="w-full max-w-md text-center shadow-2xl border-2 border-primary">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Swords className="h-10 w-10 text-primary drop-shadow-glow-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">{t('wager.title')}</CardTitle>
                <CardDescription>
                  {t('wager.description', { challenger })}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-secondary p-4 rounded-lg italic">
                  <p>"{message || defaultMessage}"</p>
                </div>
                <p className="text-lg pt-4">{t('wager.wager_is')}</p>
                <div className="text-4xl font-bold text-primary">{wager > 0 ? `${wager} ETH` : t('wager.for_glory')}</div>
                {wager > 0 && <p className="text-xs text-muted-foreground">{t('wager.on_testnet')}</p>}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                {isAuthenticated ? (
                  <Button onClick={onAccept} className="w-full" size="lg">
                    {t('wager.accept_button')}
                  </Button>
                ) : (
                  <Button onClick={connect} className="w-full" size="lg" disabled={loading}>
                    {loading ? "Connecting..." : t('wager.accept_button')}
                  </Button>
                )}
                <Button onClick={onDecline} variant="ghost" className="w-full">
                  {t('wager.decline_button')}
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4">
                    <Shield className="h-4 w-4"/>
                    <span>{t('wager.escrow_notice')}</span>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
