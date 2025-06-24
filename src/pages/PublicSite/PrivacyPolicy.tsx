
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEnglish ? 'Privacy Policy' : 'Politique de Confidentialité'}
        </h1>
        
        <div className="prose prose-lg max-w-none">
          {isEnglish ? (
            <>
              <h2>1. Data Collection</h2>
              <p>
                We collect personal data that you provide directly to us 
                when you use our services, particularly when creating an account, 
                requesting information or making contact.
              </p>

              <h2>2. Types of Data Collected</h2>
              <ul>
                <li>Identification data (surname, first name, email)</li>
                <li>Contact data (phone, address)</li>
                <li>Navigation data (cookies, logs)</li>
                <li>Geolocation data (if authorized)</li>
              </ul>

              <h2>3. Processing Purposes</h2>
              <p>Your personal data is processed to:</p>
              <ul>
                <li>Manage your account and customer relationship</li>
                <li>Respond to your information requests</li>
                <li>Improve our services</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>

              <h2>4. Legal Basis</h2>
              <p>
                The processing of your data is based on your consent, the execution 
                of a contract, compliance with a legal obligation or our legitimate interest.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                Your data is retained for the period necessary for the purposes 
                for which it was collected, in accordance with current regulations.
              </p>

              <h2>6. Your Rights</h2>
              <p>In accordance with GDPR, you have the following rights:</p>
              <ul>
                <li>Right to access your data</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to restriction of processing</li>
                <li>Right to portability</li>
                <li>Right to object</li>
              </ul>

              <h2>7. Contact</h2>
              <p>
                To exercise your rights or for any questions regarding this policy, 
                contact us at:<br />
                Email: privacy@neorent.fr<br />
                Address: [Postal address]
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
