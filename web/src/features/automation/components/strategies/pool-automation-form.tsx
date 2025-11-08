'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormSelect } from '@/components/forms/form-select';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { WalletService } from '@/features/wallet/api/wallet-service';
import { FormInput } from '@/components/forms/form-input';

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

      {/* Allocation Mode */}
      <FormSelect
        control={control}
        name={'strategy.params.allocationMode'}
        label='Allocation mode'
        required
        placeholder='Select allocation mode'
        options={[{ label: 'APR/TVL', value: 'APR/TVL' }]}
      />

      {/* Max Active Pools */}
      <FormInput
        control={control}
        name={'strategy.params.maxActivePools'}
        label='Max active pools'
        type='number'
        min={1}
        step={1}
        required
      />

      {/* IL Tolerance (%) */}
      <FormInput
        control={control}
        name={'strategy.params.impermanentLossTolerancePer'}
        label='IL tolerance (%)'
        type='number'
        min={0}
        max={100}
        step={1}
        required
      />

      {/* Exit on TVL drop (%) */}
      <FormInput
        control={control}
        name={'strategy.params.exitOnTVLDropPer'}
        label='Exit on TVL drop (%)'
        type='number'
        min={0}
        max={100}
        step={1}
        required
      />

      {/* Exit on APR drop (%) */}
      <FormInput
        control={control}
        name={'strategy.params.exitOnAPRDropPer'}
        label='Exit on APR drop (%)'
        type='number'
        min={0}
        max={100}
        step={1}
        required
      />

      {/* Max time out of range */}
      <FormInput
        control={control}
        name={'strategy.params.maxTimeOutOfRange'}
        label='Max time out of range (min)'
        type='number'
        min={0}
        step={1}
        required
      />
    </div>
  );
}