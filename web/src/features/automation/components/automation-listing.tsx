import { searchParamsCache } from '@/lib/searchparams';
import { AutomationTable } from './automation-tables';
import { columns } from './automation-tables/columns';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import type { AutomationSafeDTO } from '@/types/automation';

export default async function AutomationListingPage() {
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');

  await connectToDatabase();

  const { userId } = await auth();
  let automations: AutomationSafeDTO[] = [];
  let totalAutomations = 0;

  if (userId) {
    const user = await User.findOne({ authId: userId });
    if (user) {
      const { Automation } = await import('@/models/Automation');

      let query: any = { userId: user._id };
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const skip = ((page || 1) - 1) * (pageLimit || 10);
      const limit = pageLimit || 10;

      const automationData = await Automation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      totalAutomations = await Automation.countDocuments(query);

      automations = automationData.map((a: any) => ({
        _id: a._id.toString(),
        userId: a.userId.toString(),
        name: a.name,
        description: a.description,
        status: a.status,
        strategy: {
          name: a.strategy?.name,
          params: a.strategy?.params,
        },
        createdAt: a.createdAt,
        updatedAt: a.updatedAt
      }));
    }
  }

  return <AutomationTable data={automations} totalItems={totalAutomations} columns={columns} />;
}