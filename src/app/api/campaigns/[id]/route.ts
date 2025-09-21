// app/api/campaigns/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import { authenticateRequest } from '../../../../lib/auth';
import Campaign from '../../../../models/Campaign';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const campaign = await Campaign.findOne({ 
      _id: params.id, 
      userId: user._id 
    });

    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);

  } catch (error: any) {
    console.error('Get campaign error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const body = await request.json();
    const campaign = await Campaign.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      body,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);

  } catch (error: any) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const campaign = await Campaign.findOneAndDelete({ 
      _id: params.id, 
      userId: user._id 
    });

    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Campaign deleted successfully' });

  } catch (error: any) {
    console.error('Delete campaign error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}