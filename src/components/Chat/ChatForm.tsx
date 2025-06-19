
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';
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
  const { t } = useTranslation();
  const { trackContactRequest } = useAnalyticsTracking();
  const [formData, setFormData] = useState<ChatFormData>({
    name: '',
    email: ''
  });

  console.log('ChatForm: Rendu du formulaire avec données:', formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ChatForm: Soumission du formulaire avec:', formData);
    
    if (formData.name.trim() && formData.email.trim()) {
      console.log('ChatForm: Formulaire valide, appel de onSubmit');
      
      // Tracker la demande de chat
      await trackContactRequest('chat_widget');
      
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
        <h3 className="text-lg font-semibold text-gray-900">{t('publicSite.chat.startConversation')}</h3>
        <p className="text-sm text-gray-600">
          {t('publicSite.chat.fillForm')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t('publicSite.chat.fullName')}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('publicSite.chat.namePlaceholder')}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">{t('publicSite.chat.email')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('publicSite.chat.emailPlaceholder')}
            required
            className="mt-1"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={!formData.name.trim() || !formData.email.trim()}
        >
          {t('publicSite.chat.startChat')}
        </Button>
      </form>
    </div>
  );
};
