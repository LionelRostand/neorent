
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const FooterTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const [footerLinks, setFooterLinks] = useState([
    { name: 'Accueil', url: '/' },
    { name: 'À propos', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Connexion', url: '/login' }
  ]);

  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/neorent',
    instagram: 'https://instagram.com/neorent',
    twitter: 'https://twitter.com/neorent',
    linkedin: 'https://linkedin.com/company/neorent'
  });

  const [legalInfo, setLegalInfo] = useState(
    'NeoRent - Gestion Immobilière Simplifiée\n' +
    'Société par Actions Simplifiée au capital de 10 000 €\n' +
    'SIRET: 123 456 789 00012\n' +
    'Siège social: 123 Rue de la Paix, 75001 Paris\n\n' +
    'Mentions légales - Conditions générales d\'utilisation - Politique de confidentialité\n' +
    'Conformément à la loi « informatique et libertés », vous pouvez exercer votre droit d\'accès aux données vous concernant.'
  );

  const handleSaveFooter = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sauvegarde configuration pied de page:', {
        footerLinks,
        socialMedia,
        legalInfo
      });
      
      toast.success('Configuration du pied de page sauvegardée !', {
        description: 'Liens, réseaux sociaux et mentions légales mis à jour'
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addFooterLink = () => {
    setFooterLinks([...footerLinks, { name: '', url: '' }]);
  };

  const removeFooterLink = (index: number) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  const updateFooterLink = (index: number, field: 'name' | 'url', value: string) => {
    const updated = [...footerLinks];
    updated[index][field] = value;
    setFooterLinks(updated);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🔗 Configuration du pied de page</h2>
        <Button 
          onClick={handleSaveFooter} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Liens de navigation, informations légales, réseaux sociaux et mentions obligatoires pour NeoRent.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Liens de navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {footerLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nom du lien" 
                    value={link.name}
                    onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                  />
                  <Input 
                    placeholder="URL du lien" 
                    value={link.url}
                    onChange={(e) => updateFooterLink(index, 'url', e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeFooterLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" onClick={addFooterLink} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lien
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input 
                placeholder="Facebook URL" 
                value={socialMedia.facebook}
                onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input 
                placeholder="Instagram URL" 
                value={socialMedia.instagram}
                onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <Input 
                placeholder="Twitter URL" 
                value={socialMedia.twitter}
                onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input 
                placeholder="LinkedIn URL" 
                value={socialMedia.linkedin}
                onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Informations légales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Mentions légales, conditions d'utilisation..."
            rows={8}
            className="resize-none"
            value={legalInfo}
            onChange={(e) => setLegalInfo(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterTab;
