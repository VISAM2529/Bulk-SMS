// // lib/whatsapp.ts
// const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "your-test-token";
// const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "your-phone-number-id";
// const WHATSAPP_API_VERSION = "v18.0";

// export interface WhatsAppResponse {
//   messaging_product: string;
//   contacts: { input: string; wa_id: string }[];
//   messages: { id: string }[];
// }

// export interface WhatsAppMessage {
//   to: string;
//   type: 'text' | 'image' | 'document' | 'template';
//   text?: { body: string };
//   image?: { link: string; caption?: string };
//   document?: { link: string; caption?: string; filename?: string };
//   template?: { name: string; language: { code: string } };
// }

// export class WhatsAppService {
//   static async sendMessage(messageData: WhatsAppMessage): Promise<WhatsAppResponse> {
//     try {
//       const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
      
//       const payload = {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         ...messageData
//       };

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`);
//       }

//       const data: WhatsAppResponse = await response.json();
//       return data;

//     } catch (error) {
//       console.error('WhatsApp send error:', error);
//       throw error;
//     }
//   }

//   static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<WhatsAppResponse[]> {
//     const results: WhatsAppResponse[] = [];
    
//     for (const message of messages) {
//       try {
//         // Respect WhatsApp rate limits (80 messages/second)
//         await new Promise(resolve => setTimeout(resolve, 50));
        
//         const result = await this.sendMessage(message);
//         results.push(result);
//       } catch (error) {
//         console.error(`Failed to send to ${message.to}:`, error);
//         results.push({
//           messaging_product: "whatsapp",
//           contacts: [{ input: message.to, wa_id: "" }],
//           messages: []
//         });
//       }
//     }
    
//     return results;
//   }

//   static async getPhoneNumberDetails() {
//     try {
//       const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}`;
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to get phone number details');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Get phone number details error:', error);
//       throw error;
//     }
//   }
// }


// lib/whatsapp.ts

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "your-account-sid";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "your-auth-token";
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886"; // Twilio Sandbox default

export interface WhatsAppMessage {
  to: string; // phone number in international format, e.g., "+919876543210"
  type: "text" | "image" | "document";
  text?: { body: string };
  image?: { link: string; caption?: string };
  document?: { link: string; caption?: string };
}

export class WhatsAppService {
  // Send a single WhatsApp message
  static async sendMessage(messageData: WhatsAppMessage): Promise<any> {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

      const params = new URLSearchParams();
      params.append("From", TWILIO_WHATSAPP_NUMBER);
      params.append("To", `whatsapp:${messageData.to}`);

      // Handle text
      if (messageData.type === "text" && messageData.text) {
        params.append("Body", messageData.text.body);
      }

      // Handle image
      if (messageData.type === "image" && messageData.image) {
        params.append("Body", messageData.image.caption || "");
        params.append("MediaUrl", messageData.image.link);
      }

      // Handle document
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

  // Send bulk WhatsApp messages
  static async sendBulkMessages(messages: WhatsAppMessage[]): Promise<any[]> {
    const results: any[] = [];

    for (const message of messages) {
      try {
        // Twilio rate limits — add a small delay to avoid throttling
        await new Promise((resolve) => setTimeout(resolve, 200));

        const result = await this.sendMessage(message);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send to ${message.to}:`, error);
        results.push({ error: true, to: message.to });
      }
    }

    return results;
  }
}
