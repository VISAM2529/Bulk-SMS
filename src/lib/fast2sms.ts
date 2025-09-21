// lib/fast2sms.ts
const FAST2SMS_API_KEY = "0h9X16BZrCeKDiRTgA4YVtfJP3aFGqn7j5HEMuI8lSyUOmxws2l7f6XaQejAICDT1Znz20PEYsSbp5Jq";
const FAST2SMS_BASE_URL = 'https://www.fast2sms.com/dev/bulkV2';

export interface Fast2SMSResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

export interface Fast2SMSMessage {
  to: string;
  message: string;
  route?: 'q' | 'd' | 't'; // q=quick, d=promotional, t=transactional
}

export class Fast2SMSService {
  static async sendMessage(to: string, message: string, route: string = 't'): Promise<Fast2SMSResponse> {
    try {
      const response = await fetch(FAST2SMS_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': FAST2SMS_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route,
          message,
          numbers: to
        })
      });

      if (!response.ok) {
        throw new Error(`Fast2SMS API error: ${response.statusText}`);
      }

      const data: Fast2SMSResponse = await response.json();
      
      if (!data.return) {
        throw new Error(`Fast2SMS failed: ${data.message.join(', ')}`);
      }

      return data;
    } catch (error) {
      console.error('Fast2SMS send error:', error);
      throw error;
    }
  }

  static async sendBulkMessages(messages: Fast2SMSMessage[], route: string = 't'): Promise<Fast2SMSResponse[]> {
    const results: Fast2SMSResponse[] = [];
    
    for (const message of messages) {
      try {
        // Add delay to respect rate limits (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const result = await this.sendMessage(message.to, message.message, route);
        results.push(result);
      } catch (error) {
        console.error(`Failed to send to ${message.to}:`, error);
        results.push({
          return: false,
          request_id: '',
          message: [`Failed: ${error.message}`]
        });
      }
    }
    
    return results;
  }

  static async checkBalance(): Promise<{ balance: number; validity: string }> {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/wallet', {
        method: 'POST',
        headers: {
          'Authorization': FAST2SMS_API_KEY!
        }
      });

      if (!response.ok) {
        throw new Error(`Fast2SMS balance check failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        balance: data.wallet,
        validity: data.validity
      };
    } catch (error) {
      console.error('Fast2SMS balance check error:', error);
      throw error;
    }
  }
}