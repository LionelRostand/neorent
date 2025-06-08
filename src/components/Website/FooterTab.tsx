
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FooterTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">🔗 Configuration du pied de page</h2>
      <p className="text-gray-600">Liens de navigation, informations légales, réseaux sociaux et mentions obligatoires.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Liens de navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Nom du lien" />
              <Input placeholder="URL du lien" />
            </div>
            <Button size="sm">Ajouter un lien</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Facebook URL" />
              <Input placeholder="Instagram URL" />
              <Input placeholder="Twitter URL" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations légales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Mentions légales, conditions d'utilisation..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterTab;
