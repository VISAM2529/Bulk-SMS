import { NextRequest, NextResponse } from "next/server";
import { WhatsAppService } from "../../../../lib/whatsapp";
import connectDB from "../../../../lib/db";
import CampaignMessageInsight from "../../../../models/CampaignMessageInsight";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { to, message, mediaUrl, mediaType, bulk, campaignId, template } = await req.json();

    if (!to || (!message && !template)) {
      return NextResponse.json({ message: "Missing required fields: 'to' and either 'message' or 'template'" }, { status: 400 });
    }

    // Validate media URL
    if (mediaUrl && !/^https?:\/\//.test(mediaUrl)) {
      return NextResponse.json({ message: "Invalid media URL: Must be a valid HTTP/HTTPS URL" }, { status: 400 });
    }

    const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '');

    if (Array.isArray(to) && bulk) {
      const results = [];
      let sent = 0, failed = 0;

      for (const number of to) {
        let insight;
        try {
          const normalizedNumber = normalizePhone(number);
          const msgData: any = template
            ? {
                to: normalizedNumber,
                type: "template",
                template: {
                  name: template.name || "hello_world",
                  language: template.language || "en",
                  parameters: template.parameters || [message || "User"]
                }
              }
            : mediaUrl
              ? {
                  to: normalizedNumber,
                  type: mediaType || "image",
                  [mediaType || "image"]: { link: mediaUrl, caption: message }
                }
              : { to: normalizedNumber, type: "text", text: { body: message } };

          const result = await WhatsAppService.sendMessage(msgData);
          results.push(result);
          sent++;

          insight = new CampaignMessageInsight({
            ...(campaignId ? { campaignId } : {}),
            contact: normalizedNumber,
            status: result.messages?.[0]?.id ? "sent" : "queued",
            error: undefined,
            messageSid: result.messages?.[0]?.id,
            sentAt: new Date(),
            response: result
          });
        } catch (err: any) {
          results.push({ error: true, to: number, errorMessage: err.message });
          failed++;

          insight = new CampaignMessageInsight({
            ...(campaignId ? { campaignId } : {}),
            contact: normalizePhone(number),
            status: "failed",
            error: err.message.includes("131030") 
              ? "Recipient not opted in. Use template or ensure opt-in."
              : err.message,
            sentAt: new Date(),
            response: undefined
          });
        }
        await insight.save();
      }

      return NextResponse.json({
        message: "Bulk WhatsApp messages processed",
        total: to.length,
        sent,
        failed,
        results
      }, { status: 200 });
    }

    let insight;
    const normalizedTo = normalizePhone(to);
    const msgData: any = template
      ? {
          to: normalizedTo,
          type: "template",
          template: {
            name: template.name || "hello_world",
            language: template.language || "en",
            parameters: template.parameters || [message || "User"]
          }
        }
      : mediaUrl
        ? {
            to: normalizedTo,
            type: mediaType || "image",
            [mediaType || "image"]: { link: mediaUrl, caption: message }
          }
        : { to: normalizedTo, type: "text", text: { body: message } };

    try {
      const result = await WhatsAppService.sendMessage(msgData);

      insight = new CampaignMessageInsight({
        ...(campaignId ? { campaignId } : {}),
        contact: normalizedTo,
        status: result.messages?.[0]?.id ? "sent" : "queued",
        error: undefined,
        messageSid: result.messages?.[0]?.id,
        sentAt: new Date(),
        response: result
      });
      await insight.save();

      return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (err: any) {
      insight = new CampaignMessageInsight({
        ...(campaignId ? { campaignId } : {}),
        contact: normalizedTo,
        status: "failed",
        error: err.message.includes("131030")
          ? "Recipient not opted in. Use template or ensure opt-in."
          : err.message,
        sentAt: new Date(),
        response: undefined
      });
      await insight.save();

      return NextResponse.json({
        message: err.message.includes("131030")
          ? "Recipient not opted in. Use template or ensure opt-in."
          : err.message,
        errorCode: err.message.includes("131030") ? 131030 : undefined
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}








// FAST2SMS SETUP

// import { NextRequest, NextResponse } from "next/server";
// import { Fast2SMSService, WhatsAppMessage } from "../../../../lib/whatsapp";
// import connectDB from "../../../../lib/db";
// import CampaignMessageInsight from "../../../../models/CampaignMessageInsight";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { to, templateName, parameters, mediaUrl, bulk, campaignId } = await req.json();

//     if (!to || !templateName) {
//       return NextResponse.json({ message: "Missing required fields: 'to' and 'templateName'" }, { status: 400 });
//     }

//     // Validate media URL if provided
//     if (mediaUrl && !/^https?:\/\//.test(mediaUrl)) {
//       return NextResponse.json({ message: "Invalid media URL: Must be a valid HTTP/HTTPS URL" }, { status: 400 });
//     }

//     const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, "");

//     // Bulk send
//     if (Array.isArray(to) && bulk) {
//       const results = [];
//       let sent = 0,
//         failed = 0;

//       for (const number of to) {
//         let insight;
//         try {
//           const msgData: WhatsAppMessage = {
//             to: normalizePhone(number),
//             templateName,
//             parameters,
//             mediaUrl,
//           };

//           const result = await Fast2SMSService.sendMessage(msgData);
//           results.push(result);
//           sent++;

//           insight = new CampaignMessageInsight({
//             ...(campaignId ? { campaignId } : {}),
//             contact: normalizePhone(number),
//             status: result.return ? "sent" : "failed",
//             error: undefined,
//             messageSid: result.message_id || undefined,
//             sentAt: new Date(),
//             response: result,
//           });
//         } catch (err: any) {
//           results.push({ error: true, to: number, errorMessage: err.message });
//           failed++;

//           insight = new CampaignMessageInsight({
//             ...(campaignId ? { campaignId } : {}),
//             contact: normalizePhone(number),
//             status: "failed",
//             error: err.message,
//             sentAt: new Date(),
//             response: undefined,
//           });
//         }
//         await insight.save();
//       }

//       return NextResponse.json({
//         message: "Bulk WhatsApp messages processed",
//         total: to.length,
//         sent,
//         failed,
//         results,
//       }, { status: 200 });
//     }

//     // Single send
//     let insight;
//     const normalizedTo = normalizePhone(to);
//     const msgData: WhatsAppMessage = {
//       to: normalizedTo,
//       templateName,
//       parameters,
//       mediaUrl,
//     };

//     try {
//       const result = await Fast2SMSService.sendMessage(msgData);

//       insight = new CampaignMessageInsight({
//         ...(campaignId ? { campaignId } : {}),
//         contact: normalizedTo,
//         status: result.return ? "sent" : "failed",
//         error: undefined,
//         messageSid: result.message_id || undefined,
//         sentAt: new Date(),
//         response: result,
//       });
//       await insight.save();

//       return NextResponse.json({ success: true, result }, { status: 200 });
//     } catch (err: any) {
//       insight = new CampaignMessageInsight({
//         ...(campaignId ? { campaignId } : {}),
//         contact: normalizedTo,
//         status: "failed",
//         error: err.message,
//         sentAt: new Date(),
//         response: undefined,
//       });
//       await insight.save();

//       return NextResponse.json({ message: err.message }, { status: 400 });
//     }
//   } catch (err: any) {
//     console.error("API error:", err.message);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }











// WHATSAPP BUSINESS SETUP

// import { NextRequest, NextResponse } from "next/server";
// import { WhatsAppService } from "../../../../lib/whatsapp";
// import connectDB from "../../../../lib/db";
// import CampaignMessageInsight from "../../../../models/CampaignMessageInsight";
// import Contact from "../../../../models/Contact";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { to, templateName, parameters, mediaUrl, bulk, campaignId, isReply = false, message } = await req.json();

//     if (!to || (!templateName && !isReply)) {
//       return NextResponse.json({ message: "Missing required fields: 'to' and either 'templateName' or 'isReply'" }, { status: 400 });
//     }

//     if (mediaUrl && !/^https?:\/\//.test(mediaUrl)) {
//       return NextResponse.json({ message: "Invalid media URL: Must be a valid HTTP/HTTPS URL" }, { status: 400 });
//     }

//     const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, "");

//     // Validate opt-in for non-reply messages
//     if (!isReply) {
//       const contacts = Array.isArray(to) ? to : [to];
//       const invalidContacts = await Promise.all(
//         contacts.map(async (number) => {
//           const contact = await Contact.findOne({ phoneNumber: normalizePhone(number) });
//           return !contact || !contact.optedIn ? number : null;
//         })
//       ).then(results => results.filter(Boolean));
//       if (invalidContacts.length > 0) {
//         return NextResponse.json(
//           { message: `Recipient(s) not opted in: ${invalidContacts.join(", ")}. Share opt-in link: https://wa.me/${process.env.WHATSAPP_PHONE_NUMBER_ID}?text=OPTIN` },
//           { status: 400 }
//         );
//       }
//     }

//     if (Array.isArray(to) && bulk) {
//       const results = [];
//       let sent = 0, failed = 0;

//       for (const number of to) {
//         let insight;
//         try {
//           const msgData: any = {
//             to: normalizePhone(number),
//             templateName,
//             parameters: parameters ? parameters.shift() : undefined,
//             mediaUrl,
//             isReply,
//             message,
//           };

//           const result = await WhatsAppService.sendMessage(msgData);
//           results.push(result);
//           sent++;

//           insight = new CampaignMessageInsight({
//             ...(campaignId ? { campaignId } : {}),
//             contact: normalizePhone(number),
//             status: result.messages?.[0]?.id ? "sent" : "failed",
//             error: undefined,
//             messageSid: result.messages?.[0]?.id,
//             sentAt: new Date(),
//             response: result,
//           });
//         } catch (err: any) {
//           results.push({ error: true, to: number, errorMessage: err.message });
//           failed++;

//           insight = new CampaignMessageInsight({
//             ...(campaignId ? { campaignId } : {}),
//             contact: normalizePhone(number),
//             status: "failed",
//             error: err.message.includes("131030") ? "Recipient not opted in" : err.message,
//             sentAt: new Date(),
//             response: undefined,
//           });
//         }
//         await insight.save();
//       }

//       return NextResponse.json({
//         message: "Bulk WhatsApp messages processed",
//         total: to.length,
//         sent,
//         failed,
//         results,
//       }, { status: 200 });
//     }

//     let insight;
//     const normalizedTo = normalizePhone(to);
//     const msgData: any = {
//       to: normalizedTo,
//       templateName,
//       parameters,
//       mediaUrl,
//       isReply,
//       message,
//     };

//     try {
//       const result = await WhatsAppService.sendMessage(msgData);

//       insight = new CampaignMessageInsight({
//         ...(campaignId ? { campaignId } : {}),
//         contact: normalizedTo,
//         status: result.messages?.[0]?.id ? "sent" : "failed",
//         error: undefined,
//         messageSid: result.messages?.[0]?.id,
//         sentAt: new Date(),
//         response: result,
//       });
//       await insight.save();

//       return NextResponse.json({ success: true, result }, { status: 200 });
//     } catch (err: any) {
//       insight = new CampaignMessageInsight({
//         ...(campaignId ? { campaignId } : {}),
//         contact: normalizedTo,
//         status: "failed",
//         error: err.message.includes("131030") ? "Recipient not opted in" : err.message,
//         sentAt: new Date(),
//         response: undefined,
//       });
//       await insight.save();

//       return NextResponse.json(
//         { message: err.message.includes("131030") ? `Recipient not opted in. Share opt-in link: https://wa.me/${process.env.WHATSAPP_PHONE_NUMBER_ID}?text=OPTIN` : err.message },
//         { status: 400 }
//       );
//     }
//   } catch (err: any) {
//     console.error("API error:", err.message);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }