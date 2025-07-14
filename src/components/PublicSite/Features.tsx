
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Users, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Building2,
      title: t('publicSite.features.propertyManagement.title'),
      description: t('publicSite.features.propertyManagement.description'),
    },
    {
      icon: Users,
      title: t('publicSite.features.tenantTracking.title'),
      description: t('publicSite.features.tenantTracking.description'),
    },
    {
      icon: Shield,
      title: t('publicSite.features.dataSecurity.title'),
      description: t('publicSite.features.dataSecurity.description'),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('publicSite.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('publicSite.features.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
