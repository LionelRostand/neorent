
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const ContentTab = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'NeoRent',
    description: 'Simplified Property Management - Your trusted partner for managing your real estate properties',
    address: '123 Peace Street, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@neorent.fr'
  });

  const [schedules, setSchedules] = useState({
    monday: { start: '09:00', end: '18:00' },
    tuesday: { start: '09:00', end: '18:00' },
    wednesday: { start: '09:00', end: '18:00' },
    thursday: { start: '09:00', end: '18:00' },
    friday: { start: '09:00', end: '18:00' },
    saturday: { start: '10:00', end: '16:00' }
  });

  const handleSaveInfo = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving NeoRent information:', { companyInfo, schedules });
      
      toast.success('Information saved successfully!', {
        description: 'NeoRent information has been updated.'
      });
    } catch (error) {
      toast.error('Error saving information', {
        description: 'An error occurred while saving.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = (day: string, field: 'start' | 'end', value: string) => {
    setSchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const dayTranslations = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday'
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📝 Content Management</h2>
        <Button 
          onClick={handleSaveInfo} 
          className="flex items-center gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Manage NeoRent's main information with centralized saving.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description</Label>
            <Textarea
              id="company-description"
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-address">Address</Label>
              <Input
                id="company-address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone</Label>
              <Input
                id="company-phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opening Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(schedules).map(([day, schedule]) => (
                <div key={day} className="flex items-center gap-2">
                  <Label className="w-20 capitalize">{dayTranslations[day]}</Label>
                  <Input 
                    placeholder="09:00" 
                    className="w-20" 
                    value={schedule.start}
                    onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                  />
                  <span>-</span>
                  <Input 
                    placeholder="18:00" 
                    className="w-20"
                    value={schedule.end}
                    onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
