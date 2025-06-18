
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';
import { PasswordPolicy } from '../types/security';
import { useTranslation } from 'react-i18next';

interface PasswordPolicyConfigProps {
  policy: PasswordPolicy;
  onPolicyChange: (policy: PasswordPolicy) => void;
}

const PasswordPolicyConfig: React.FC<PasswordPolicyConfigProps> = ({
  policy,
  onPolicyChange
}) => {
  const { t } = useTranslation();

  const updatePolicy = (updates: Partial<PasswordPolicy>) => {
    onPolicyChange({ ...policy, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('settings.security.passwordPolicy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minLength">{t('settings.security.minLength')}</Label>
            <Input
              id="minLength"
              type="number"
              min="6"
              max="32"
              value={policy.minLength}
              onChange={(e) => updatePolicy({ minLength: parseInt(e.target.value) || 8 })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passwordExpiry">{t('settings.security.passwordExpiry')}</Label>
            <Select value={policy.passwordExpiry.toString()} onValueChange={(value) => updatePolicy({ passwordExpiry: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">{t('settings.security.expiryOptions.30days')}</SelectItem>
                <SelectItem value="60">{t('settings.security.expiryOptions.60days')}</SelectItem>
                <SelectItem value="90">{t('settings.security.expiryOptions.90days')}</SelectItem>
                <SelectItem value="120">{t('settings.security.expiryOptions.120days')}</SelectItem>
                <SelectItem value="0">{t('settings.security.expiryOptions.never')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">{t('settings.security.complexityRequirements')}</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireUppercase">{t('settings.security.requireUppercase')}</Label>
              <Switch
                id="requireUppercase"
                checked={policy.requireUppercase}
                onCheckedChange={(checked) => updatePolicy({ requireUppercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireLowercase">{t('settings.security.requireLowercase')}</Label>
              <Switch
                id="requireLowercase"
                checked={policy.requireLowercase}
                onCheckedChange={(checked) => updatePolicy({ requireLowercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireNumbers">{t('settings.security.requireNumbers')}</Label>
              <Switch
                id="requireNumbers"
                checked={policy.requireNumbers}
                onCheckedChange={(checked) => updatePolicy({ requireNumbers: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireSpecialChars">{t('settings.security.requireSpecialChars')}</Label>
              <Switch
                id="requireSpecialChars"
                checked={policy.requireSpecialChars}
                onCheckedChange={(checked) => updatePolicy({ requireSpecialChars: checked })}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="preventCommonPasswords">{t('settings.security.preventCommonPasswords')}</Label>
              <p className="text-sm text-gray-500">{t('settings.security.preventCommonPasswordsDescription')}</p>
            </div>
            <Switch
              id="preventCommonPasswords"
              checked={policy.preventCommonPasswords}
              onCheckedChange={(checked) => updatePolicy({ preventCommonPasswords: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordPolicyConfig;
