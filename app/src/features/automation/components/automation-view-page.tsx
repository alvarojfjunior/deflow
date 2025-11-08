import { Automation } from '@/models/Automation';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { notFound } from 'next/navigation';
import AutomationForm from './automation-form';
import { AutomationSafeDTO } from '@/types/automation';

type AutomationViewPageProps = {
  automationId: string;
};

export default async function AutomationViewPage({ automationId }: AutomationViewPageProps) {
  let automation: AutomationSafeDTO | null = null;
  let pageTitle = 'Create New Automation';

  if (automationId !== 'new') {
    await connectToDatabase();

    const { userId } = await auth();

    if (userId) {
      const user = await User.findOne({ authId: userId });
      if (user) {
        const automationData = await Automation.findOne({ _id: automationId, userId: user._id }).lean();
        if (automationData) {
          const typedAutomationData = automationData as any;
          automation = {
            _id: typedAutomationData._id.toString(),
            userId: typedAutomationData.userId.toString(),
            name: typedAutomationData.name ?? '',
            description: typedAutomationData.description ?? '',
            status: typedAutomationData.status,
            strategy: {
              name: typedAutomationData.strategy?.name,
              params: typedAutomationData.strategy?.params
            },
            createdAt: typedAutomationData.createdAt,
            updatedAt: typedAutomationData.updatedAt
          };
        }
      }
    }

    if (!automation) {
      notFound();
    }

    pageTitle = 'Edit Automation';
  }

  return <AutomationForm initialData={automation} pageTitle={pageTitle} />;
}