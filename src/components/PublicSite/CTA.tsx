
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('publicSite.cta.title')}
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
          {t('publicSite.cta.description')}
        </p>
        <Link to="/login">
          <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            {t('publicSite.cta.startNow')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;
