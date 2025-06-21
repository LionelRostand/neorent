
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
      console.log('🔥 Appel Firebase Function: testSMTPConnection');
      const testSMTP = httpsCallable(functions, 'testSMTPConnection');
      const result = await testSMTP(config);
      console.log('✅ Résultat Firebase Function:', result.data);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('❌ Erreur Firebase Function testSMTPConnection:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      // Si les Cloud Functions ne sont pas déployées, retourner une erreur explicite
      if (error.code === 'functions/not-found') {
        throw new Error('Les Firebase Cloud Functions ne sont pas déployées. Déployez d\'abord les fonctions testSMTPConnection, testIMAPConnection et sendTestEmail.');
      }
      
      throw error;
    }
  },

  async testIMAPConnection(config: IMAPConfig) {
    try {
      console.log('🔥 Appel Firebase Function: testIMAPConnection');
      const testIMAP = httpsCallable(functions, 'testIMAPConnection');
      const result = await testIMAP(config);
      console.log('✅ Résultat Firebase Function:', result.data);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('❌ Erreur Firebase Function testIMAPConnection:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      if (error.code === 'functions/not-found') {
        throw new Error('Les Firebase Cloud Functions ne sont pas déployées. Déployez d\'abord les fonctions testSMTPConnection, testIMAPConnection et sendTestEmail.');
      }
      
      throw error;
    }
  },

  async sendTestEmail(request: TestEmailRequest) {
    try {
      console.log('🔥 Appel Firebase Function: sendTestEmail');
      const sendEmail = httpsCallable(functions, 'sendTestEmail');
      const result = await sendEmail(request);
      console.log('✅ Résultat Firebase Function:', result.data);
      return result.data as { success: boolean; error?: string };
    } catch (error: any) {
      console.error('❌ Erreur Firebase Function sendTestEmail:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      if (error.code === 'functions/not-found') {
        throw new Error('Les Firebase Cloud Functions ne sont pas déployées. Déployez d\'abord les fonctions testSMTPConnection, testIMAPConnection et sendTestEmail.');
      }
      
      throw error;
    }
  }
};
