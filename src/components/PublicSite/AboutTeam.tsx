
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const AboutTeam: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('publicSite.about.team.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('publicSite.about.team.subtitle')}
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('publicSite.about.team.dedication.title')}
            </h3>
            <p className="text-lg text-gray-600">
              {t('publicSite.about.team.dedication.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
