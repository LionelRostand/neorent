import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Menu } from 'lucide-react';
import { toast } from 'sonner';

const MenuTab = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [homeMenu, setHomeMenu] = useState({
    title: 'Accueil',
    subtitle: 'Gestion Immobilière Simplifiée',
    description: 'Votre partenaire de confiance pour la gestion de vos biens immobiliers',
    buttonText: 'Nous contacter'
  });

  const [aboutMenu, setAboutMenu] = useState({
    title: 'À Propos de Nous',
    subtitle: 'Votre partenaire de confiance en immobilier',
    description: 'Découvrez notre expertise et notre engagement dans la gestion immobilière',
    mission: 'Notre Mission',
    vision: 'Notre Vision',
    values: 'Nos Valeurs',
    team: 'Notre Équipe'
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving menu content:', { homeMenu, aboutMenu });
      
      toast.success('Contenu des menus mis à jour avec succès !', {
        description: 'Les modifications ont été sauvegardées.'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Une erreur est survenue.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          <Menu className="inline-block mr-2 h-6 w-6" />
          Gestion des Menus
        </h2>
        <Button 
          onClick={handleSave} 
          className="flex items-center gap-2 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Gérez le contenu des pages Accueil et À Propos de votre site web.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Menu Accueil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Page Accueil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="home-title">Titre principal</Label>
              <Input
                id="home-title"
                value={homeMenu.title}
                onChange={(e) => setHomeMenu({...homeMenu, title: e.target.value})}
                placeholder="ex: Accueil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="home-subtitle">Sous-titre</Label>
              <Input
                id="home-subtitle"
                value={homeMenu.subtitle}
                onChange={(e) => setHomeMenu({...homeMenu, subtitle: e.target.value})}
                placeholder="ex: Gestion Immobilière Simplifiée"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="home-description">Description</Label>
              <Textarea
                id="home-description"
                value={homeMenu.description}
                onChange={(e) => setHomeMenu({...homeMenu, description: e.target.value})}
                rows={3}
                placeholder="Description de votre entreprise..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="home-button">Texte du bouton</Label>
              <Input
                id="home-button"
                value={homeMenu.buttonText}
                onChange={(e) => setHomeMenu({...homeMenu, buttonText: e.target.value})}
                placeholder="ex: Nous contacter"
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu À Propos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Page À Propos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-title">Titre principal</Label>
              <Input
                id="about-title"
                value={aboutMenu.title}
                onChange={(e) => setAboutMenu({...aboutMenu, title: e.target.value})}
                placeholder="ex: À Propos de Nous"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about-subtitle">Sous-titre</Label>
              <Input
                id="about-subtitle"
                value={aboutMenu.subtitle}
                onChange={(e) => setAboutMenu({...aboutMenu, subtitle: e.target.value})}
                placeholder="ex: Votre partenaire de confiance"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about-description">Description</Label>
              <Textarea
                id="about-description"
                value={aboutMenu.description}
                onChange={(e) => setAboutMenu({...aboutMenu, description: e.target.value})}
                rows={3}
                placeholder="Description de votre section À Propos..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="about-mission">Mission</Label>
                <Input
                  id="about-mission"
                  value={aboutMenu.mission}
                  onChange={(e) => setAboutMenu({...aboutMenu, mission: e.target.value})}
                  placeholder="Notre Mission"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-vision">Vision</Label>
                <Input
                  id="about-vision"
                  value={aboutMenu.vision}
                  onChange={(e) => setAboutMenu({...aboutMenu, vision: e.target.value})}
                  placeholder="Notre Vision"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="about-values">Valeurs</Label>
                <Input
                  id="about-values"
                  value={aboutMenu.values}
                  onChange={(e) => setAboutMenu({...aboutMenu, values: e.target.value})}
                  placeholder="Nos Valeurs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-team">Équipe</Label>
                <Input
                  id="about-team"
                  value={aboutMenu.team}
                  onChange={(e) => setAboutMenu({...aboutMenu, team: e.target.value})}
                  placeholder="Notre Équipe"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenuTab;