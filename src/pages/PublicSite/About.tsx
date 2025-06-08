
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, Lightbulb } from 'lucide-react';

const PublicAbout = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'Simplifier la gestion immobilière grâce à des outils innovants et intuitifs.'
    },
    {
      icon: Users,
      title: 'Équipe',
      description: 'Une équipe passionnée d\'experts en immobilier et technologie.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous nous engageons à fournir un service de qualité supérieure.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous développons constamment de nouvelles fonctionnalités.'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À propos de Neo Rent
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nous révolutionnons la gestion immobilière avec des solutions technologiques innovantes
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Neo Rent est né de la frustration de gérer des biens immobiliers avec des outils obsolètes. 
                Nous avons créé une plateforme moderne qui répond aux besoins réels des propriétaires d'aujourd'hui.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Depuis notre création, nous avons aidé des centaines de propriétaires à optimiser leur gestion 
                immobilière et à maximiser leurs revenus locatifs.
              </p>
              <p className="text-lg text-gray-700">
                Notre vision est de devenir la référence en matière de gestion immobilière digitale, 
                en offrant des outils toujours plus performants et intuitifs.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=400&fit=crop" 
                alt="Équipe Neo Rent"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien dans le développement de Neo Rent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full bg-white">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neo Rent en Chiffres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Propriétaires</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2000+</div>
              <div className="text-gray-600">Biens gérés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support technique</div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PublicAbout;
