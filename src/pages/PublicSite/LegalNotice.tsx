
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const LegalNotice = () => {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2>Éditeur du site</h2>
          <p>
            <strong>Neo Rent</strong><br />
            Société par actions simplifiée<br />
            Capital social : 10 000 €<br />
            Siège social : [Adresse à compléter]<br />
            RCS : [Numéro à compléter]<br />
            SIRET : [Numéro à compléter]<br />
            Code APE : [Code à compléter]<br />
            TVA intracommunautaire : [Numéro à compléter]
          </p>

          <h2>Directeur de la publication</h2>
          <p>[Nom du directeur de publication]</p>

          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par :<br />
            [Nom de l'hébergeur]<br />
            [Adresse de l'hébergeur]<br />
            Téléphone : [Numéro de téléphone]
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale 
            sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
            reproduction sont réservés, y compris pour les documents téléchargeables 
            et les représentations iconographiques et photographiques.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les informations contenues sur ce site sont aussi précises que possible 
            et le site remis à jour à différentes périodes de l'année, mais peut 
            toutefois contenir des inexactitudes ou des omissions.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question concernant ce site, vous pouvez nous contacter à :<br />
            Email : contact@neorent.fr<br />
            Téléphone : +33 1 23 45 67 89
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LegalNotice;
