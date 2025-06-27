
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, User, Shield, Database, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminSettingsViewProps {
  currentProfile: any;
}

const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
            <p className="text-gray-600 mt-1">{t('settings.description')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('settings.account')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">{t('common.name')}</Label>
                <Input id="name" defaultValue={currentProfile?.name || ''} />
              </div>
              <div>
                <Label htmlFor="email">{t('common.email')}</Label>
                <Input id="email" type="email" defaultValue={currentProfile?.email || ''} />
              </div>
              <div>
                <Label htmlFor="phone">{t('common.phone')}</Label>
                <Input id="phone" defaultValue={currentProfile?.phone || ''} />
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('settings.security.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">{t('settings.security.currentPassword')}</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">{t('settings.security.newPassword')}</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">{t('settings.security.confirmPassword')}</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>{t('settings.security.changePassword')}</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.emailNotifications')}</p>
                  <p className="text-sm text-gray-500">{t('settings.emailNotificationsDesc')}</p>
                </div>
                <Button variant="outline" size="sm">{t('settings.enabled')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.paymentAlerts')}</p>
                  <p className="text-sm text-gray-500">{t('settings.paymentAlertsDesc')}</p>
                </div>
                <Button variant="outline" size="sm">{t('settings.enabled')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.maintenanceAlerts')}</p>
                  <p className="text-sm text-gray-500">{t('settings.maintenanceAlertsDesc')}</p>
                </div>
                <Button variant="outline" size="sm">{t('settings.enabled')}</Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('settings.general')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.language')}</p>
                  <p className="text-sm text-gray-500">{t('settings.currentLanguage')}</p>
                </div>
                <Button variant="outline" size="sm">{t('common.change')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.timezone')}</p>
                  <p className="text-sm text-gray-500">Europe/Paris</p>
                </div>
                <Button variant="outline" size="sm">{t('common.edit')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.dateFormat')}</p>
                  <p className="text-sm text-gray-500">DD/MM/YYYY</p>
                </div>
                <Button variant="outline" size="sm">{t('common.change')}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('settings.dataManagement')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.dataExport')}</p>
                  <p className="text-sm text-gray-500">{t('settings.dataExportDesc')}</p>
                </div>
                <Button variant="outline">{t('common.export')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('settings.autoBackup')}</p>
                  <p className="text-sm text-gray-500">{t('settings.autoBackupDesc')}</p>
                </div>
                <Button variant="outline" size="sm">{t('settings.configure')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">{t('settings.deleteAccount')}</p>
                  <p className="text-sm text-gray-500">{t('settings.deleteAccountDesc')}</p>
                </div>
                <Button variant="destructive">{t('common.delete')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsView;
