// TWILIO SETUP
// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "your-account-sid";
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your-auth-token";
// const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

import { text } from "stream/consumers";

// export interface WhatsAppMessage {
//   to: string;
//   type: "text" | "image" | "video" | "document";
//   text?: { body: string };
//   image?: { link: string; caption?: string };
//   video?: { link: string; caption?: string };
//   document?: { link: string; caption?: string };
// }

// export class WhatsAppService {
//   static async sendMessage(messageData: WhatsAppMessage): Promise<any> {
//     try {
//       const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
//       console.log("Sending WhatsApp message to:", messageData);
//       const params = new URLSearchParams();
//       params.append("From", TWILIO_WHATSAPP_NUMBER);
//       params.append("To", `whatsapp:+91${messageData.to}`);

//       if (messageData.type === "text" && messageData.text) {
//         params.append("Body", messageData.text.body);
//       }

//       if (messageData.type === "image" && messageData.image) {
//         params.append("Body", messageData.image.caption || "");
//         params.append("MediaUrl", messageData.image.link);
//       }

//       if (messageData.type === "video" && messageData.video) {
//         params.append("Body", messageData.video.caption || "");
//         params.append("MediaUrl", messageData.video.link);
//       }

//       if (messageData.type === "document" && messageData.document) {
//         params.append("Body", messageData.document.caption || "");
//         params.append("MediaUrl", messageData.document.link);
//       }

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           Authorization:
//             "Basic " +
//             Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: params,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Twilio API error: ${errorText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Twilio WhatsApp send error:", error);
//       throw error;
//     }
//   }

//   static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<any[]> {
//     const results: any[] = [];

//     for (const message of messages) {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 200));
//         const result = await this.sendMessage(message);
//         results.push(result);
//       } catch (error) {
//         console.error(`Failed to send to ${message.to}:`, error);
//         results.push({ error: true, to: message.to, errorMessage: (error as Error).message });
//       }
//     }

//     return results;
//   }
// }
















// // FAST2SMS SETUP


// const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY || "your-api-key";
// const FAST2SMS_WHATSAPP_URL = "https://www.fast2sms.com/dev/whatsapp";

// export interface WhatsAppMessage {
//   to: string | string[]; // Single number or array (91XXXXXXXXXX)
//   templateName: string; // Approved WhatsApp template name
//   parameters?: string[]; // Template variables (e.g., ["Name", "Link"])
//   mediaUrl?: string; // Optional media URL (image/video)
// }

// export class Fast2SMSService {
//   static async sendMessage(messageData: WhatsAppMessage): Promise<any> {
//     try {
//       console.log("Fast2SMS API Key: ", FAST2SMS_API_KEY);
//       const numbers = Array.isArray(messageData.to) ? messageData.to.join(",") : messageData.to;
//       const payload: any = {
//         authorization: FAST2SMS_API_KEY,
//         template_name: messageData.templateName,
//         numbers,
//       };

//       if (messageData.parameters) {
//         payload.variables = messageData.parameters.join(",");
//       }

//       if (messageData.mediaUrl) {
//         payload.media_url = messageData.mediaUrl; // For image/video
//       }

//       console.log("Sending Fast2SMS WhatsApp message to:", { numbers, template: messageData.templateName });

//       const response = await fetch(FAST2SMS_WHATSAPP_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Fast2SMS WhatsApp API error: ${errorText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Fast2SMS WhatsApp send error:", error);
//       throw error;
//     }
//   }

//   static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<any[]> {
//     const results: any[] = [];

//     for (const msg of messages) {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 200)); // Rate limit
//         const result = await this.sendMessage(msg);
//         results.push(result);
//       } catch (error) {
//         console.error(`Failed to send to ${msg.to}:`, error);
//         results.push({ error: true, to: msg.to, errorMessage: (error as Error).message });
//       }
//     }

//     return results;
//   }
// }










// WHATSAPP BUSINESS ACCOUNT


const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
const WHATSAPP_PHONE_NUMBER_ID = "820418474493381"; // your business number ID
const WHATSAPP_ACCESS_TOKEN =
  "EAA92KWYZBKPMBPmg44Xp58m6zuZBxZBNNcXHDkR2DMGYyZAL9PXBLFQLVNfqckZCbjBZAyCMYtoQHZCXZACQYBFYtBAeetGcA4mCCQlv5r7Su6m7Lk2AYWQHOBxztN7LZCUg7BVfVZAgmhaCCrXoZCY657U19fvf5stPbNJO4LcOjYEWsZABKMdD1eJJZBQnn148bXMzxQQlujOOWKRNkNeWviYXAJcZB0VyM33F5vBpGl2ctZBKwZDZD";

export interface WhatsAppMessage {
  to: string | string[];
  parameters?: string[]; // for {{1}}, {{2}}, {{3}}
}

export class WhatsAppService {
  // (Optional) Validate your token before sending
  static async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}`, {
        headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token validation failed: ${error.error.message}`);
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }

  // --- Send marketing message using approved "new_template" ---
  static async sendMessage(): Promise<any> {
    try {
      // ✅ Example dynamic values for placeholders
      const parameters = ["Sameer", "Election 2025", "VOTE2025"];

      // ✅ WhatsApp API payload for template message
      const payload = {
        messaging_product: "whatsapp",
        to: "918080407364", // recipient number in international format
        type: "template",
        template: {
          name: "new_template", // your approved template name
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: parameters.map((param) => ({
                type: "text",
                text: param,
              })),
            },
          ],
        },
      };

      console.log("📤 Sending WhatsApp message:", payload);

      const response = await fetch(
        `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${result.error?.message || "Unknown error"}`);
      }

      console.log("✅ Message sent successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ WhatsApp send error:", error);
      throw error;
    }
  }
}
