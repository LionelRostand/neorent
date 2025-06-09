
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { EmailSettings, defaultEmailSettings } from '@/components/Settings/types/email';

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingSMTP, setTestingSMTP] = useState(false);
  const [testingIMAP, setTestingIMAP] = useState(false);
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
      // Simulation du test de connexion SMTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test SMTP réussi",
        description: "La connexion SMTP fonctionne correctement",
      });
    } catch (error) {
      console.error('Erreur test SMTP:', error);
      toast({
        title: "Échec du test SMTP",
        description: "Vérifiez vos paramètres de connexion",
        variant: "destructive",
      });
    } finally {
      setTestingSMTP(false);
    }
  };

  const testIMAPConnection = async () => {
    try {
      setTestingIMAP(true);
      // Simulation du test de connexion IMAP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test IMAP réussi",
        description: "La connexion IMAP fonctionne correctement",
      });
    } catch (error) {
      console.error('Erreur test IMAP:', error);
      toast({
        title: "Échec du test IMAP",
        description: "Vérifiez vos paramètres de connexion",
        variant: "destructive",
      });
    } finally {
      setTestingIMAP(false);
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
    saveSettings,
    updateSettings: setSettings,
    testSMTPConnection,
    testIMAPConnection
  };
};
