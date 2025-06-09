
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

const PublicAbout = () => {
  const values = [
    {
      icon: Users,
      title: "Proximité Client",
      description: "Nous plaçons nos clients au cœur de notre stratégie et développons des solutions sur mesure."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Nous innovons constamment pour offrir les meilleures technologies du marché."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque aspect de nos services et produits."
    },
    {
      icon: TrendingUp,
      title: "Croissance",
      description: "Nous accompagnons la croissance de nos clients avec des solutions évolutives."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Biens Gérés" },
    { number: "500+", label: "Clients Satisfaits" },
    { number: "99.9%", label: "Disponibilité" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              À Propos de
              <span className="text-green-600 block">NeoRent</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Depuis notre création, nous nous engageons à révolutionner la gestion immobilière 
              avec des solutions innovantes et performantes.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fondée en 2020, NeoRent est née de la vision de simplifier et moderniser 
                  la gestion immobilière. Notre équipe d'experts a identifié les défis 
                  majeurs du secteur et a développé une solution complète.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers d'accompagner des centaines de professionnels 
                  de l'immobilier dans leur transformation numérique, en offrant des outils 
                  puissants et intuitifs.
                </p>
                <p>
                  Notre mission est de permettre à chaque acteur de l'immobilier de se concentrer 
                  sur son cœur de métier en automatisant les tâches administratives.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nos Chiffres</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
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
              Les principes qui guident notre action quotidienne
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des experts passionnés au service de votre réussite
            </p>
          </div>
          
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Une Équipe Dédiée à Votre Succès
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Notre équipe multidisciplinaire combine expertise technique, connaissance 
              du marché immobilier et passion pour l'innovation. Nous travaillons chaque 
              jour pour vous offrir la meilleure expérience possible.
            </p>
          </div>
        </div>
      </section>

      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicAbout;
