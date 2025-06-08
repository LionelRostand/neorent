import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  File, 
  Image, 
  Palette, 
  Map, 
  BarChart3, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Website = () => {
  const [activeTab, setActiveTab] = useState('pages');

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

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'content', label: 'Contenu', icon: File },
    { id: 'medias', label: 'Médias', icon: Image },
    { id: 'theme', label: 'Thème', icon: Palette },
    { id: 'footer', label: 'Pied de page', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

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
          <TabsList className="grid w-full grid-cols-7 mb-6">
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

          <TabsContent value="pages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Gestion des pages</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle page
              </Button>
            </div>

            <div className="space-y-4">
              {pages.map((page) => (
                <Card key={page.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{page.url}</p>
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

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gérez le contenu de votre site web ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bibliothèque Médias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gérez vos images et fichiers médias ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personnalisation du Thème</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Personnalisez l'apparence de votre site web.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du Pied de Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configurez le pied de page de votre site.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Consultez les statistiques de votre site web.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Générale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configurez les paramètres généraux de votre site.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Website;
