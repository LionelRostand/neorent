import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, Link } from 'lucide-react';
import { toast } from 'sonner';

const FooterTab = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const [footerLinks, setFooterLinks] = useState([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Login', url: '/login' }
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
      
      toast.success('Footer configuration saved!', {
        description: 'Links, social media and legal notices updated'
      });
    } catch (error) {
      toast.error('Error saving configuration', {
        description: 'Please try again'
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🔗 Footer Configuration</h2>
        <Button 
          onClick={handleSaveFooter} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        Navigation links, legal information, social media and mandatory notices for NeoRent.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Navigation Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {footerLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Link name" 
                    value={link.name}
                    onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                  />
                  <Input 
                    placeholder="Link URL" 
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
              Add link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Social Media</CardTitle>
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
          <CardTitle className="text-base md:text-lg">Legal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Legal notices, terms of use..."
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
