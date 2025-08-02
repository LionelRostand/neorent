import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Home, Users, Phone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MenuTab = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // État pour le contenu de la page d'accueil
  const [homeContent, setHomeContent] = useState({
    title: "Gestion immobilière simplifiée",
    subtitle: "Votre plateforme tout-en-un pour gérer vos biens immobiliers",
    description: "Découvrez notre solution complète de gestion immobilière qui simplifie la relation entre propriétaires et locataires.",
    ctaText: "Commencer gratuitement"
  });

  // État pour le contenu de la page à propos
  const [aboutContent, setAboutContent] = useState({
    title: "À Propos de Nous",
    subtitle: "Votre partenaire de confiance en immobilier",
    mission: "Notre mission est de simplifier la gestion immobilière en offrant des outils innovants et intuitifs.",
    vision: "Devenir la référence en matière de gestion immobilière digitale.",
    values: "Transparence, Innovation, Confiance"
  });

  // État pour le contenu de la page propriétés
  const [propertiesContent, setPropertiesContent] = useState({
    title: "Nos Propriétés",
    subtitle: "Découvrez notre sélection de biens immobiliers",
    description: "Explorez notre catalogue de propriétés soigneusement sélectionnées pour répondre à tous vos besoins.",
    searchPlaceholder: "Rechercher par ville, quartier ou type de bien...",
    filtersLabel: "Filtres de recherche",
    noResultsText: "Aucune propriété trouvée"
  });

  // État pour le contenu de la page contact
  const [contactContent, setContactContent] = useState({
    title: "Nous Contacter",
    subtitle: "Parlons de vos projets immobiliers",
    address: "123 Rue de la République, 75001 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@immobilier.fr",
    hours: "Lun-Ven: 9h-18h, Sam: 9h-12h"
  });

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedHomeContent = localStorage.getItem('homeContent');
    const savedAboutContent = localStorage.getItem('aboutContent');
    const savedPropertiesContent = localStorage.getItem('propertiesContent');
    const savedContactContent = localStorage.getItem('contactContent');

    if (savedHomeContent) {
      try {
        setHomeContent(JSON.parse(savedHomeContent));
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'accueil:', error);
      }
    }

    if (savedAboutContent) {
      try {
        setAboutContent(JSON.parse(savedAboutContent));
      } catch (error) {
        console.error('Erreur lors du chargement des données à propos:', error);
      }
    }

    if (savedPropertiesContent) {
      try {
        setPropertiesContent(JSON.parse(savedPropertiesContent));
      } catch (error) {
        console.error('Erreur lors du chargement des données propriétés:', error);
      }
    }

    if (savedContactContent) {
      try {
        setContactContent(JSON.parse(savedContactContent));
      } catch (error) {
        console.error('Erreur lors du chargement des données de contact:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Sauvegarder les données dans le localStorage
      localStorage.setItem('homeContent', JSON.stringify(homeContent));
      localStorage.setItem('aboutContent', JSON.stringify(aboutContent));
      localStorage.setItem('propertiesContent', JSON.stringify(propertiesContent));
      localStorage.setItem('contactContent', JSON.stringify(contactContent));
      
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Contenu sauvegardé",
        description: "Le contenu des menus a été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Menus</h2>
          <p className="text-muted-foreground">
            Modifiez le contenu des pages principales de votre site web
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      <Tabs defaultValue="accueil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accueil" className="gap-2">
            <Home className="h-4 w-4" />
            Accueil
          </TabsTrigger>
          <TabsTrigger value="apropos" className="gap-2">
            <Users className="h-4 w-4" />
            À Propos
          </TabsTrigger>
          <TabsTrigger value="proprietes" className="gap-2">
            <Building className="h-4 w-4" />
            Propriétés
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        {/* Page Accueil */}
        <TabsContent value="accueil">
          <Card>
            <CardHeader>
              <CardTitle>Page d'Accueil</CardTitle>
              <CardDescription>
                Modifiez le contenu principal de votre page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-title">Titre principal</Label>
                <Input
                  id="home-title"
                  value={homeContent.title}
                  onChange={(e) => setHomeContent({...homeContent, title: e.target.value})}
                  placeholder="Titre de la page d'accueil"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="home-subtitle">Sous-titre</Label>
                <Input
                  id="home-subtitle"
                  value={homeContent.subtitle}
                  onChange={(e) => setHomeContent({...homeContent, subtitle: e.target.value})}
                  placeholder="Sous-titre de la page d'accueil"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="home-description">Description</Label>
                <Textarea
                  id="home-description"
                  value={homeContent.description}
                  onChange={(e) => setHomeContent({...homeContent, description: e.target.value})}
                  placeholder="Description de votre service"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="home-cta">Texte du bouton principal</Label>
                <Input
                  id="home-cta"
                  value={homeContent.ctaText}
                  onChange={(e) => setHomeContent({...homeContent, ctaText: e.target.value})}
                  placeholder="Texte du bouton d'action"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page À Propos */}
        <TabsContent value="apropos">
          <Card>
            <CardHeader>
              <CardTitle>Page À Propos</CardTitle>
              <CardDescription>
                Modifiez le contenu de votre page à propos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Titre</Label>
                <Input
                  id="about-title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                  placeholder="Titre de la page à propos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Sous-titre</Label>
                <Input
                  id="about-subtitle"
                  value={aboutContent.subtitle}
                  onChange={(e) => setAboutContent({...aboutContent, subtitle: e.target.value})}
                  placeholder="Sous-titre de la page à propos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-mission">Notre Mission</Label>
                <Textarea
                  id="about-mission"
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})}
                  placeholder="Décrivez votre mission"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-vision">Notre Vision</Label>
                <Textarea
                  id="about-vision"
                  value={aboutContent.vision}
                  onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})}
                  placeholder="Décrivez votre vision"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-values">Nos Valeurs</Label>
                <Input
                  id="about-values"
                  value={aboutContent.values}
                  onChange={(e) => setAboutContent({...aboutContent, values: e.target.value})}
                  placeholder="Vos valeurs (séparées par des virgules)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Propriétés */}
        <TabsContent value="proprietes">
          <Card>
            <CardHeader>
              <CardTitle>Page Propriétés</CardTitle>
              <CardDescription>
                Modifiez le contenu de votre page propriétés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="properties-title">Titre</Label>
                <Input
                  id="properties-title"
                  value={propertiesContent.title}
                  onChange={(e) => setPropertiesContent({...propertiesContent, title: e.target.value})}
                  placeholder="Titre de la page propriétés"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="properties-subtitle">Sous-titre</Label>
                <Input
                  id="properties-subtitle"
                  value={propertiesContent.subtitle}
                  onChange={(e) => setPropertiesContent({...propertiesContent, subtitle: e.target.value})}
                  placeholder="Sous-titre de la page propriétés"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="properties-description">Description</Label>
                <Textarea
                  id="properties-description"
                  value={propertiesContent.description}
                  onChange={(e) => setPropertiesContent({...propertiesContent, description: e.target.value})}
                  placeholder="Description de votre catalogue de propriétés"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="properties-search">Texte de recherche</Label>
                <Input
                  id="properties-search"
                  value={propertiesContent.searchPlaceholder}
                  onChange={(e) => setPropertiesContent({...propertiesContent, searchPlaceholder: e.target.value})}
                  placeholder="Placeholder pour la barre de recherche"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="properties-filters">Label des filtres</Label>
                  <Input
                    id="properties-filters"
                    value={propertiesContent.filtersLabel}
                    onChange={(e) => setPropertiesContent({...propertiesContent, filtersLabel: e.target.value})}
                    placeholder="Texte pour les filtres"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="properties-noresults">Message aucun résultat</Label>
                  <Input
                    id="properties-noresults"
                    value={propertiesContent.noResultsText}
                    onChange={(e) => setPropertiesContent({...propertiesContent, noResultsText: e.target.value})}
                    placeholder="Message quand aucune propriété n'est trouvée"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Contact */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Page Contact</CardTitle>
              <CardDescription>
                Modifiez les informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-title">Titre</Label>
                <Input
                  id="contact-title"
                  value={contactContent.title}
                  onChange={(e) => setContactContent({...contactContent, title: e.target.value})}
                  placeholder="Titre de la page contact"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-subtitle">Sous-titre</Label>
                <Input
                  id="contact-subtitle"
                  value={contactContent.subtitle}
                  onChange={(e) => setContactContent({...contactContent, subtitle: e.target.value})}
                  placeholder="Sous-titre de la page contact"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-address">Adresse</Label>
                  <Input
                    id="contact-address"
                    value={contactContent.address}
                    onChange={(e) => setContactContent({...contactContent, address: e.target.value})}
                    placeholder="Votre adresse"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    value={contactContent.phone}
                    onChange={(e) => setContactContent({...contactContent, phone: e.target.value})}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactContent.email}
                    onChange={(e) => setContactContent({...contactContent, email: e.target.value})}
                    placeholder="Votre adresse email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-hours">Horaires d'ouverture</Label>
                  <Input
                    id="contact-hours"
                    value={contactContent.hours}
                    onChange={(e) => setContactContent({...contactContent, hours: e.target.value})}
                    placeholder="Vos horaires d'ouverture"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuTab;