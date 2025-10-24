import { Automation } from '@/models/Automation';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

// GET /api/bots - List all bots for the user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find the user in MongoDB by Clerk authId
    const user = await User.findOne({ authId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find all bots for the user
    const bots = await Automation.find({ userId: user._id });

    return NextResponse.json({ bots });
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Error fetching bots' }, { status: 500 });
  }
}

// POST /api/bots - Create a new automation
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { strategy, status, name, description } = body as {
      strategy: { name: string; params: Record<string, any> };
      status?: 'active' | 'paused' | 'error';
      name: string;
      description?: string;
    };

    if (!strategy) {
      return NextResponse.json(
        { error: 'Strategy is required' },
        { status: 400 }
      );
    }
    if (!name || typeof name !== 'string' || name.trim().length < 1) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the user in MongoDB by Clerk authId
    const user = await User.findOne({ authId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a new automation
    const newBot = new Automation({
      userId: user._id,
      strategy,
      status: status || 'paused',
      name: name.trim(),
      description: (description || '').trim(),
    });

    await newBot.save();

    return NextResponse.json({ automation: newBot }, { status: 201 });
  } catch (error) {
    console.error('Error creating automation:', error);
    return NextResponse.json({ error: 'Error creating automation' }, { status: 500 });
  }
}
