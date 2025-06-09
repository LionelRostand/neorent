
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const ContentTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'NeoRent',
    description: 'Gestion Immobilière Simplifiée - Votre partenaire de confiance pour la gestion de vos biens immobiliers',
    address: '123 Rue de la Paix, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@neorent.fr'
  });

  const [schedules, setSchedules] = useState({
    lundi: { start: '09:00', end: '18:00' },
    mardi: { start: '09:00', end: '18:00' },
    mercredi: { start: '09:00', end: '18:00' },
    jeudi: { start: '09:00', end: '18:00' },
    vendredi: { start: '09:00', end: '18:00' },
    samedi: { start: '10:00', end: '16:00' }
  });

  const handleSaveInfo = async () => {
    setIsLoading(true);
    try {
      // Simulation d'une sauvegarde (ici on sauvegarderait dans Firebase)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sauvegarde des informations de NeoRent:', { companyInfo, schedules });
      
      toast.success('Informations sauvegardées avec succès !', {
        description: 'Les informations de NeoRent ont été mises à jour.'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Une erreur est survenue lors de la sauvegarde.'
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">📝 Gestion du contenu</h2>
        <Button 
          onClick={handleSaveInfo} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600">Gestion des informations principales de NeoRent avec sauvegarde centralisée.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de l'entreprise</Label>
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
              <Label htmlFor="company-address">Adresse</Label>
              <Input
                id="company-address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Téléphone</Label>
              <Input
                id="company-phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(schedules).map(([day, schedule]) => (
                <div key={day} className="flex items-center gap-2">
                  <Label className="w-20 capitalize">{day}</Label>
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
