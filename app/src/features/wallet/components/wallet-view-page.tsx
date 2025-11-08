import { Wallet } from '@/models/Wallet';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { notFound } from 'next/navigation';
import WalletForm from './wallet-form';
import { WalletSafeDTO } from '@/types/wallet';

type WalletViewPageProps = {
  walletId: string;
};

export default async function WalletViewPage({ walletId }: WalletViewPageProps) {
  let wallet: WalletSafeDTO | null = null;
  let pageTitle = 'Create New Wallet';

  if (walletId !== 'new') {
    await connectToDatabase();

    const { userId } = await auth();

    if (userId) {
      const user = await User.findOne({ authId: userId });
      if (user) {
        const walletData = await Wallet.findOne({ _id: walletId, userId: user._id }).lean();
        if (walletData) {
          const typedWalletData = walletData as any;
          wallet = {
            _id: typedWalletData._id.toString(),
            userId: typedWalletData.userId.toString(),
            name: typedWalletData.name ?? '',
            blockchain: typedWalletData.blockchain,
            secretStored: !!typedWalletData.secret,
            createdAt: typedWalletData.createdAt,
            updatedAt: typedWalletData.updatedAt
          };
        }
      }
    }

    if (!wallet) {
      notFound();
    }

    pageTitle = 'Edit Wallet';
  }

  return <WalletForm initialData={wallet} pageTitle={pageTitle} />;
}