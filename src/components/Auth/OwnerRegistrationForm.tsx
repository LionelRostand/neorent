
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OwnerRegistrationFormProps {
  onSuccess: () => void;
}

const OwnerRegistrationForm: React.FC<OwnerRegistrationFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestId = `owner_request_${Date.now()}`;
      const registrationRequest = {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'owner_registration'
      };

      await setDoc(doc(db, 'owner_registration_requests', requestId), registrationRequest);
      
      toast({
        title: t('publicSite.ownerRegistration.requestSent'),
        description: t('publicSite.ownerRegistration.requestSentDescription'),
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        message: ''
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting registration request:', error);
      toast({
        title: t('common.error'),
        description: t('publicSite.ownerRegistration.submitError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('publicSite.ownerRegistration.fullName')} *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('publicSite.ownerRegistration.email')} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('publicSite.ownerRegistration.phone')}</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">{t('publicSite.ownerRegistration.company')}</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('publicSite.ownerRegistration.address')}</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t('publicSite.ownerRegistration.messageOptional')}</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('publicSite.ownerRegistration.messagePlaceholder')}
          disabled={isLoading}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>{t('publicSite.ownerRegistration.importantInfo')}:</strong> {t('publicSite.ownerRegistration.importantInfoText')}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('publicSite.ownerRegistration.sending') : t('publicSite.ownerRegistration.sendRequest')}
      </Button>
    </form>
  );
};

export default OwnerRegistrationForm;
