
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ContactHero: React.FC = () => {
  const { t } = useTranslation();
  
  // État pour stocker les informations de contact depuis l'admin
  const [contactData, setContactData] = useState({
    title: 'Nous Contacter',
    subtitle: 'Parlons de vos projets immobiliers',
    address: '123 Rue de la République, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@immobilier.fr',
    hours: 'Lun-Ven: 9h-18h, Sam: 9h-12h'
  });

  // Charger les données depuis le localStorage si elles existent
  useEffect(() => {
    const savedContactData = localStorage.getItem('contactContent');
    if (savedContactData) {
      try {
        const parsedData = JSON.parse(savedContactData);
        setContactData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de contact:', error);
      }
    }
  }, []);

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {contactData.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {contactData.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
