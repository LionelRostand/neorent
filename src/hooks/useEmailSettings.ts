
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmailSettings, defaultEmailSettings } from '@/components/Settings/types/email';
import { emailSettingsService } from '@/services/emailSettingsService';
import { emailTestOperations, TestEmailData } from '@/services/emailTestOperations';

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
      const fetchedSettings = await emailSettingsService.fetchSettings();
      setSettings(fetchedSettings);
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
      await emailSettingsService.saveSettings(newSettings);
      
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
      
      await emailTestOperations.testSMTPConnection(settings);
      
      toast({
        title: "✅ Test SMTP réussi",
        description: "La connexion SMTP fonctionne correctement",
      });
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
      
      await emailTestOperations.testIMAPConnection(settings);
      
      toast({
        title: "✅ Test IMAP réussi",
        description: "La connexion IMAP fonctionne correctement",
      });
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

  const sendTestEmail = async (testEmailData: TestEmailData) => {
    try {
      setSendingTestEmail(true);
      
      await emailTestOperations.sendTestEmail(settings, testEmailData);
      
      toast({
        title: "✅ Email de test envoyé!",
        description: `L'email a été envoyé avec succès à ${testEmailData.to}`,
      });
      
      return { success: true };
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
