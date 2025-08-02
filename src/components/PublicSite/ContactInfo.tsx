
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactInfo: React.FC = () => {
  const { t } = useTranslation();
  
  // État pour stocker les informations de contact depuis l'admin
  const [contactData, setContactData] = useState({
    title: t('public.contact.title'),
    subtitle: t('public.contact.subtitle'),
    address: '123 Rue de la République, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@immobilier.fr',
    hours: 'Lun-Ven: 9h-18h, Sam: 9h-12h'
  });

  // Charger les données depuis le localStorage si elles existent
  useEffect(() => {
    const savedContactData = localStorage.getItem('contactContent');
    if (savedContactData) {
      try {
        const parsedData = JSON.parse(savedContactData);
        setContactData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de contact:', error);
      }
    }
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: t('public.contact.email'),
      content: contactData.email,
      description: t('public.contact.emailDesc')
    },
    {
      icon: Phone,
      title: t('public.contact.phone'),
      content: contactData.phone,
      description: t('public.contact.phoneDesc')
    },
    {
      icon: MapPin,
      title: t('public.contact.address'),
      content: contactData.address,
      description: t('public.contact.addressDesc')
    },
    {
      icon: Clock,
      title: t('public.contact.hours'),
      content: contactData.hours,
      description: t('public.contact.hoursDesc')
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {t('public.contact.contactInfo')}
      </h2>
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <info.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {info.title}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {info.content}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {info.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
