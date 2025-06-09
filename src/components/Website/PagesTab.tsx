
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageEditModal } from './PageEditModal';
import { PageDeleteModal } from './PageDeleteModal';
import { useToast } from '@/hooks/use-toast';

interface Page {
  id: number;
  name: string;
  url: string;
  status: string;
  lastModified: string;
  content?: string;
}

const PagesTab = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([
    {
      id: 1,
      name: 'Accueil',
      url: '/',
      status: 'Publié',
      lastModified: '2025-01-08',
      content: 'Page d\'accueil du site'
    },
    {
      id: 2,
      name: 'À propos',
      url: '/about',
      status: 'Publié',
      lastModified: '2025-01-07',
      content: 'Page à propos de notre entreprise'
    },
    {
      id: 3,
      name: 'Contact',
      url: '/contact',
      status: 'Publié',
      lastModified: '2025-01-07',
      content: 'Page de contact'
    }
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | undefined>();

  const handleCreatePage = () => {
    setSelectedPage(undefined);
    setEditModalOpen(true);
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const handleDeletePage = (page: Page) => {
    setSelectedPage(page);
    setDeleteModalOpen(true);
  };

  const handleSavePage = (pageData: Omit<Page, 'id' | 'lastModified'>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (selectedPage) {
      // Modification d'une page existante
      setPages(prev => prev.map(page => 
        page.id === selectedPage.id 
          ? { ...page, ...pageData, lastModified: currentDate }
          : page
      ));
      toast({
        title: "Page mise à jour",
        description: `La page "${pageData.name}" a été mise à jour avec succès.`,
      });
    } else {
      // Création d'une nouvelle page
      const newPage: Page = {
        ...pageData,
        id: Math.max(...pages.map(p => p.id)) + 1,
        lastModified: currentDate
      };
      setPages(prev => [...prev, newPage]);
      toast({
        title: "Page créée",
        description: `La page "${pageData.name}" a été créée avec succès.`,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPage) {
      setPages(prev => prev.filter(page => page.id !== selectedPage.id));
      toast({
        title: "Page supprimée",
        description: `La page "${selectedPage.name}" a été supprimée.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📄 Gestion des pages</h2>
        <Button 
          onClick={handleCreatePage}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nouvelle page
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Créer et gérer les pages de votre site web avec titre, slug (URL) et contenu.
      </p>

      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.id} className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                  {page.name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1 truncate">{page.url}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Dernière modification: {page.lastModified}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Badge 
                  variant={page.status === 'Publié' ? 'default' : 'secondary'}
                  className={page.status === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {page.status}
                </Badge>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={page.url} target="_blank">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span className="hidden sm:inline">Prévisualiser</span>
                      <span className="sm:hidden">Voir</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleEditPage(page)}
                  >
                    <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Éditer</span>
                    <span className="sm:hidden">Édit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePage(page)}
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Supprimer</span>
                    <span className="sm:hidden">Supp</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PageEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        page={selectedPage}
        onSave={handleSavePage}
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
