
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PagesTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [pages, setPages] = useState([
    { id: '1', title: 'Accueil', url: '/', status: 'Publiée' },
    { id: '2', title: 'À propos', url: '/about', status: 'Publiée' },
    { id: '3', title: 'Contact', url: '/contact', status: 'Publiée' },
    { id: '4', title: 'Services', url: '/services', status: 'Brouillon' }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    url: '',
    content: '',
    metaDescription: ''
  });

  const handleSavePages = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sauvegarde des pages:', { pages, newPage });
      
      toast.success('Pages sauvegardées avec succès !', {
        description: 'Configuration des pages mise à jour'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewPage = () => {
    if (newPage.title && newPage.url) {
      const page = {
        id: String(pages.length + 1),
        title: newPage.title,
        url: newPage.url,
        status: 'Brouillon'
      };
      setPages([...pages, page]);
      setNewPage({ title: '', url: '', content: '', metaDescription: '' });
      toast.success('Page ajoutée avec succès !');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📄 Gestion des pages</h2>
        <Button 
          onClick={handleSavePages} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Créez et gérez les pages de votre site web NeoRent.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Pages existantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-gray-500">{page.url}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      page.status === 'Publiée' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Ajouter une nouvelle page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titre de la page</Label>
              <Input 
                placeholder="Ex: Nos services"
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                placeholder="Ex: /services"
                value={newPage.url}
                onChange={(e) => setNewPage({...newPage, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Description META</Label>
              <Textarea 
                placeholder="Description pour le SEO..."
                rows={2}
                value={newPage.metaDescription}
                onChange={(e) => setNewPage({...newPage, metaDescription: e.target.value})}
              />
            </div>
            <Button onClick={addNewPage} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter la page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagesTab;
