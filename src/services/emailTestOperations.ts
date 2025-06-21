
import { emailTestService } from '@/services/emailTestService';
import { EmailSettings } from '@/components/Settings/types/email';

export interface TestEmailData {
  to: string;
  subject: string;
  message: string;
}

export const emailTestOperations = {
  async testSMTPConnection(settings: EmailSettings) {
    // Validate required SMTP settings
    if (!settings.smtp.host || !settings.smtp.username || !settings.smtp.password) {
      throw new Error('Veuillez configurer tous les paramètres SMTP obligatoires');
    }

    console.log('🧪 Test de connexion SMTP avec:', {
      host: settings.smtp.host,
      port: settings.smtp.port,
      username: settings.smtp.username,
      security: settings.smtp.security
    });

    try {
      const result = await emailTestService.testSMTPConnection({
        host: settings.smtp.host,
        port: settings.smtp.port,
        username: settings.smtp.username,
        password: settings.smtp.password,
        security: settings.smtp.security,
        fromEmail: settings.smtp.fromEmail,
        fromName: settings.smtp.fromName
      });

      if (!result.success) {
        throw new Error(result.error || 'Erreur de connexion SMTP');
      }

      return result;
    } catch (error: any) {
      console.error('❌ Erreur détaillée test SMTP:', error);
      
      // Gestion spécifique des erreurs Firebase Functions
      if (error.code === 'functions/not-found') {
        throw new Error('La fonction Firebase pour tester SMTP n\'est pas déployée. Veuillez déployer les Cloud Functions.');
      }
      
      if (error.code === 'functions/internal') {
        throw new Error('Erreur interne du serveur. Vérifiez la configuration Firebase et les logs des Cloud Functions.');
      }
      
      if (error.code === 'functions/permission-denied') {
        throw new Error('Permissions insuffisantes pour appeler la fonction de test SMTP.');
      }
      
      // Autres erreurs
      throw new Error(error.message || 'Erreur lors du test de connexion SMTP');
    }
  },

  async testIMAPConnection(settings: EmailSettings) {
    // Validate required IMAP settings
    if (!settings.imap.host || !settings.imap.username || !settings.imap.password) {
      throw new Error('Veuillez configurer tous les paramètres IMAP obligatoires');
    }

    console.log('🧪 Test de connexion IMAP avec:', {
      host: settings.imap.host,
      port: settings.imap.port,
      username: settings.imap.username,
      security: settings.imap.security
    });

    try {
      const result = await emailTestService.testIMAPConnection({
        host: settings.imap.host,
        port: settings.imap.port,
        username: settings.imap.username,
        password: settings.imap.password,
        security: settings.imap.security,
        folder: settings.imap.folder
      });

      if (!result.success) {
        throw new Error(result.error || 'Erreur de connexion IMAP');
      }

      return result;
    } catch (error: any) {
      console.error('❌ Erreur détaillée test IMAP:', error);
      
      // Gestion spécifique des erreurs Firebase Functions
      if (error.code === 'functions/not-found') {
        throw new Error('La fonction Firebase pour tester IMAP n\'est pas déployée. Veuillez déployer les Cloud Functions.');
      }
      
      if (error.code === 'functions/internal') {
        throw new Error('Erreur interne du serveur. Vérifiez la configuration Firebase et les logs des Cloud Functions.');
      }
      
      if (error.code === 'functions/permission-denied') {
        throw new Error('Permissions insuffisantes pour appeler la fonction de test IMAP.');
      }
      
      throw new Error(error.message || 'Erreur lors du test de connexion IMAP');
    }
  },

  async sendTestEmail(settings: EmailSettings, testEmailData: TestEmailData) {
    // Validate SMTP configuration
    if (!settings.smtp.host || !settings.smtp.username || !settings.smtp.password || !settings.smtp.fromEmail) {
      throw new Error('Veuillez configurer tous les paramètres SMTP avant d\'envoyer un email de test');
    }

    // Validate test email data
    if (!testEmailData.to) {
      throw new Error('Veuillez saisir une adresse email de destination');
    }

    console.log('📧 Envoi d\'email de test:', {
      smtp: {
        host: settings.smtp.host,
        port: settings.smtp.port,
        username: settings.smtp.username,
        security: settings.smtp.security,
        fromEmail: settings.smtp.fromEmail,
        fromName: settings.smtp.fromName
      },
      email: {
        to: testEmailData.to,
        subject: testEmailData.subject,
        message: testEmailData.message
      }
    });

    try {
      const result = await emailTestService.sendTestEmail({
        smtp: {
          host: settings.smtp.host,
          port: settings.smtp.port,
          username: settings.smtp.username,
          password: settings.smtp.password,
          security: settings.smtp.security,
          fromEmail: settings.smtp.fromEmail,
          fromName: settings.smtp.fromName
        },
        to: testEmailData.to,
        subject: testEmailData.subject,
        message: testEmailData.message
      });

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi d\'email');
      }

      return result;
    } catch (error: any) {
      console.error('❌ Erreur détaillée envoi email:', error);
      
      // Gestion spécifique des erreurs Firebase Functions
      if (error.code === 'functions/not-found') {
        throw new Error('La fonction Firebase pour envoyer des emails n\'est pas déployée. Veuillez déployer les Cloud Functions.');
      }
      
      if (error.code === 'functions/internal') {
        throw new Error('Erreur interne du serveur. Vérifiez la configuration Firebase et les logs des Cloud Functions.');
      }
      
      if (error.code === 'functions/permission-denied') {
        throw new Error('Permissions insuffisantes pour appeler la fonction d\'envoi d\'email.');
      }
      
      throw new Error(error.message || 'Erreur lors de l\'envoi d\'email de test');
    }
  }
};
