
import React, { useState } from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const PublicContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Ici vous pourrez ajouter la logique d'envoi du formulaire
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@neorent.fr',
      description: 'Écrivez-nous pour toute question'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      description: 'Du lundi au vendredi, 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '123 Rue de la Paix, 75001 Paris',
      description: 'Siège social'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Ven: 9h-18h',
      description: 'Support technique disponible'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Notre équipe est là pour répondre à toutes vos questions sur Neo Rent
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <info.icon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {info.title}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {info.content}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
            <Card>
              <CardHeader>
                <CardTitle>Comment commencer avec Neo Rent ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Créez votre compte gratuitement, ajoutez vos propriétés et commencez à gérer 
                  vos biens immobiliers en quelques minutes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quels sont les tarifs ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous proposons plusieurs formules adaptées à vos besoins, 
                  avec une version gratuite pour commencer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolument. Nous utilisons un chiffrement de niveau bancaire 
                  et nos serveurs sont hébergés en Europe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puis-je importer mes données existantes ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, nous proposons des outils d'import pour faciliter 
                  la migration de vos données existantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PublicContact;
