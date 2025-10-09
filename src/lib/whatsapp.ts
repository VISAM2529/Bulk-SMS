// TWILIO SETUP
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "your-account-sid";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your-auth-token";
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

export interface WhatsAppMessage {
  to: string;
  type: "text" | "image" | "video" | "document";
  text?: { body: string };
  image?: { link: string; caption?: string };
  video?: { link: string; caption?: string };
  document?: { link: string; caption?: string };
}

export class WhatsAppService {
  static async sendMessage(messageData: WhatsAppMessage): Promise<any> {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      console.log("Sending WhatsApp message to:", messageData);
      const params = new URLSearchParams();
      params.append("From", TWILIO_WHATSAPP_NUMBER);
      params.append("To", `whatsapp:+91${messageData.to}`);

      if (messageData.type === "text" && messageData.text) {
        params.append("Body", messageData.text.body);
      }

      if (messageData.type === "image" && messageData.image) {
        params.append("Body", messageData.image.caption || "");
        params.append("MediaUrl", messageData.image.link);
      }

      if (messageData.type === "video" && messageData.video) {
        params.append("Body", messageData.video.caption || "");
        params.append("MediaUrl", messageData.video.link);
      }

      if (messageData.type === "document" && messageData.document) {
        params.append("Body", messageData.document.caption || "");
        params.append("MediaUrl", messageData.document.link);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Twilio API error: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Twilio WhatsApp send error:", error);
      throw error;
    }
  }

  static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<any[]> {
    const results: any[] = [];

    for (const message of messages) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const result = await this.sendMessage(message);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send to ${message.to}:`, error);
        results.push({ error: true, to: message.to, errorMessage: (error as Error).message });
      }
    }

    return results;
  }
}
















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

// const WHATSAPP_API_URL = "https://graph.facebook.com/v20.0";
// const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "your-phone-number-id";
// const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "your-access-token";

// export interface WhatsAppMessage {
//   to: string | string[];
//   templateName?: string;
//   parameters?: string[];
//   mediaUrl?: string;
//   isReply?: boolean;
//   message?: string;
// }

// export class WhatsAppService {
//   static async validateToken(): Promise<boolean> {
//     try {
//       const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}`, {
//         headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` },
//       });
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(`Token validation failed: ${error.error.message}`);
//       }
//       return true;
//     } catch (error) {
//       console.error("Token validation error:", error);
//       return false;
//     }
//   }

//   static async sendMessage(messageData: WhatsAppMessage, retryCount = 0): Promise<any> {
//     try {
//       if (!(await this.validateToken())) {
//         throw new Error("Invalid or expired access token");
//       }

//       const numbers = Array.isArray(messageData.to) ? messageData.to : [messageData.to];
//       const results: any[] = [];

//       for (const number of numbers) {
//         const payload: any = {
//           messaging_product: "whatsapp",
//           to: number.replace(/[^0-9]/g, ""),
//           type: messageData.templateName ? "template" : "text",
//         };

//         if (messageData.templateName) {
//           payload.template = {
//             name: messageData.templateName,
//             language: { code: "en" },
//             components: messageData.parameters
//               ? [
//                   {
//                     type: "body",
//                     parameters: messageData.parameters.map((param) => ({ type: "text", text: param })),
//                   },
//                 ]
//               : [],
//           };
//           if (messageData.mediaUrl) {
//             payload.template.components.push({
//               type: "header",
//               parameters: [{ type: getMediaType(messageData.mediaUrl), [getMediaType(messageData.mediaUrl)]: { link: messageData.mediaUrl } }],
//             });
//           }
//         } else if (messageData.isReply && messageData.message) {
//           payload.text = { body: messageData.message };
//           if (messageData.mediaUrl) {
//             payload.type = getMediaType(messageData.mediaUrl);
//             payload[payload.type] = { link: messageData.mediaUrl };
//           }
//         } else {
//           throw new Error("Template name or reply mode required");
//         }

//         console.log("Sending WhatsApp message to:", { number, template: messageData.templateName });

//         const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
//           },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           const error = await response.json();
//           if (error.error.code === 190 && retryCount < 1) {
//             console.log("Token error detected, retrying...");
//             return this.sendMessage(messageData, retryCount + 1);
//           }
//           if (error.error.code === 131030) {
//             throw new Error(`Recipient not opted in: Share opt-in link https://wa.me/${WHATSAPP_PHONE_NUMBER_ID}?text=OPTIN`);
//           }
//           throw new Error(`WhatsApp API error: ${error.error.message}`);
//         }

//         results.push(await response.json());
//       }

//       return results.length === 1 ? results[0] : results;
//     } catch (error) {
//       console.error("WhatsApp send error:", error);
//       throw error;
//     }
//   }

//   static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<any[]> {
//     const results: any[] = [];

//     for (const msg of messages) {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 200));
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

// function getMediaType(url: string): "image" | "video" | "text" {
//   if (!url) return "text";
//   const extension = url.split(".").pop()?.toLowerCase();
//   if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return "image";
//   if (["mp4", "mov", "avi"].includes(extension || "")) return "video";
//   return "text";
// }