'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { WalletFormData, WalletSafeDTO } from '@/types/wallet';
import { WalletService } from '@/features/wallet/api/wallet-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  blockchain: z.enum(['solana']),
  privateKey: z.string().min(1, { message: 'Private key is required' })
});

export default function WalletForm({
  initialData,
  pageTitle
}: {
  initialData: WalletSafeDTO | null;
  pageTitle: string;
}) {
  const defaultValues: Partial<z.infer<typeof formSchema>> = {
    name: initialData?.name || '',
    blockchain: initialData?.blockchain || 'solana',
    privateKey: ''
  };

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const walletData: WalletFormData = {
        name: values.name,
        blockchain: values.blockchain,
        privateKey: values.privateKey
      };

      if (initialData) {
        await WalletService.updateWallet(initialData._id.toString(), walletData);
        toast.success('Wallet updated successfully');
      } else {
        await WalletService.createWallet(walletData);
        toast.success('Wallet created successfully');
      }
      router.push('/dashboard/wallet');
      router.refresh();
    } catch (error) {
      logger.error('Error saving wallet:', error);
      toast.error('Error saving wallet');
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormInput
              control={form.control}
              name='name'
              label='Name'
              placeholder='Enter wallet name'
              required
            />
            <FormSelect
              control={form.control}
              name='blockchain'
              label='Blockchain'
              required
              placeholder='Select blockchain'
              options={[{ label: 'Solana', value: 'solana' }]}
            />
            <FormInput
              control={form.control}
              name='privateKey'
              type='password'
              label='Private Key'
              placeholder='Enter private key'
              required={!initialData}
              autoComplete='off'
              spellCheck={false}
              description='Never stored in plaintext. Encrypted at rest using AES-256-GCM.'
            />
          </div>
          <Button type='submit'>
            {initialData ? 'Update Wallet' : 'Create Wallet'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}