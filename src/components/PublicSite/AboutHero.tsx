
import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutHero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('publicSite.about.title')}
          </h1>
          <h2 className="text-2xl md:text-3xl text-green-600 font-semibold mb-6">
            {t('publicSite.about.subtitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('publicSite.about.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
