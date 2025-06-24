
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FileText, Shield, Cookie } from 'lucide-react';
import { toast } from 'sonner';

const LegalPagesTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  const [legalPages, setLegalPages] = useState({
    cookiePolicy: {
      title: 'Politique de Cookies',
      metaDescription: 'Comment nous utilisons les cookies sur Neo Rent',
      content: 'Contenu de la politique de cookies...',
      lastModified: new Date().toLocaleDateString()
    },
    legalNotice: {
      title: 'Mentions Légales',
      metaDescription: 'Informations légales sur Neo Rent',
      content: 'Contenu des mentions légales...',
      lastModified: new Date().toLocaleDateString()
    },
    privacyPolicy: {
      title: 'Politique de Confidentialité',
      metaDescription: 'Comment nous protégeons et utilisons vos données personnelles',
      content: 'Contenu de la politique de confidentialité...',
      lastModified: new Date().toLocaleDateString()
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving legal pages:', legalPages);
      
      toast.success('Pages légales mises à jour avec succès !', {
        description: 'Les modifications ont été sauvegardées'
      });
    } catch (error) {
      toast.error('Erreur lors de la mise à jour', {
        description: 'Une erreur est survenue'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePage = (pageKey: keyof typeof legalPages, field: string, value: string) => {
    setLegalPages(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value,
        lastModified: new Date().toLocaleDateString()
      }
    }));
  };

  const renderPageEditor = (pageKey: keyof typeof legalPages, icon: React.ReactNode) => {
    const page = legalPages[pageKey];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold">{page.title}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Titre de la page</Label>
            <Input 
              value={page.title}
              onChange={(e) => updatePage(pageKey, 'title', e.target.value)}
              placeholder="Titre de la page"
            />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Input 
              value={page.metaDescription}
              onChange={(e) => updatePage(pageKey, 'metaDescription', e.target.value)}
              placeholder="Description pour le SEO"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Contenu de la page</Label>
          <Textarea 
            value={page.content}
            onChange={(e) => updatePage(pageKey, 'content', e.target.value)}
            placeholder="Contenu de la page..."
            rows={12}
            className="font-mono text-sm"
          />
        </div>
        
        <div className="text-sm text-gray-500">
          Dernière modification : {page.lastModified}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">⚖️ Pages Légales</h2>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      
      <p className="text-gray-600 text-sm md:text-base">
        Gérez le contenu de vos pages légales (mentions légales, politique de confidentialité, cookies)
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Éditeur de Pages Légales</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cookiePolicy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cookiePolicy" className="flex items-center gap-2">
                <Cookie className="h-4 w-4" />
                <span className="hidden sm:inline">Cookies</span>
              </TabsTrigger>
              <TabsTrigger value="legalNotice" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Mentions</span>
              </TabsTrigger>
              <TabsTrigger value="privacyPolicy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Confidentialité</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cookiePolicy" className="mt-6">
              {renderPageEditor('cookiePolicy', <Cookie className="h-5 w-5 text-orange-600" />)}
            </TabsContent>
            
            <TabsContent value="legalNotice" className="mt-6">
              {renderPageEditor('legalNotice', <FileText className="h-5 w-5 text-blue-600" />)}
            </TabsContent>
            
            <TabsContent value="privacyPolicy" className="mt-6">
              {renderPageEditor('privacyPolicy', <Shield className="h-5 w-5 text-green-600" />)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalPagesTab;
