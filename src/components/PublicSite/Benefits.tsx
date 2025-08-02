
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Benefits: React.FC = () => {
  const { t } = useTranslation();

  // Utilisation des traductions i18n
  const benefits = t('publicSite.benefits.list', { returnObjects: true }) as string[];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('publicSite.benefits.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('publicSite.benefits.description')}
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                {t('publicSite.benefits.contactTitle')}
              </Button>
            </Link>
          </div>
          <div className="lg:pl-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Neo Rent Platform
                </h3>
                <p className="text-gray-600">
                  Experience the future of property management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
