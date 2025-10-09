import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';
import Campaign from '../../../models/Campaign';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);

    // Fetch all campaigns for the user as reports
    const campaigns = await Campaign.find({ userId: user._id }).sort({ createdAt: -1 });

    // Map campaigns to report-like objects
    const reports = campaigns.map(c => ({
      id: c._id,
      name: c.name,
      message: c.message,
      mediaUrl: c.mediaUrl,
      status: c.status,
      creditsUsed: c.creditsUsed,
      stats: c.stats,
      createdAt: c.createdAt,
      delivered: c.stats?.delivered || 0,
      failed: c.stats?.failed || 0,
      pending: c.stats?.pending || 0,
    }));

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}
