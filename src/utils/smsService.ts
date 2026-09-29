import { SMSRecord, DeliveryStatus } from '../types';

export interface SMSProvider {
  name: string;
  isConfigured: boolean;
  sendSMS: (phone: string, message: string) => Promise<{ success: boolean; status: DeliveryStatus; messageId: string }>;
}

class DemoSMSProvider implements SMSProvider {
  name = 'Demo SMS Gateway (College Evaluation Mode)';
  isConfigured = true;

  async sendSMS(phone: string, message: string) {
    // Simulate brief network latency
    await new Promise((res) => setTimeout(res, 350));
    return {
      success: true,
      status: 'Delivered' as DeliveryStatus,
      messageId: 'DEMO-SMS-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    };
  }
}

class RealSMSGatewayProvider implements SMSProvider {
  name = 'Authorised Telecom SMS Gateway';
  isConfigured = false;
  private apiKey: string | null = null;
  private endpointUrl: string | null = null;

  configure(apiKey: string, endpointUrl: string) {
    this.apiKey = apiKey;
    this.endpointUrl = endpointUrl;
    this.isConfigured = Boolean(apiKey && endpointUrl);
  }

  async sendSMS(phone: string, message: string) {
    if (!this.isConfigured || !this.endpointUrl) {
      return {
        success: false,
        status: 'Failed' as DeliveryStatus,
        messageId: 'UNCONFIGURED',
      };
    }

    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to: phone,
          sender: 'SMARTPROC',
          text: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          status: 'Delivered' as DeliveryStatus,
          messageId: data.messageId || 'GATEWAY-' + Date.now(),
        };
      }
      return {
        success: false,
        status: 'Failed' as DeliveryStatus,
        messageId: 'FAIL-' + Date.now(),
      };
    } catch {
      return {
        success: false,
        status: 'Failed' as DeliveryStatus,
        messageId: 'ERR-' + Date.now(),
      };
    }
  }
}

// Global active providers
export const demoProvider = new DemoSMSProvider();
export const realGatewayProvider = new RealSMSGatewayProvider();

export let isDemoSMSMode = true;

export function setSMSMode(demo: boolean) {
  isDemoSMSMode = demo;
}

export async function dispatchSMS(recipientPhone: string, message: string): Promise<SMSRecord> {
  const provider = isDemoSMSMode ? demoProvider : realGatewayProvider;
  const result = await provider.sendSMS(recipientPhone, message);

  const record: SMSRecord = {
    id: result.messageId,
    recipient_phone: recipientPhone,
    message,
    sender_id: 'SMARTPROC',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: result.status,
    provider: provider.name,
    is_demo: isDemoSMSMode,
  };

  return record;
}

export function getSMSProvider() {
  return {
    sendSMS: (recipientPhone: string, message: string): SMSRecord => {
      const provider = isDemoSMSMode ? demoProvider : realGatewayProvider;
      return {
        id: 'SMS-' + Date.now().toString(36).toUpperCase(),
        recipient_phone: recipientPhone,
        message,
        sender_id: 'SMARTPROC',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        provider: provider.name,
        is_demo: isDemoSMSMode,
      };
    },
    dispatchSMS,
  };
}
