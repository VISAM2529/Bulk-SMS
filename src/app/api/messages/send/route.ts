// // app/api/messages/send/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../../../lib/db';
// import { authenticateRequest } from '../../../../lib/auth';
// import Campaign from '../../../../models/Campaign';
// import Message from '../../../../models/Message';
// import { Fast2SMSService } from '../../../../lib/fast2sms';

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const user = await authenticateRequest(request);
    
//     const { campaignId } = await request.json();

//     if (!campaignId) {
//       return NextResponse.json(
//         { message: 'Campaign ID is required' },
//         { status: 400 }
//       );
//     }

//     const campaign = await Campaign.findOne({ _id: campaignId, userId: user._id }).populate('contacts');
//     if (!campaign) {
//       return NextResponse.json(
//         { message: 'Campaign not found' },
//         { status: 404 }
//       );
//     }

//     // Update campaign status
//     campaign.status = 'processing';
//     await campaign.save();

//     // Prepare messages for Fast2SMS
//     const fast2smsMessages = campaign.contacts.map(contact => ({
//       to: contact.phoneNumber,
//       message: campaign.message,
//       route: 't' // transactional route
//     }));

//     // Send messages via Fast2SMS
//     const results = await Fast2SMSService.sendBulkMessages(fast2smsMessages);

//     // Save message records and update status
//     const messageRecords = [];
//     for (let i = 0; i < campaign.contacts.length; i++) {
//       const contact = campaign.contacts[i];
//       const result = results[i];
      
//       const message = new Message({
//         campaignId: campaign._id,
//         userId: user._id,
//         to: contact.phoneNumber,
//         type: 'sms',
//         content: {
//           text: campaign.message
//         },
//         status: result.return ? 'sent' : 'failed',
//         messageId: result.return ? result.request_id : undefined,
//         errorMessage: result.return ? undefined : result.message.join(', '),
//         cost: 1 // 1 credit per SMS
//       });
      
//       messageRecords.push(message.save());
//     }

//     await Promise.all(messageRecords);

//     // Update campaign stats
//     const sentCount = results.filter(r => r.return).length;
//     const failedCount = results.length - sentCount;
    
//     campaign.status = 'completed';
//     campaign.stats = {
//       total: results.length,
//       sent: sentCount,
//       delivered: sentCount, // Fast2SMS doesn't provide delivery reports for all plans
//       read: 0,
//       failed: failedCount,
//       pending: 0
//     };
    
//     await campaign.save();

//     return NextResponse.json({
//       message: 'Campaign completed',
//       total: results.length,
//       sent: sentCount,
//       failed: failedCount,
//       results: results
//     });

//   } catch (error: any) {
//     console.error('Send messages error:', error);
//     return NextResponse.json(
//       { message: error.message || 'Server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/messages/send/route.ts
// app/api/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import { authenticateRequest } from '../../../../lib/auth';
import Message from '../../../../models/Message';
import { WhatsAppService } from '../../../../lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Optional: authenticate user
    // const user = await authenticateRequest(request);

    const { message, contacts } = await request.json();

    if (!message || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { message: 'Message and contacts are required' },
        { status: 400 }
      );
    }

    // Transform contacts into WhatsAppMessage format
    const whatsappMessages = contacts.map(contact => ({
      to: contact.phoneNumber.startsWith('+') ? contact.phoneNumber : `+${contact.phoneNumber}`,
      type: 'text',
      text: { body: message }
    }));

    // Send bulk messages via Twilio
    const results = await WhatsAppService.sendBulkMessages(whatsappMessages);

    // Save message records to DB (optional)
    const savedMessages = [];
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const result = results[i];

      const msgRecord = new Message({
        // userId: "7831278321",
        to: contact.phoneNumber,
        type: 'text',
        content: { text: message },
        status: result.error ? 'failed' : 'sent',
        messageId: result.sid || undefined,
        errorMessage: result.error || undefined,
        cost: 0, // adjust if using credits
        timestamp: new Date()
      });

      savedMessages.push(msgRecord.save());
    }

    await Promise.all(savedMessages);

    const sentCount = results.filter(r => !r.error).length;
    const failedCount = results.length - sentCount;

    return NextResponse.json({
      message: 'Bulk WhatsApp messages processed',
      total: results.length,
      sent: sentCount,
      failed: failedCount,
      results
    });

  } catch (error: any) {
    console.error('Send WhatsApp messages error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
