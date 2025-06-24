
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Collecte des données</h2>
          <p>
            Nous collectons les données personnelles que vous nous fournissez directement 
            lorsque vous utilisez nos services, notamment lors de la création d'un compte, 
            de la demande d'informations ou de la prise de contact.
          </p>

          <h2>2. Types de données collectées</h2>
          <ul>
            <li>Données d'identification (nom, prénom, email)</li>
            <li>Données de contact (téléphone, adresse)</li>
            <li>Données de navigation (cookies, logs)</li>
            <li>Données de géolocalisation (si autorisée)</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <p>Vos données personnelles sont traitées pour :</p>
          <ul>
            <li>Gérer votre compte et votre relation client</li>
            <li>Répondre à vos demandes d'information</li>
            <li>Améliorer nos services</li>
            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
          </ul>

          <h2>4. Base légale</h2>
          <p>
            Le traitement de vos données repose sur votre consentement, l'exécution 
            d'un contrat, le respect d'une obligation légale ou notre intérêt légitime.
          </p>

          <h2>5. Conservation des données</h2>
          <p>
            Vos données sont conservées pendant la durée nécessaire aux finalités 
            pour lesquelles elles ont été collectées, conformément à la réglementation en vigueur.
          </p>

          <h2>6. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            Pour exercer vos droits ou pour toute question relative à cette politique, 
            contactez-nous à :<br />
            Email : privacy@neorent.fr<br />
            Adresse : [Adresse postale]
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
