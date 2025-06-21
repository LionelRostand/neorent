
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  fromEmail: string;
  fromName: string;
}

interface IMAPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  folder: string;
}

interface TestEmailRequest {
  smtp: SMTPConfig;
  to: string;
  subject: string;
  message: string;
}

export const emailTestService = {
  async testSMTPConnection(config: SMTPConfig) {
    try {
      const testSMTP = httpsCallable(functions, 'testSMTPConnection');
      const result = await testSMTP(config);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('Erreur lors du test SMTP:', error);
      throw new Error(error.message || 'Erreur de connexion SMTP');
    }
  },

  async testIMAPConnection(config: IMAPConfig) {
    try {
      const testIMAP = httpsCallable(functions, 'testIMAPConnection');
      const result = await testIMAP(config);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('Erreur lors du test IMAP:', error);
      throw new Error(error.message || 'Erreur de connexion IMAP');
    }
  },

  async sendTestEmail(request: TestEmailRequest) {
    try {
      const sendEmail = httpsCallable(functions, 'sendTestEmail');
      const result = await sendEmail(request);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi d\'email:', error);
      throw new Error(error.message || 'Erreur d\'envoi d\'email');
    }
  }
};
