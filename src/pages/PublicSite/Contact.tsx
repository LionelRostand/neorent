
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { ChatWidget } from '@/components/Chat/ChatWidget';
import { ContactHero } from '@/components/PublicSite/ContactHero';
import { ContactFormSection } from '@/components/PublicSite/ContactFormSection';
import { ContactInfo } from '@/components/PublicSite/ContactInfo';
import { ContactFAQ } from '@/components/PublicSite/ContactFAQ';

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

      <ContactFAQ />

      <ChatWidget />
    </PublicLayout>
  );
};

export default PublicContact;
