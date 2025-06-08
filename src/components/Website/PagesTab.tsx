
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
    <div className="space-y-6">
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
    </div>
  );
};

export default PagesTab;
