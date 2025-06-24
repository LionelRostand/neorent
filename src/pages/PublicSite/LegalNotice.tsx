
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const LegalNotice = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEnglish ? 'Legal Notice' : 'Mentions Légales'}
        </h1>
        
        <div className="prose prose-lg max-w-none">
          {isEnglish ? (
            <>
              <h2>Website Publisher</h2>
              <p>
                <strong>Neo Rent</strong><br />
                Simplified joint-stock company<br />
                Share capital: €10,000<br />
                Registered office: [Address to be completed]<br />
                RCS: [Number to be completed]<br />
                SIRET: [Number to be completed]<br />
                APE Code: [Code to be completed]<br />
                Intra-community VAT: [Number to be completed]
              </p>

              <h2>Publication Director</h2>
              <p>[Name of publication director]</p>

              <h2>Hosting</h2>
              <p>
                This site is hosted by:<br />
                [Hosting provider name]<br />
                [Hosting provider address]<br />
                Phone: [Phone number]
              </p>

              <h2>Intellectual Property</h2>
              <p>
                This entire website is subject to French and international 
                legislation on copyright and intellectual property. All rights 
                of reproduction are reserved, including for downloadable documents 
                and iconographic and photographic representations.
              </p>

              <h2>Liability</h2>
              <p>
                The information contained on this site is as accurate as possible 
                and the site is updated at different times of the year, but may 
                however contain inaccuracies or omissions.
              </p>

              <h2>Contact</h2>
              <p>
                For any questions concerning this site, you can contact us at:<br />
                Email: contact@neorent.fr<br />
                Phone: +33 1 23 45 67 89
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default LegalNotice;
