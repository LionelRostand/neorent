
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import LoginForm from '@/components/PublicSite/LoginForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';

const PublicHome = () => {
  const features = [
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées avec les dernières technologies de sécurité.'
    },
    {
      icon: Clock,
      title: 'Disponible 24/7',
      description: 'Accédez à votre plateforme à tout moment, où que vous soyez.'
    },
    {
      icon: Users,
      title: 'Support expert',
      description: 'Notre équipe d\'experts est là pour vous accompagner.'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section avec Login */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bienvenue sur Neo Rent
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                La plateforme de gestion immobilière nouvelle génération. 
                Simplifiez la gestion de vos biens et maximisez vos revenus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                  Découvrir nos services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700">
                  En savoir plus
                </Button>
              </div>
            </div>
            
            {/* Formulaire de connexion */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Neo Rent ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour optimiser la gestion de vos biens immobiliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de propriétaires qui font confiance à Neo Rent 
            pour gérer leurs biens immobiliers.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Commencer maintenant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PublicHome;
