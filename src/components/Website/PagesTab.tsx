
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
  nameKey?: string;
}

const PagesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  const getPageName = (page: Page) => {
    if (page.nameKey) {
      const translatedName = t(page.nameKey);
      if (translatedName === page.nameKey) {
        return page.name;
      }
      return translatedName;
    }
    return page.name;
  };

  const getPageStatus = (status: string) => {
    if (status === 'published' || status === 'Publié' || status === 'Veröffentlicht') {
      return t('common.published');
    }
    if (status === 'draft' || status === 'Brouillon' || status === 'Entwurf') {
      return t('common.draft');
    }
    return status;
  };

  const [pages, setPages] = useState<Page[]>([
    { id: 1, name: 'Accueil', nameKey: 'common.home', url: '/', status: 'published', lastModified: '2024-01-15' },
    { id: 2, name: 'À Propos', nameKey: 'common.about', url: '/about', status: 'published', lastModified: '2024-01-14' },
    { id: 3, name: 'Contact', nameKey: 'common.contact', url: '/contact', status: 'published', lastModified: '2024-01-13' },
    { id: 4, name: 'Propriétés', nameKey: 'common.properties', url: '/properties', status: 'published', lastModified: '2024-01-12' },
    { id: 5, name: 'Connexion', nameKey: 'common.login', url: '/login', status: 'published', lastModified: '2024-01-11' },
    { id: 6, name: 'Services', nameKey: 'common.services', url: '/services', status: 'draft', lastModified: '2024-01-10' }
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
        description: t('website.contentSavedDescription')
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
        status: 'draft',
        lastModified: new Date().toISOString().split('T')[0]
      };
      setPages([...pages, page]);
      setNewPage({ title: '', url: '', content: '', metaDescription: '' });
      toast.success(t('website.contentSaved'));
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
      toast.success(t('website.contentSaved'));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPage) {
      setPages(pages.filter(p => p.id !== selectedPage.id));
      toast.success(t('website.contentSaved'));
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
            <CardTitle className="text-base md:text-lg">{t('website.pages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{getPageName(page)}</h4>
                    <p className="text-sm text-gray-500">{page.url}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      getPageStatus(page.status) === t('common.published')
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getPageStatus(page.status)}
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
              <Label>{t('common.name')}</Label>
              <Input 
                placeholder={t('common.services')}
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                placeholder="/services"
                value={newPage.url}
                onChange={(e) => setNewPage({...newPage, url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>META {t('common.description')}</Label>
              <Textarea 
                placeholder={t('website.seoSettingsDescription')}
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
