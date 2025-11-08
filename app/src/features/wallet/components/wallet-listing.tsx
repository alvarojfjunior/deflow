import { searchParamsCache } from '@/lib/searchparams';
import { WalletTable } from './wallet-tables';
import { columns } from './wallet-tables/columns';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import type { WalletSafeDTO } from '@/types/wallet';

export default async function WalletListingPage() {
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');

  await connectToDatabase();

  const { userId } = await auth();
  let wallets: WalletSafeDTO[] = [];
  let totalWallets = 0;

  if (userId) {
    const user = await User.findOne({ authId: userId });
    if (user) {
      const { Wallet } = await import('@/models/Wallet');

      let query: any = { userId: user._id };
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const skip = ((page || 1) - 1) * (pageLimit || 10);
      const limit = pageLimit || 10;

      const walletData = await Wallet.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      totalWallets = await Wallet.countDocuments(query);

      wallets = walletData.map((w: any) => ({
        _id: w._id.toString(),
        userId: w.userId.toString(),
        name: w.name,
        blockchain: w.blockchain,
        secretStored: !!w.secret,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt
      }));
    }
  }

  return <WalletTable data={wallets} totalItems={totalWallets} columns={columns} />;
}