
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';
import { PasswordPolicy } from '../types/security';

interface PasswordPolicyConfigProps {
  policy: PasswordPolicy;
  onPolicyChange: (policy: PasswordPolicy) => void;
}

const PasswordPolicyConfig: React.FC<PasswordPolicyConfigProps> = ({
  policy,
  onPolicyChange
}) => {
  const updatePolicy = (updates: Partial<PasswordPolicy>) => {
    onPolicyChange({ ...policy, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Politique de mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minLength">Longueur minimale</Label>
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
            <Label htmlFor="passwordExpiry">Expiration (jours)</Label>
            <Select value={policy.passwordExpiry.toString()} onValueChange={(value) => updatePolicy({ passwordExpiry: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="60">60 jours</SelectItem>
                <SelectItem value="90">90 jours</SelectItem>
                <SelectItem value="120">120 jours</SelectItem>
                <SelectItem value="0">Jamais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Exigences de complexité</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireUppercase">Majuscules requises</Label>
              <Switch
                id="requireUppercase"
                checked={policy.requireUppercase}
                onCheckedChange={(checked) => updatePolicy({ requireUppercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireLowercase">Minuscules requises</Label>
              <Switch
                id="requireLowercase"
                checked={policy.requireLowercase}
                onCheckedChange={(checked) => updatePolicy({ requireLowercase: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireNumbers">Chiffres requis</Label>
              <Switch
                id="requireNumbers"
                checked={policy.requireNumbers}
                onCheckedChange={(checked) => updatePolicy({ requireNumbers: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireSpecialChars">Caractères spéciaux</Label>
              <Switch
                id="requireSpecialChars"
                checked={policy.requireSpecialChars}
                onCheckedChange={(checked) => updatePolicy({ requireSpecialChars: checked })}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="preventCommonPasswords">Bloquer mots de passe courants</Label>
              <p className="text-sm text-gray-500">Empêche l'utilisation de mots de passe faibles comme "123456"</p>
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
