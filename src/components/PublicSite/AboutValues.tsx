
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Lightbulb, Award, TrendingUp } from 'lucide-react';

const AboutValues: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Users,
      title: t('publicSite.about.values.clientProximity.title'),
      description: t('publicSite.about.values.clientProximity.description'),
    },
    {
      icon: Lightbulb,
      title: t('publicSite.about.values.innovation.title'),
      description: t('publicSite.about.values.innovation.description'),
    },
    {
      icon: Award,
      title: t('publicSite.about.values.excellence.title'),
      description: t('publicSite.about.values.excellence.description'),
    },
    {
      icon: TrendingUp,
      title: t('publicSite.about.values.growth.title'),
      description: t('publicSite.about.values.growth.description'),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('publicSite.about.values.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('publicSite.about.values.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
