import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import AutomationViewPage from '@/features/automation/components/automation-view-page';

export const metadata = {
  title: 'Dashboard : Automation View'
};

type PageProps = { params: Promise<{ automationId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}> 
          <AutomationViewPage automationId={params.automationId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}