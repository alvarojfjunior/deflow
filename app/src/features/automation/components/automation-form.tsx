'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { AutomationFormData, AutomationSafeDTO } from '@/types/automation';
import { AutomationService } from '@/features/automation/api/automation-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import PoolAutomationForm from './strategies/pool-automation-form';
import { BlockchainNetwork } from '@/types/blockchain';
import { Separator } from '@/components/ui/separator';

const poolParamsSchema = z.object({
  blockchain: z.enum(['solana']),
  walletId: z.string().min(1, { message: 'Wallet is required' }),
  allocationMode: z.enum(['APR/TVL']),
  maxActivePools: z.number().int().min(1, { message: 'Must be at least 1' }),
  impermanentLossTolerancePer: z.number().min(0).max(100),
  exitOnTVLDropPer: z.number().min(0).max(100),
  exitOnAPRDropPer: z.number().min(0).max(100),
  maxTimeOutOfRange: z.number().int().min(0)
});

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  status: z.enum(['active', 'paused']).optional(),
  strategyName: z.enum(['poolAutomation']),
  strategy: z.object({
    params: poolParamsSchema
  })
});

export default function AutomationForm({
  initialData,
  pageTitle
}: {
  initialData: AutomationSafeDTO | null;
  pageTitle: string;
}) {
  const defaultValues: Partial<z.infer<typeof formSchema>> = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status === 'active' ? 'active' : 'paused',
    strategyName: (initialData?.strategy?.name as 'poolAutomation') || 'poolAutomation',
    strategy: {
      params: {
        blockchain: (initialData?.strategy?.params?.blockchain as 'solana') || 'solana',
        walletId: (initialData?.strategy?.params?.walletId as string) || '',
        allocationMode: (initialData?.strategy?.params?.allocationMode as 'APR/TVL') || 'APR/TVL',
        maxActivePools: (initialData?.strategy?.params?.maxActivePools as number) ?? 2,
        impermanentLossTolerancePer:
          (initialData?.strategy?.params?.impermanentLossTolerancePer as number) ?? 2,
        exitOnTVLDropPer: (initialData?.strategy?.params?.exitOnTVLDropPer as number) ?? 20,
        exitOnAPRDropPer: (initialData?.strategy?.params?.exitOnAPRDropPer as number) ?? 5,
        maxTimeOutOfRange: (initialData?.strategy?.params?.maxTimeOutOfRange as number) ?? 1000
      }
    }
  };

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const automationData: AutomationFormData = {
        name: values.name,
        description: values.description,
        status: values.status ?? 'paused',
        strategy: {
          name: values.strategyName,
          params: {
            blockchain: BlockchainNetwork.SOLANA,
            walletId: values.strategy.params.walletId,
            allocationMode: values.strategy.params.allocationMode,
            maxActivePools: values.strategy.params.maxActivePools,
            impermanentLossTolerancePer: values.strategy.params.impermanentLossTolerancePer,
            exitOnTVLDropPer: values.strategy.params.exitOnTVLDropPer,
            exitOnAPRDropPer: values.strategy.params.exitOnAPRDropPer,
            maxTimeOutOfRange: values.strategy.params.maxTimeOutOfRange
          }
        }
      };

      if (initialData) {
        await AutomationService.updateAutomation(initialData._id.toString(), automationData);
        toast.success('Automation updated successfully');
      } else {
        await AutomationService.createAutomation(automationData);
        toast.success('Automation created successfully');
      }
      router.push('/dashboard/automation');
      router.refresh();
    } catch (error) {
      logger.error('Error saving automation:', error);
      toast.error('Error saving automation');
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const selectedStrategy = form.watch('strategyName');

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
              placeholder='Enter automation name'
              required
            />
            <FormSelect
              control={form.control}
              name='status'
              label='Status'
              placeholder='Select status'
              options={[
                { label: 'Paused', value: 'paused' },
                { label: 'Active', value: 'active' }
              ]}
            />
            <FormTextarea
              control={form.control}
              name='description'
              label='Description'
              placeholder='Describe the automation (optional)'
              description='Briefly describe what this automation does.'
              config={{ rows: 4 }}
              className='md:col-span-2'
            />
            <FormSelect
              control={form.control}
              name='strategyName'
              label='Strategy'
              required
              placeholder='Select strategy'
              options={[{ label: 'Pool Automation', value: 'poolAutomation' }]}
            />
          </div>

          {selectedStrategy === 'poolAutomation' && (
            <div className='space-y-4'>
              <Separator />
              <p className='text-sm text-muted-foreground'>Strategy parameters</p>
              <PoolAutomationForm />
            </div>
          )}

          <Button type='submit'>
            {initialData ? 'Update Automation' : 'Create Automation'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}