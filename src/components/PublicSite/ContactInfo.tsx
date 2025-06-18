
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactInfo: React.FC = () => {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: Mail,
      title: t('publicSite.contact.info.email.title'),
      content: t('publicSite.contact.info.email.content'),
      description: t('publicSite.contact.info.email.description')
    },
    {
      icon: Phone,
      title: t('publicSite.contact.info.phone.title'),
      content: t('publicSite.contact.info.phone.content'),
      description: t('publicSite.contact.info.phone.description')
    },
    {
      icon: MapPin,
      title: t('publicSite.contact.info.address.title'),
      content: t('publicSite.contact.info.address.content'),
      description: t('publicSite.contact.info.address.description')
    },
    {
      icon: Clock,
      title: t('publicSite.contact.info.hours.title'),
      content: t('publicSite.contact.info.hours.content'),
      description: t('publicSite.contact.info.hours.description')
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {t('publicSite.contact.info.title')}
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
