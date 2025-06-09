
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PagesTab = () => {
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📄 Gestion des pages</h2>
        <Button className="flex items-center gap-2 w-full sm:w-auto">
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
                  className="bg-green-100 text-green-800 w-fit"
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
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Éditer</span>
                    <span className="sm:hidden">Édit</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
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
    </div>
  );
};

export default PagesTab;
