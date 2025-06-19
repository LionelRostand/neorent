
import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutStats: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    { number: '1000+', label: t('publicSite.about.stats.managedProperties') },
    { number: '500+', label: t('publicSite.about.stats.satisfiedClients') },
    { number: '99.9%', label: t('publicSite.about.stats.availability') },
    { number: '24/7', label: t('publicSite.about.stats.support') },
  ];

  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('publicSite.about.stats.title')}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-green-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
