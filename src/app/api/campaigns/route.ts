// app/api/campaigns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';
import Campaign from '../../../models/Campaign';
import ContactGroup from '../../../models/ContactGroup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    const filter: any = { userId: user._id };
    
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Campaign.countDocuments(filter);

    return NextResponse.json({
      campaigns,
      total,
      pages: Math.ceil(total / limit)
    });

  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const body = await request.json();
    const { name, message, mediaUrl, contacts, groups, schedule, tags } = body;

    if (!name || !message) {
      return NextResponse.json(
        { message: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Calculate credits estimated
    let totalContacts = contacts?.length || 0;
    if (groups && groups.length > 0) {
      const groupContacts = await ContactGroup.find({ 
        _id: { $in: groups }, 
        userId: user._id 
      });
      totalContacts += groupContacts.reduce((acc, group) => acc + group.contactIds.length, 0);
    }

    const creditsEstimated = totalContacts * (mediaUrl ? 2 : 1);

    const campaign = new Campaign({
      userId: user._id,
      name,
      message,
      mediaUrl,
      contacts: contacts || [],
      groups: groups || [],
      schedule,
      tags,
      creditsEstimated,
      stats: { total: totalContacts }
    });

    await campaign.save();

    return NextResponse.json(campaign, { status: 201 });

  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}