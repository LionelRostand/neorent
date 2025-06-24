
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface FormButtonConfig {
  variant: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export interface ActionButtonConfig {
  [actionId: string]: FormButtonConfig;
}

const defaultButtonConfig: FormButtonConfig = {
  variant: 'default',
  size: 'default',
  className: ''
};

export const useFormButtonConfig = () => {
  const { user, userType } = useAuth();
  const { toast } = useToast();
  const [buttonConfigs, setButtonConfigs] = useState<ActionButtonConfig>({});
  const [loading, setLoading] = useState(true);

  const isAdmin = userType === 'admin';

  useEffect(() => {
    loadButtonConfigs();
  }, [user]);

  const loadButtonConfigs = async () => {
    try {
      if (!user) {
        setButtonConfigs({});
        setLoading(false);
        return;
      }

      const configDoc = await getDoc(doc(db, 'system_config', 'form_button_configs'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setButtonConfigs(data.configs || {});
      } else {
        setButtonConfigs({});
      }
    } catch (error) {
      console.error('Error loading button configs:', error);
      setButtonConfigs({});
    } finally {
      setLoading(false);
    }
  };

  const saveButtonConfig = async (actionId: string, config: FormButtonConfig) => {
    if (!isAdmin) {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent modifier cette configuration",
        variant: "destructive",
      });
      return false;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive",
      });
      return false;
    }

    try {
      const updatedConfigs = {
        ...buttonConfigs,
        [actionId]: config
      };

      await setDoc(doc(db, 'system_config', 'form_button_configs'), {
        configs: updatedConfigs,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });

      setButtonConfigs(updatedConfigs);
      
      toast({
        title: "Succès",
        description: "Configuration du bouton mise à jour",
      });
      return true;
    } catch (error) {
      console.error('Error saving button config:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la configuration",
        variant: "destructive",
      });
      return false;
    }
  };

  const getButtonConfig = (actionId: string): FormButtonConfig => {
    return buttonConfigs[actionId] || defaultButtonConfig;
  };

  return {
    buttonConfigs,
    loading,
    isAdmin,
    saveButtonConfig,
    getButtonConfig
  };
};
