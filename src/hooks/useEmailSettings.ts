
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { EmailSettings, defaultEmailSettings } from '@/components/Settings/types/email';
import { emailTestService } from '@/services/emailTestService';

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingSMTP, setTestingSMTP] = useState(false);
  const [testingIMAP, setTestingIMAP] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'email_settings', 'global');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ ...defaultEmailSettings, ...docSnap.data() } as EmailSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres email:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: EmailSettings) => {
    try {
      setSaving(true);
      const docRef = doc(db, 'email_settings', 'global');
      await setDoc(docRef, newSettings);
      
      setSettings(newSettings);
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres email ont été mis à jour",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testSMTPConnection = async () => {
    try {
      setTestingSMTP(true);
      
      // Vérifier que les paramètres SMTP sont configurés
      if (!settings.smtp.host || !settings.smtp.username || !settings.smtp.password) {
        toast({
          title: "Configuration incomplète",
          description: "Veuillez configurer tous les paramètres SMTP obligatoires",
          variant: "destructive",
        });
        return;
      }

      console.log('🧪 Test de connexion SMTP réel avec:', {
        host: settings.smtp.host,
        port: settings.smtp.port,
        username: settings.smtp.username,
        security: settings.smtp.security
      });

      const result = await emailTestService.testSMTPConnection({
        host: settings.smtp.host,
        port: settings.smtp.port,
        username: settings.smtp.username,
        password: settings.smtp.password,
        security: settings.smtp.security,
        fromEmail: settings.smtp.fromEmail,
        fromName: settings.smtp.fromName
      });

      if (result.success) {
        toast({
          title: "✅ Test SMTP réussi",
          description: "La connexion SMTP fonctionne correctement",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ Erreur test SMTP:', error);
      toast({
        title: "❌ Échec du test SMTP",
        description: error.message || "Vérifiez vos paramètres de connexion",
        variant: "destructive",
      });
    } finally {
      setTestingSMTP(false);
    }
  };

  const testIMAPConnection = async () => {
    try {
      setTestingIMAP(true);
      
      // Vérifier que les paramètres IMAP sont configurés
      if (!settings.imap.host || !settings.imap.username || !settings.imap.password) {
        toast({
          title: "Configuration incomplète",
          description: "Veuillez configurer tous les paramètres IMAP obligatoires",
          variant: "destructive",
        });
        return;
      }

      console.log('🧪 Test de connexion IMAP réel avec:', {
        host: settings.imap.host,
        port: settings.imap.port,
        username: settings.imap.username,
        security: settings.imap.security
      });

      const result = await emailTestService.testIMAPConnection({
        host: settings.imap.host,
        port: settings.imap.port,
        username: settings.imap.username,
        password: settings.imap.password,
        security: settings.imap.security,
        folder: settings.imap.folder
      });

      if (result.success) {
        toast({
          title: "✅ Test IMAP réussi",
          description: "La connexion IMAP fonctionne correctement",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ Erreur test IMAP:', error);
      toast({
        title: "❌ Échec du test IMAP",
        description: error.message || "Vérifiez vos paramètres de connexion",
        variant: "destructive",
      });
    } finally {
      setTestingIMAP(false);
    }
  };

  const sendTestEmail = async (testEmailData: { to: string; subject: string; message: string }) => {
    try {
      setSendingTestEmail(true);
      
      // Vérifier que les paramètres SMTP sont configurés
      if (!settings.smtp.host || !settings.smtp.username || !settings.smtp.password || !settings.smtp.fromEmail) {
        toast({
          title: "Configuration incomplète",
          description: "Veuillez configurer tous les paramètres SMTP avant d'envoyer un email de test",
          variant: "destructive",
        });
        return { success: false };
      }

      if (!testEmailData.to) {
        toast({
          title: "Destinataire manquant",
          description: "Veuillez saisir une adresse email de destination",
          variant: "destructive",
        });
        return { success: false };
      }

      console.log('📧 Envoi d\'email de test réel:', {
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

      if (result.success) {
        toast({
          title: "✅ Email de test envoyé!",
          description: `L'email a été envoyé avec succès à ${testEmailData.to}`,
        });
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('❌ Erreur envoi email de test:', error);
      toast({
        title: "❌ Échec de l'envoi",
        description: error.message || "Vérifiez votre configuration SMTP et votre connexion internet",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setSendingTestEmail(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    testingSMTP,
    testingIMAP,
    sendingTestEmail,
    saveSettings,
    updateSettings: setSettings,
    testSMTPConnection,
    testIMAPConnection,
    sendTestEmail
  };
};
