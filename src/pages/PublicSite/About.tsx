
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

const PublicAbout = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Users,
      title: t('publicSite.about.values.clientProximity.title'),
      description: t('publicSite.about.values.clientProximity.description')
    },
    {
      icon: Target,
      title: t('publicSite.about.values.innovation.title'),
      description: t('publicSite.about.values.innovation.description')
    },
    {
      icon: Award,
      title: t('publicSite.about.values.excellence.title'),
      description: t('publicSite.about.values.excellence.description')
    },
    {
      icon: TrendingUp,
      title: t('publicSite.about.values.growth.title'),
      description: t('publicSite.about.values.growth.description')
    }
  ];

  const stats = [
    { number: "10,000+", label: t('publicSite.about.stats.managedProperties') },
    { number: "500+", label: t('publicSite.about.stats.satisfiedClients') },
    { number: "99.9%", label: t('publicSite.about.stats.availability') },
    { number: "24/7", label: t('publicSite.about.stats.support') }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('publicSite.about.title')}
              <span className="text-green-600 block">{t('publicSite.about.subtitle')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('publicSite.about.description')}
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
                {t('publicSite.about.story.title')}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('publicSite.about.story.paragraph1')}
                </p>
                <p>
                  {t('publicSite.about.story.paragraph2')}
                </p>
                <p>
                  {t('publicSite.about.story.paragraph3')}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('publicSite.about.stats.title')}</h3>
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
              {t('publicSite.about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('publicSite.about.values.subtitle')}
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
              {t('publicSite.about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('publicSite.about.team.subtitle')}
            </p>
          </div>
          
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('publicSite.about.team.dedication.title')}
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {t('publicSite.about.team.dedication.description')}
            </p>
          </div>
        </div>
      </section>

      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicAbout;
