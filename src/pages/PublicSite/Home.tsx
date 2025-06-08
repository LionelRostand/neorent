
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, TrendingUp, CheckCircle, Star } from 'lucide-react';

const PublicHome = () => {
  const features = [
    {
      icon: Building2,
      title: 'Gestion Immobilière',
      description: 'Gérez vos biens immobiliers en toute simplicité avec nos outils avancés.'
    },
    {
      icon: Users,
      title: 'Suivi des Locataires',
      description: 'Centralisation complète des informations locataires et colocataires.'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Vos données sont protégées avec les meilleurs standards de sécurité.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Suivez la performance de vos investissements immobiliers.'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Propriétaire immobilier',
      content: 'Neo Rent a révolutionné la gestion de mes biens. Interface intuitive et support excellent.',
      rating: 5
    },
    {
      name: 'Pierre Martin',
      role: 'Investisseur',
      content: 'La plateforme parfaite pour gérer plusieurs propriétés. Très satisfait du service.',
      rating: 5
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gérez vos biens immobiliers
              <span className="block text-blue-200">en toute simplicité</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Neo Rent vous accompagne dans la gestion complète de vos propriétés : 
              locataires, contrats, finances et bien plus encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Commencer gratuitement
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Découvrir nos fonctionnalités
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Neo Rent ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour optimiser la gestion de votre patrimoine immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simplifiez votre gestion immobilière
              </h2>
              <ul className="space-y-4">
                {[
                  'Suivi automatisé des loyers et charges',
                  'Gestion des contrats et états des lieux',
                  'Tableau de bord avec analytics avancées',
                  'Communication centralisée avec les locataires',
                  'Conformité fiscale automatique'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=400&fit=crop" 
                alt="Dashboard Neo Rent"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à optimiser votre gestion immobilière ?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez des centaines de propriétaires qui font confiance à Neo Rent
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Commencer maintenant
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PublicHome;
