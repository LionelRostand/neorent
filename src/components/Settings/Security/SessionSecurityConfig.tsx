
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SessionSecurityConfigProps {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  onSessionTimeoutChange: (timeout: number) => void;
  onMaxLoginAttemptsChange: (attempts: number) => void;
  onLockoutDurationChange: (duration: number) => void;
}

const SessionSecurityConfig: React.FC<SessionSecurityConfigProps> = ({
  sessionTimeout,
  maxLoginAttempts,
  lockoutDuration,
  onSessionTimeoutChange,
  onMaxLoginAttemptsChange,
  onLockoutDurationChange
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('settings.security.sessionSecurity')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">{t('settings.security.sessionTimeout')}</Label>
            <Select 
              value={sessionTimeout.toString()} 
              onValueChange={(value) => onSessionTimeoutChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">{t('settings.security.timeoutOptions.15min')}</SelectItem>
                <SelectItem value="30">{t('settings.security.timeoutOptions.30min')}</SelectItem>
                <SelectItem value="60">{t('settings.security.timeoutOptions.1hour')}</SelectItem>
                <SelectItem value="120">{t('settings.security.timeoutOptions.2hours')}</SelectItem>
                <SelectItem value="480">{t('settings.security.timeoutOptions.8hours')}</SelectItem>
                <SelectItem value="0">{t('settings.security.timeoutOptions.never')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">{t('settings.security.maxLoginAttempts')}</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min="3"
              max="10"
              value={maxLoginAttempts}
              onChange={(e) => onMaxLoginAttemptsChange(parseInt(e.target.value) || 5)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lockoutDuration">{t('settings.security.lockoutDuration')}</Label>
          <Select 
            value={lockoutDuration.toString()} 
            onValueChange={(value) => onLockoutDurationChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">{t('settings.security.lockoutOptions.5min')}</SelectItem>
              <SelectItem value="15">{t('settings.security.lockoutOptions.15min')}</SelectItem>
              <SelectItem value="30">{t('settings.security.lockoutOptions.30min')}</SelectItem>
              <SelectItem value="60">{t('settings.security.lockoutOptions.1hour')}</SelectItem>
              <SelectItem value="120">{t('settings.security.lockoutOptions.2hours')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">{t('settings.security.recommendations.title')}</h4>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• {t('settings.security.recommendations.sessionTimeout')}</li>
                <li>• {t('settings.security.recommendations.loginAttempts')}</li>
                <li>• {t('settings.security.recommendations.twoFactor')}</li>
                <li>• {t('settings.security.recommendations.checkLogs')}</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionSecurityConfig;
