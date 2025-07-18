
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageEditModal } from './PageEditModal';
import { PageDeleteModal } from './PageDeleteModal';

interface Page {
  id: number;
  name: string;
  url: string;
  status: string;
  lastModified: string;
  content?: string;
}

const PagesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [pages, setPages] = useState<Page[]>([
    { id: 1, name: 'Accueil', url: '/', status: 'Publié', lastModified: '2024-01-15' },
    { id: 2, name: 'À Propos', url: '/about', status: 'Publié', lastModified: '2024-01-14' },
    { id: 3, name: 'Contact', url: '/contact', status: 'Publié', lastModified: '2024-01-13' },
    { id: 4, name: 'Propriétés', url: '/properties', status: 'Publié', lastModified: '2024-01-12' },
    { id: 5, name: 'Connexion', url: '/login', status: 'Publié', lastModified: '2024-01-11' },
    { id: 6, name: 'Services', url: '/services', status: 'Brouillon', lastModified: '2024-01-10' }
  ]);

  const [newPage, setNewPage] = useState({
    title: '',
    url: '',
    content: '',
    metaDescription: ''
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | undefined>();

  const handleSavePages = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving pages:', { pages, newPage });
      
      toast.success(t('website.updateSuccess'), {
        description: t('website.updateSuccess')
      });
    } catch (error) {
      toast.error(t('website.updateError'), {
        description: t('common.error')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewPage = () => {
    if (newPage.title && newPage.url) {
      const page: Page = {
        id: Math.max(...pages.map(p => p.id)) + 1,
        name: newPage.title,
        url: newPage.url,
        status: 'Brouillon',
        lastModified: new Date().toISOString().split('T')[0]
      };
      setPages([...pages, page]);
      setNewPage({ title: '', url: '', content: '', metaDescription: '' });
      toast.success('Page ajoutée avec succès !');
    }
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const handleDeletePage = (page: Page) => {
    setSelectedPage(page);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = (pageData: Omit<Page, 'id' | 'lastModified'>) => {
    if (selectedPage) {
      setPages(pages.map(p => 
        p.id === selectedPage.id 
          ? { ...p, ...pageData, lastModified: new Date().toISOString().split('T')[0] }
          : p
      ));
      toast.success('Page modifiée avec succès !');
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPage) {
      setPages(pages.filter(p => p.id !== selectedPage.id));
      toast.success('Page supprimée avec succès !');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📄 {t('website.managePages')}</h2>
        <Button 
          onClick={handleSavePages} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        {t('website.description')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('common.pages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{page.name}</h4>
                    <p className="text-sm text-gray-500">{page.url}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      page.status === 'Publié' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPage(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeletePage(page)}
                    >
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
            <CardTitle className="text-base md:text-lg">{t('common.new')} {t('common.page')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('common.page')} {t('common.name')}</Label>
              <Input 
                placeholder="ex: Nos Services"
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                placeholder="ex: /services"
                value={newPage.url}
                onChange={(e) => setNewPage({...newPage, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>META {t('common.description')}</Label>
              <Textarea 
                placeholder="Description pour le SEO..."
                rows={2}
                value={newPage.metaDescription}
                onChange={(e) => setNewPage({...newPage, metaDescription: e.target.value})}
              />
            </div>
            <Button onClick={addNewPage} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('common.add')} {t('common.page')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <PageEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        page={selectedPage}
        onSave={handleSaveEdit}
      />

      <PageDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        page={selectedPage}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PagesTab;
