// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import { authenticateRequest } from '../../../../lib/auth';
import User from '../../../../models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
        settings: user.settings
      }
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const body = await request.json();
    const { name, email, phone, settings } = body;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, email, phone, settings },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}