
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ContactHero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('publicSite.contact.hero.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('publicSite.contact.hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};
