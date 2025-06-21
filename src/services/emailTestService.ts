
import { supabase } from '@/lib/supabase';

export interface SMTPTestRequest {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  fromEmail: string;
  fromName: string;
}

export interface IMAPTestRequest {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  folder: string;
}

export interface SendTestEmailRequest {
  smtp: SMTPTestRequest;
  to: string;
  subject: string;
  message: string;
}

export const emailTestService = {
  async testSMTPConnection(smtpConfig: SMTPTestRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('test-smtp-connection', {
        body: smtpConfig
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Erreur test SMTP:', error);
      return { success: false, error: error.message };
    }
  },

  async testIMAPConnection(imapConfig: IMAPTestRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('test-imap-connection', {
        body: imapConfig
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Erreur test IMAP:', error);
      return { success: false, error: error.message };
    }
  },

  async sendTestEmail(emailData: SendTestEmailRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: emailData
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Erreur envoi email test:', error);
      return { success: false, error: error.message };
    }
  }
};
