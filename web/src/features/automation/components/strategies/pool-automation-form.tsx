'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormSelect } from '@/components/forms/form-select';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { WalletService } from '@/features/wallet/api/wallet-service';

export default function PoolAutomationForm() {
  const { control } = useFormContext();
  const [walletOptions, setWalletOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function fetchWallets() {
      try {
        const wallets = await WalletService.getWallets();
        setWalletOptions(wallets.map((w) => ({ label: w.name, value: w._id.toString() })));
      } catch (error) {
        logger.error('Error fetching wallets:', error);
        toast.error('Error fetching wallets');
      }
    }

    fetchWallets();
  }, []);

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <FormSelect
        control={control}
        name={'strategy.params.blockchain'}
        label='Blockchain'
        required
        placeholder='Select blockchain'
        options={[{ label: 'Solana', value: 'solana' }]}
      />
      <FormSelect
        control={control}
        name={'strategy.params.walletId'}
        label='Wallet'
        required
        placeholder='Select wallet'
        options={walletOptions}
      />
    </div>
  );
}