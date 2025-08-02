
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  // État pour stocker les données de la page d'accueil depuis l'admin
  const [homeData, setHomeData] = useState({
    title: t('publicSite.hero.title'),
    subtitle: t('publicSite.hero.subtitle'),
    description: t('publicSite.hero.description')
  });

  // Charger les données depuis le localStorage si elles existent
  useEffect(() => {
    const savedHomeData = localStorage.getItem('homeContent');
    if (savedHomeData) {
      try {
        const parsedData = JSON.parse(savedHomeData);
        setHomeData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de la page d\'accueil:', error);
      }
    } else {
      // Si pas de données sauvegardées, utiliser les traductions par défaut
      setHomeData({
        title: t('publicSite.hero.title'),
        subtitle: t('publicSite.hero.subtitle'),
        description: t('publicSite.hero.description')
      });
    }
  }, [t]);

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {homeData.title}{' '}
            <span className="text-green-600">{homeData.subtitle}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {homeData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 text-base">
                {t('publicSite.hero.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
