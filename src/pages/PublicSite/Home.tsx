
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicHome = () => {
  const features = [
    {
      icon: Building2,
      title: "Gestion de Propriétés",
      description: "Gérez efficacement vos biens immobiliers avec nos outils avancés"
    },
    {
      icon: Users,
      title: "Suivi des Locataires",
      description: "Maintenez une relation de qualité avec vos locataires"
    },
    {
      icon: Shield,
      title: "Sécurité des Données",
      description: "Vos données sont protégées avec les plus hauts standards de sécurité"
    }
  ];

  const benefits = [
    "Interface intuitive et facile à utiliser",
    "Support client réactif 7j/7",
    "Mises à jour automatiques incluses",
    "Formation et accompagnement personnalisé"
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestion Immobilière
              <span className="text-green-600 block">Simplifiée</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              NeoRent révolutionne la gestion de vos biens immobiliers avec une plateforme 
              complète, intuitive et performante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Commencer Gratuitement
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Nous Contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir NeoRent ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de NeoRent la solution de référence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Une Solution Complète pour Tous
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Que vous soyez propriétaire, gestionnaire ou locataire, NeoRent s'adapte 
                à vos besoins spécifiques.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contactez-nous</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-600 mr-3" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-600 mr-3" />
                  <span>contact@neorent.fr</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-3" />
                  <span>Paris, France</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Transformer Votre Gestion Immobilière ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui font confiance à NeoRent
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-50">
              Commencer Maintenant
            </Button>
          </Link>
        </div>
      </section>

      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicHome;
