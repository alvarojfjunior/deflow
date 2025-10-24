import { Automation } from '@/models/Automation';
import { User } from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

// GET /api/bots/[id] - Get a specific automation
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Find the specific automation
    const automation = await Automation.findOne({ _id: params.id, userId: user._id });
    
    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }
    
    return NextResponse.json({ automation });
  } catch (error) {
    console.error('Error fetching automation:', error);
    return NextResponse.json({ error: 'Error fetching automation' }, { status: 500 });
  }
}

// PUT /api/bots/[id] - Update a specific automation
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
    const { strategy, status, name, description } = body as {
      strategy?: { name: string; params: Record<string, any> };
      status?: 'active' | 'paused' | 'error';
      name?: string;
      description?: string;
    };
    
    await connectToDatabase();
    
    // Find the user in MongoDB by Clerk authId
    const user = await User.findOne({ authId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find the specific automation
    const automation = await Automation.findOne({ _id: id, userId: user._id });
    
    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }
    // Guarda status anterior para detectar mudanças
    const oldStatus = automation.status;
    const oldStrategy = automation.strategy;

    // Update the automation
    if (strategy) automation.strategy = strategy;
    if (status) automation.status = status;
    if (name) automation.name = name.trim();
    if (description) automation.description = description.trim();
    
    await automation.save();

    return NextResponse.json({ automation });
  } catch (error) {
    console.error('Error updating automation:', error);
    return NextResponse.json({ error: 'Error updating automation' }, { status: 500 });
  }
}

// DELETE /api/bots/[id] - Delete a specific automation
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
    
    // Find the user in MongoDB by Clerk authId
    const user = await User.findOne({ authId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find and delete the specific automation
    const result = await Automation.deleteOne({ _id: id, userId: user._id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting automation:', error);
    return NextResponse.json({ error: 'Error deleting automation' }, { status: 500 });
  }
}