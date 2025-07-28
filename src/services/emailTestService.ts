// Service de test d'email simplifié sans Firebase Functions

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

// Fonction de validation basique côté client
const validateSMTPConfig = (config: SMTPConfig): { success: boolean; error?: string } => {
  if (!config.host || !config.username || !config.password) {
    return { success: false, error: 'Configuration SMTP incomplète' };
  }

  // Validation du serveur SMTP
  if (!config.host.includes('smtp.')) {
    return { success: false, error: 'L\'adresse du serveur SMTP semble invalide' };
  }

  // Validation du port
  const validPorts = [25, 465, 587, 2525];
  if (!validPorts.includes(config.port)) {
    return { success: false, error: `Le port ${config.port} n'est pas un port SMTP standard` };
  }

  // Validation basique des identifiants
  if (!config.username.includes('@') || config.password.length < 8) {
    return { success: false, error: 'Les identifiants semblent invalides' };
  }

  return { success: true };
};

const validateIMAPConfig = (config: IMAPConfig): { success: boolean; error?: string } => {
  if (!config.host || !config.username || !config.password) {
    return { success: false, error: 'Configuration IMAP incomplète' };
  }

  // Validation du serveur IMAP
  if (!config.host.includes('imap.')) {
    return { success: false, error: 'L\'adresse du serveur IMAP semble invalide' };
  }

  // Validation du port
  const validPorts = [143, 993];
  if (!validPorts.includes(config.port)) {
    return { success: false, error: `Le port ${config.port} n'est pas un port IMAP standard` };
  }

  return { success: true };
};

export const emailTestService = {
  async testSMTPConnection(config: SMTPConfig) {
    try {
      console.log('🧪 Test de connexion SMTP côté client:', config.host);
      
      // Simulation d'un délai de test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validation côté client
      const validation = validateSMTPConfig(config);
      if (!validation.success) {
        return validation;
      }

      console.log('✅ Test SMTP réussi (simulation)');
      return { 
        success: true, 
        message: 'Configuration SMTP validée (test simulé côté client)' 
      };
    } catch (error: any) {
      console.error('❌ Erreur test SMTP:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors du test SMTP' 
      };
    }
  },

  async testIMAPConnection(config: IMAPConfig) {
    try {
      console.log('🧪 Test de connexion IMAP côté client:', config.host);
      
      // Simulation d'un délai de test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validation côté client
      const validation = validateIMAPConfig(config);
      if (!validation.success) {
        return validation;
      }

      console.log('✅ Test IMAP réussi (simulation)');
      return { 
        success: true, 
        message: 'Configuration IMAP validée (test simulé côté client)' 
      };
    } catch (error: any) {
      console.error('❌ Erreur test IMAP:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors du test IMAP' 
      };
    }
  },

  async sendTestEmail(request: TestEmailRequest) {
    try {
      console.log('📧 Simulation envoi email de test vers:', request.to);
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validation de la configuration SMTP
      const validation = validateSMTPConfig(request.smtp);
      if (!validation.success) {
        return validation;
      }

      // Validation de l'email destinataire
      if (!request.to.includes('@')) {
        return { success: false, error: 'Adresse email destinataire invalide' };
      }

      console.log('✅ Email de test envoyé (simulation)');
      return { 
        success: true, 
        message: 'Email de test envoyé avec succès (simulation côté client)' 
      };
    } catch (error: any) {
      console.error('❌ Erreur envoi email test:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de l\'envoi de l\'email de test' 
      };
    }
  }
};