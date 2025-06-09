
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import PasswordPolicyConfig from './Security/PasswordPolicyConfig';
import TwoFactorConfig from './Security/TwoFactorConfig';
import SessionSecurityConfig from './Security/SessionSecurityConfig';

const SecurityTab: React.FC = () => {
  const { settings, loading, saving, saveSettings, updateSettings } = useSecuritySettings();

  const handleSave = () => {
    saveSettings(settings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres de sécurité</h2>
          <p className="text-gray-600">
            Configurez la sécurité et les politiques d'accès de votre application
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <PasswordPolicyConfig
        policy={settings.passwordPolicy}
        onPolicyChange={(policy) => 
          updateSettings({ ...settings, passwordPolicy: policy })
        }
      />

      <TwoFactorConfig
        settings={settings.twoFactor}
        onSettingsChange={(twoFactor) => 
          updateSettings({ ...settings, twoFactor })
        }
      />

      <SessionSecurityConfig
        sessionTimeout={settings.sessionTimeout}
        maxLoginAttempts={settings.maxLoginAttempts}
        lockoutDuration={settings.lockoutDuration}
        onSessionTimeoutChange={(sessionTimeout) => 
          updateSettings({ ...settings, sessionTimeout })
        }
        onMaxLoginAttemptsChange={(maxLoginAttempts) => 
          updateSettings({ ...settings, maxLoginAttempts })
        }
        onLockoutDurationChange={(lockoutDuration) => 
          updateSettings({ ...settings, lockoutDuration })
        }
      />
    </div>
  );
};

export default SecurityTab;
