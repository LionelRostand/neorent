
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactInfo: React.FC = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@neorent.fr',
      description: 'Écrivez-nous pour toute question'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      description: 'Du lundi au vendredi, 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '123 Rue de la Paix, 75001 Paris',
      description: 'Siège social'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Ven: 9h-18h',
      description: 'Support technique disponible'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Informations de contact
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
