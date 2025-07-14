
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { SecuritySettings, defaultSecuritySettings } from '@/components/Settings/types/security';

export const useSecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'security_settings', 'global');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings({ ...defaultSecuritySettings, ...docSnap.data() } as SecuritySettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres de sécurité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de sécurité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: SecuritySettings) => {
    try {
      setSaving(true);
      const docRef = doc(db, 'security_settings', 'global');
      await setDoc(docRef, newSettings);
      
      setSettings(newSettings);
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de sécurité ont été mis à jour",
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

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    saveSettings,
    updateSettings: setSettings
  };
};
