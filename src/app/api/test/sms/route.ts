// app/api/test/sms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../lib/auth';
import { Fast2SMSService } from '../../../../lib/fast2sms';

export async function POST(request: NextRequest) {
  try {
    // await authenticateRequest(request);
    
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { success: false, message: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    const result = await Fast2SMSService.sendMessage(to, message);
    
    return NextResponse.json({
      success: true,
      message: 'Test SMS sent successfully',
      request_id: result.request_id,
      details: result.message
    });

  } catch (error: any) {
    console.error('Test SMS error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to send test SMS' 
      },
      { status: 500 }
    );
  }
}