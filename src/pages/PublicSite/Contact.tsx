
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { ContactHero } from '@/components/PublicSite/ContactHero';
import { ContactFormSection } from '@/components/PublicSite/ContactFormSection';
import { ContactInfo } from '@/components/PublicSite/ContactInfo';
import { ContactFAQ } from '@/components/PublicSite/ContactFAQ';
import { ContactMap } from '@/components/PublicSite/ContactMap';

const PublicContact = () => {
  return (
    <PublicLayout>
      <ContactHero />

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactFormSection />
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Localisation
            </h2>
            <p className="text-gray-600">
              Retrouvez-nous à Paris pour tous vos besoins en gestion immobilière
            </p>
          </div>
          <ContactMap />
        </div>
      </section>

      <ContactFAQ />

      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicContact;
