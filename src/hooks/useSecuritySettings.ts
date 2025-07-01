
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { SecuritySettings, defaultSecuritySettings } from '@/components/Settings/types/security';

export const useSecuritySettings = () => {
  const { t } = useTranslation();
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
      console.error('Error loading security settings:', error);
      toast({
        title: t('common.error'),
        description: t('settings.security.loadingSettings'),
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
        title: t('common.success'),
        description: t('settings.security.saving'),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: t('common.error'),
        description: t('common.pleaseRetry'),
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
