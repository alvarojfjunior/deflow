import { Wallet } from '@/models/Wallet';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { encryptSecret, redactSecret } from '@/lib/crypto';

// GET /api/wallets - List all wallets for the user (sanitized)
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ authId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const wallets = await Wallet.find({ userId: user._id });

    const sanitized = wallets.map((w) => ({
      _id: w._id,
      userId: w.userId,
      name: w.name,
      blockchain: w.blockchain,
      secretStored: !!w.secret,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt
    }));

    return NextResponse.json({ wallets: sanitized });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ error: 'Error fetching wallets' }, { status: 500 });
  }
}

// POST /api/wallets - Create a new wallet
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, blockchain, privateKey } = body as {
      name: string;
      blockchain: 'solana';
      privateKey: string;
    };

    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (blockchain !== 'solana') {
      return NextResponse.json({ error: 'Unsupported blockchain' }, { status: 400 });
    }
    if (!privateKey || typeof privateKey !== 'string' || privateKey.trim().length < 1) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ authId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secret = encryptSecret(privateKey.trim());

    try {
      const newWallet = new Wallet({
        userId: user._id,
        name: name.trim(),
        blockchain,
        secret
      });
      await newWallet.save();
      return NextResponse.json(
        {
          wallet: {
            _id: newWallet._id,
            userId: newWallet.userId,
            name: newWallet.name,
            blockchain: newWallet.blockchain,
            secretStored: !!newWallet.secret,
            createdAt: newWallet.createdAt,
            updatedAt: newWallet.updatedAt
          }
        },
        { status: 201 }
      );
    } catch (err: any) {
      if (err?.code === 11000) {
        return NextResponse.json({ error: 'Wallet name already exists' }, { status: 409 });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json({ error: 'Error creating wallet' }, { status: 500 });
  }
}