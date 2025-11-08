import { Wallet } from '@/models/Wallet';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

// GET /api/wallets/[id] - Get a specific wallet (sanitized)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const wallet = await Wallet.findOne({ _id: id, userId: user._id });
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }
    return NextResponse.json({
      wallet: {
        _id: wallet._id,
        userId: wallet.userId,
        name: wallet.name,
        blockchain: wallet.blockchain,
        secretStored: !!wallet.secret,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Error fetching wallet' },
      { status: 500 }
    );
  }
}

// PUT /api/wallets/[id] - Update a specific wallet
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, blockchain, privateKey } = body as {
      name?: string;
      blockchain?: 'solana';
      privateKey?: string;
    };

    await connectToDatabase();

    const user = await User.findOne({ authId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const wallet = await Wallet.findOne({ _id: id, userId: user._id });
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (typeof name === 'string' && name.trim().length > 0)
      wallet.name = name.trim();
    if (blockchain) {
      if (blockchain !== 'solana') {
        return NextResponse.json(
          { error: 'Unsupported blockchain' },
          { status: 400 }
        );
      }
      wallet.blockchain = blockchain;
    }
    if (typeof privateKey === 'string' && privateKey.trim().length > 0) {
      wallet.secret = encryptSecret(privateKey.trim());
    }

    try {
      await wallet.save();
    } catch (err: any) {
      if (err?.code === 11000) {
        return NextResponse.json(
          { error: 'Wallet name already exists' },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({
      wallet: {
        _id: wallet._id,
        userId: wallet.userId,
        name: wallet.name,
        blockchain: wallet.blockchain,
        secretStored: !!wallet.secret,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Error updating wallet' },
      { status: 500 }
    );
  }
}

// DELETE /api/wallets/[id] - Delete a specific wallet
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const result = await Wallet.deleteOne({ _id: id, userId: user._id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: 'Error deleting wallet' },
      { status: 500 }
    );
  }
}
