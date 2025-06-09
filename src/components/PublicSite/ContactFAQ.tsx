
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ContactFAQ: React.FC = () => {
  const faqItems = [
    {
      question: 'Comment commencer avec Neo Rent ?',
      answer: 'Créez votre compte gratuitement, ajoutez vos propriétés et commencez à gérer vos biens immobiliers en quelques minutes.'
    },
    {
      question: 'Quels sont les tarifs ?',
      answer: 'Nous proposons plusieurs formules adaptées à vos besoins, avec une version gratuite pour commencer.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire et nos serveurs sont hébergés en Europe.'
    },
    {
      question: 'Puis-je importer mes données existantes ?',
      answer: 'Oui, nous proposons des outils d\'import pour faciliter la migration de vos données existantes.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement des réponses aux questions les plus courantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
