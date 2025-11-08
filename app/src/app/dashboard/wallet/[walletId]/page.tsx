import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import WalletViewPage from '@/features/wallet/components/wallet-view-page';

export const metadata = {
  title: 'Dashboard : Wallet View'
};

type PageProps = { params: Promise<{ walletId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}> 
          <WalletViewPage walletId={params.walletId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}