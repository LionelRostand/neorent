
import React from 'react';

export const ContactHero: React.FC = () => {
  return (
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
  );
};
