
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [garageInfo, setGarageInfo] = useState({
    name: 'NeoGarage Auto',
    description: 'Votre garage de confiance pour l\'entretien et la réparation automobile',
    address: '123 Rue de l\'Automobile, 75000 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@neogarage.fr'
  });

  const [schedules, setSchedules] = useState({
    lundi: { start: '08:00', end: '18:00' },
    mardi: { start: '08:00', end: '18:00' },
    mercredi: { start: '08:00', end: '18:00' },
    jeudi: { start: '08:00', end: '18:00' },
    vendredi: { start: '08:00', end: '18:00' },
    samedi: { start: '09:00', end: '17:00' }
  });

  const handleSaveGarageInfo = async () => {
    setIsLoading(true);
    try {
      // Simulation d'une sauvegarde (ici on sauvegarderait dans Firebase)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Sauvegarde des informations du garage:', { garageInfo, schedules });
      
      toast({
        title: "Informations sauvegardées",
        description: "Les informations du garage ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
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
          onClick={handleSaveGarageInfo} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600">Gestion des informations principales du garage avec sauvegarde centralisée.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informations du garage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garage-name">Nom du garage</Label>
              <Input
                id="garage-name"
                value={garageInfo.name}
                onChange={(e) => setGarageInfo({...garageInfo, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garage-email">Email</Label>
              <Input
                id="garage-email"
                type="email"
                value={garageInfo.email}
                onChange={(e) => setGarageInfo({...garageInfo, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="garage-description">Description</Label>
            <Textarea
              id="garage-description"
              value={garageInfo.description}
              onChange={(e) => setGarageInfo({...garageInfo, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garage-address">Adresse</Label>
              <Input
                id="garage-address"
                value={garageInfo.address}
                onChange={(e) => setGarageInfo({...garageInfo, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garage-phone">Téléphone</Label>
              <Input
                id="garage-phone"
                value={garageInfo.phone}
                onChange={(e) => setGarageInfo({...garageInfo, phone: e.target.value})}
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
                    placeholder="08:00" 
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
