
'use client';

import { useAccount, useBalance, useEnsName } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function InfoRow({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
    const { toast } = useToast();

    const copyToClipboard = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast({
            title: `${label} Copied!`,
        });
    };

    return (
        <div className="flex items-center justify-between py-3 border-b">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2 font-mono text-sm">
                {children ? (
                    children
                ) : (
                    <>
                        <span>{value}</span>
                        {value && (
                             <Button onClick={copyToClipboard} variant="ghost" size="icon" className="h-7 w-7">
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export function WalletInfo() {
  const { address, chain } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address });
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({ address });

  const formattedBalance = balance ? parseFloat(balance.formatted).toFixed(5) : '0.00000';
  const explorerUrl = chain?.blockExplorers?.default.url;

  return (
    <motion.div variants={itemVariants}>
    <Card>
      <CardHeader>
        <CardTitle>Wallet Details</CardTitle>
      </CardHeader>
      <CardContent>
            <InfoRow label="ENS Name">
                {isEnsLoading ? <Skeleton className="h-5 w-32" /> : <span>{ensName || 'Not found'}</span>}
            </InfoRow>
            <InfoRow label="Address" value={address}>
                {address && (
                    <>
                    <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <a href={`${explorerUrl}/address/${address}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5"/>
                            </a>
                        </Button>
                    </div>
                    </>
                )}
            </InfoRow>
            <InfoRow label="Network">
                 {chain ? (
                    <div className="flex items-center gap-2">
                        {chain.unsupported ? <AlertCircle className="h-4 w-4 text-destructive"/> : <CheckCircle className="h-4 w-4 text-green-500" />}
                        <span>{chain.name}</span>
                    </div>
                ) : <Skeleton className="h-5 w-24" />}
            </InfoRow>
             <InfoRow label="Balance">
                 {isBalanceLoading ? <Skeleton className="h-5 w-28" /> : <span>{formattedBalance} {balance?.symbol}</span>}
            </InfoRow>
      </CardContent>
    </Card>
    </motion.div>
  );
}
