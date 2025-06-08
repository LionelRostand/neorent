
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  File, 
  Image, 
  Palette, 
  MapPin, 
  BarChart3, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Upload,
  Save,
  Link,
  Users,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Website = () => {
  const [activeTab, setActiveTab] = useState('pages');

  // States pour les différentes sections
  const [garageInfo, setGarageInfo] = useState({
    name: 'NeoGarage Auto',
    description: 'Votre garage de confiance pour l\'entretien et la réparation automobile',
    address: '123 Rue de l\'Automobile, 75000 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@neogarage.fr'
  });

  const [seoSettings, setSeoSettings] = useState({
    title: 'NeoGarage Auto - Garage de confiance à Paris',
    description: 'Entretien et réparation automobile professionnel à Paris',
    keywords: 'garage, automobile, réparation, entretien, Paris'
  });

  const [features, setFeatures] = useState({
    onlineBooking: true,
    onlineQuote: true,
    liveChat: true
  });

  const [colors, setColors] = useState({
    primary: '#22c55e',
    secondary: '#16a34a'
  });

  const pages = [
    {
      id: 1,
      name: 'Accueil',
      url: '/site',
      status: 'Publié',
      lastModified: '2025-01-08'
    },
    {
      id: 2,
      name: 'À propos',
      url: '/site/about',
      status: 'Publié',
      lastModified: '2025-01-07'
    },
    {
      id: 3,
      name: 'Contact',
      url: '/site/contact',
      status: 'Publié',
      lastModified: '2025-01-07'
    }
  ];

  const mediaFiles = [
    { id: 1, name: 'image-1.jpg', size: '2.3 MB', type: 'image' },
    { id: 2, name: 'image-2.jpg', size: '2.3 MB', type: 'image' },
    { id: 3, name: 'image-3.jpg', size: '2.3 MB', type: 'image' },
    { id: 4, name: 'image-4.jpg', size: '2.3 MB', type: 'image' }
  ];

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'content', label: 'Contenu', icon: File },
    { id: 'medias', label: 'Médias', icon: Image },
    { id: 'theme', label: 'Thème', icon: Palette },
    { id: 'footer', label: 'Pied de page', icon: Link },
    { id: 'carte', label: 'Carte', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  const handleSaveGarageInfo = () => {
    console.log('Sauvegarde des informations du garage:', garageInfo);
    // Ici on sauvegarderait dans Firebase
  };

  const handleApplyColors = () => {
    console.log('Application des couleurs:', colors);
    // Ici on appliquerait les couleurs au thème
  };

  const handleSaveSEO = () => {
    console.log('Sauvegarde des paramètres SEO:', seoSettings);
    // Ici on sauvegarderait les paramètres SEO
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion du Site Web</h1>
            <p className="text-gray-600 mt-2">Gérez le contenu et l'apparence de votre site web</p>
          </div>
          <div className="flex gap-2">
            <Link to="/site" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Voir le site
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-sm"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Onglet Pages */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">📄 Gestion des pages</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle page
              </Button>
            </div>
            <p className="text-gray-600">Créer et gérer les pages de votre site web avec titre, slug (URL) et contenu.</p>

            <div className="space-y-4">
              {pages.map((page) => (
                <Card key={page.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{page.url}</p>
                      <p className="text-gray-500 text-xs mt-1">Dernière modification: {page.lastModified}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={page.status === 'Publié' ? 'default' : 'secondary'}
                        className="bg-green-100 text-green-800"
                      >
                        {page.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Link to={page.url} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            Prévisualiser
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          Éditer
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Contenu */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">📝 Gestion du contenu</h2>
              <Button onClick={handleSaveGarageInfo} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder
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
                  <div className="grid grid-cols-2 gap-4">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <Label className="w-20">{day}</Label>
                        <Input placeholder="08:00" className="w-20" />
                        <span>-</span>
                        <Input placeholder="18:00" className="w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Médias */}
          <TabsContent value="medias" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">🖼️ Bibliothèque de médias</h2>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
            <p className="text-gray-600">Organiser et gérer vos images et documents par catégories avec intégration facile.</p>

            <div className="grid grid-cols-4 gap-4">
              {mediaFiles.map((file) => (
                <Card key={file.id} className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm">{file.name}</h3>
                  <p className="text-xs text-gray-500">{file.size}</p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Thème */}
          <TabsContent value="theme" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">🎨 Personnalisation du thème</h2>
              <Button onClick={handleApplyColors} className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appliquer les couleurs
              </Button>
            </div>
            <p className="text-gray-600">Personnaliser l'apparence avec application en temps réel et cohérence visuelle.</p>

            <Card>
              <CardHeader>
                <CardTitle>Couleurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Couleur principale</Label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: colors.primary }}
                      ></div>
                      <Input
                        value={colors.primary}
                        onChange={(e) => setColors({...colors, primary: e.target.value})}
                        placeholder="#22c55e"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur secondaire</Label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: colors.secondary }}
                      ></div>
                      <Input
                        value={colors.secondary}
                        onChange={(e) => setColors({...colors, secondary: e.target.value})}
                        placeholder="#16a34a"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typographie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Police principale</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Pied de page */}
          <TabsContent value="footer" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">🔗 Configuration du pied de page</h2>
            <p className="text-gray-600">Liens de navigation, informations légales, réseaux sociaux et mentions obligatoires.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Liens de navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input placeholder="Nom du lien" />
                    <Input placeholder="URL du lien" />
                  </div>
                  <Button size="sm">Ajouter un lien</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input placeholder="Facebook URL" />
                    <Input placeholder="Instagram URL" />
                    <Input placeholder="Twitter URL" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informations légales</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Mentions légales, conditions d'utilisation..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Carte */}
          <TabsContent value="carte" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">🗺️ Configuration de la géolocalisation</h2>
            <p className="text-gray-600">Affichage de la carte avec emplacements multiples et coordonnées GPS personnalisables.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emplacement principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input defaultValue="123 Rue de l'Automobile, 75000 Paris" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input placeholder="48.8566" />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input placeholder="2.3522" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de la carte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Niveau de zoom</Label>
                    <Select defaultValue="15">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 - Vue large</SelectItem>
                        <SelectItem value="15">15 - Vue normale</SelectItem>
                        <SelectItem value="18">18 - Vue proche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hauteur de la carte</Label>
                    <Select defaultValue="400">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">300px</SelectItem>
                        <SelectItem value="400">400px</SelectItem>
                        <SelectItem value="500">500px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">📊 Analytics</h2>
            <p className="text-gray-600">Statistiques de visite avec tracking des interactions et données stockées dans website_analytics.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">147</p>
                      <p className="text-sm text-gray-600">Visiteurs aujourd'hui</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-gray-600">Pages vues</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-gray-600">Appels téléphone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-600">Demandes contact</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Évolution hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique des visites (à intégrer avec Recharts)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Configuration */}
          <TabsContent value="config" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">⚙️ Configuration générale</h2>
              <Button onClick={handleSaveSEO} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
            <p className="text-gray-600">Paramètres techniques SEO, fonctionnalités et connexion backend Firebase.</p>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre du site</Label>
                  <Input
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={seoSettings.description}
                    onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mots-clés</Label>
                  <Input
                    value={seoSettings.keywords}
                    onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>✅ Prise de rendez-vous en ligne</Label>
                    <p className="text-sm text-gray-600">Permettre aux clients de prendre RDV</p>
                  </div>
                  <Switch
                    checked={features.onlineBooking}
                    onCheckedChange={(checked) => setFeatures({...features, onlineBooking: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>✅ Devis en ligne</Label>
                    <p className="text-sm text-gray-600">Formulaire de demande de devis</p>
                  </div>
                  <Switch
                    checked={features.onlineQuote}
                    onCheckedChange={(checked) => setFeatures({...features, onlineQuote: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>✅ Chat en direct (ChatWidget)</Label>
                    <p className="text-sm text-gray-600">Support client en temps réel</p>
                  </div>
                  <Switch
                    checked={features.liveChat}
                    onCheckedChange={(checked) => setFeatures({...features, liveChat: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accès rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline">Accès espace client</Button>
                  <Button variant="outline">Connexion Firebase</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Website;
