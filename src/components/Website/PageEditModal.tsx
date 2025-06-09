
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Page {
  id: number;
  name: string;
  url: string;
  status: string;
  lastModified: string;
  content?: string;
}

interface PageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: Page;
  onSave: (pageData: Omit<Page, 'id' | 'lastModified'>) => void;
}

export const PageEditModal: React.FC<PageEditModalProps> = ({
  isOpen,
  onClose,
  page,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: page?.name || '',
    url: page?.url || '',
    status: page?.status || 'Brouillon',
    content: page?.content || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.url.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleUrlChange = (value: string) => {
    // Auto-génération de l'URL à partir du nom si pas encore modifiée manuellement
    if (!page) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        name: value,
        url: slug ? `/${slug}` : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, name: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {page ? 'Modifier la page' : 'Nouvelle page'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la page</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Ex: À propos"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL (slug)</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Ex: /about"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Publié">Publié</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Contenu de la page..."
              rows={6}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              {page ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
