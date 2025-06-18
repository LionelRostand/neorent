
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import PasswordPolicyConfig from './Security/PasswordPolicyConfig';
import TwoFactorConfig from './Security/TwoFactorConfig';
import SessionSecurityConfig from './Security/SessionSecurityConfig';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SecurityTab: React.FC = () => {
  const { t } = useTranslation();
  const { settings, loading, saving, saveSettings, updateSettings } = useSecuritySettings();

  const handleSave = () => {
    saveSettings(settings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('settings.security.loadingSettings')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900 flex justify-between items-center">
            <span>🔒 {t('settings.security.title')}</span>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? t('settings.security.saving') : t('common.save')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {t('settings.security.subtitle')}
          </p>
        </CardContent>
      </Card>

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
