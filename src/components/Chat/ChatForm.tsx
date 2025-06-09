
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ChatFormData {
  name: string;
  email: string;
}

interface ChatFormProps {
  onSubmit: (formData: ChatFormData) => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ChatFormData>({
    name: '',
    email: ''
  });

  console.log('ChatForm: Rendu du formulaire avec données:', formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ChatForm: Soumission du formulaire avec:', formData);
    
    if (formData.name.trim() && formData.email.trim()) {
      console.log('ChatForm: Formulaire valide, appel de onSubmit');
      onSubmit(formData);
    } else {
      console.log('ChatForm: Formulaire invalide - nom ou email manquant');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    console.log('ChatForm: Changement de champ:', e.target.name, '=', e.target.value);
    setFormData(newFormData);
  };

  return (
    <div className="p-4 flex-1 flex flex-col justify-center">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Démarrer une conversation</h3>
        <p className="text-sm text-gray-600">
          Remplissez le formulaire pour commencer à chatter avec notre équipe
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
            className="mt-1"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={!formData.name.trim() || !formData.email.trim()}
        >
          Démarrer le chat
        </Button>
      </form>
    </div>
  );
};
