
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const FooterTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  
  const [footerLinks, setFooterLinks] = useState([
    { name: t('home'), url: '/' },
    { name: t('about'), url: '/about' },
    { name: t('contact'), url: '/contact' },
    { name: t('login'), url: '/login' }
  ]);

  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/neorent',
    instagram: 'https://instagram.com/neorent',
    twitter: 'https://twitter.com/neorent',
    linkedin: 'https://linkedin.com/company/neorent'
  });

  const [legalInfo, setLegalInfo] = useState(
    'NeoRent - Simplified Property Management\n' +
    'Simplified Joint Stock Company with capital of €10,000\n' +
    'SIRET: 123 456 789 00012\n' +
    'Registered office: 123 Peace Street, 75001 Paris\n\n' +
    'Legal notices - Terms of use - Privacy policy\n' +
    'In accordance with the "data protection" law, you may exercise your right of access to data concerning you.'
  );

  const handleSaveFooter = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving footer configuration:', {
        footerLinks,
        socialMedia,
        legalInfo
      });
      
      toast.success(t('website.footerConfigurationSaved'), {
        description: t('website.footerConfigurationSavedDescription')
      });
    } catch (error) {
      toast.error(t('website.contentSaveError'), {
        description: t('website.pleaseRetry')
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🔗 {t('website.footerConfiguration')}</h2>
        <Button 
          onClick={handleSaveFooter} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? t('website.saving') : t('save')}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        {t('website.footerConfigurationDescription')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('website.navigationLinks')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {footerLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t('website.linkName')} 
                    value={link.name}
                    onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                  />
                  <Input 
                    placeholder={t('website.linkUrl')} 
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
              {t('website.addLink')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('website.socialMedia')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('website.facebook')}</Label>
              <Input 
                placeholder={t('website.facebookUrl')} 
                value={socialMedia.facebook}
                onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.instagram')}</Label>
              <Input 
                placeholder={t('website.instagramUrl')} 
                value={socialMedia.instagram}
                onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.twitter')}</Label>
              <Input 
                placeholder={t('website.twitterUrl')} 
                value={socialMedia.twitter}
                onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.linkedin')}</Label>
              <Input 
                placeholder={t('website.linkedinUrl')} 
                value={socialMedia.linkedin}
                onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.legalInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder={t('website.legalNoticesPlaceholder')}
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
