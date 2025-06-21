
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeft, Building, Mail, User, FileText } from 'lucide-react';

interface OwnerRegistrationData {
  name: string;
  email: string;
  companyName: string;
  description: string;
}

interface OwnerRegistrationFormProps {
  onBack: () => void;
}

const OwnerRegistrationForm: React.FC<OwnerRegistrationFormProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OwnerRegistrationData>({
    name: '',
    email: '',
    companyName: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registrationId = `pending_${Date.now()}`;
      const registrationData = {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'owner_registration'
      };

      await setDoc(doc(db, 'owner_registrations', registrationId), registrationData);

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'inscription a été envoyée. Un administrateur l'examinera bientôt.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        companyName: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OwnerRegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-gray-900">
            Inscription Propriétaire
          </CardTitle>
        </div>
        <p className="text-gray-600 text-sm">
          Créez votre compte propriétaire. Votre demande sera examinée par un administrateur.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nom complet
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Nom de l'entreprise
            </Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Nom de votre entreprise"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez brièvement votre activité..."
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </Button>

          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              onClick={onBack}
              className="text-sm"
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OwnerRegistrationForm;
