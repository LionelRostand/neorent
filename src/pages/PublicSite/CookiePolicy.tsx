
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const CookiePolicy = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEnglish ? 'Cookie Policy' : 'Politique de Cookies'}
        </h1>
        
        <div className="prose prose-lg max-w-none">
          {isEnglish ? (
            <>
              <h2>What is a cookie?</h2>
              <p>
                A cookie is a small text file placed on your computer when 
                visiting a website. It allows your browser to be recognized 
                and certain information about you to be remembered.
              </p>

              <h2>Types of cookies used</h2>
              
              <h3>1. Necessary cookies</h3>
              <p>
                These cookies are essential for the website to function. They allow 
                navigation and use of basic functionalities.
              </p>

              <h3>2. Performance cookies</h3>
              <p>
                These cookies allow us to analyze website usage in order 
                to improve its performance and your user experience.
              </p>

              <h3>3. Functionality cookies</h3>
              <p>
                These cookies allow the site to remember your choices (language, region) 
                and provide enhanced and personalized features.
              </p>

              <h3>4. Advertising cookies</h3>
              <p>
                These cookies are used to display relevant advertisements 
                and limit the number of times you see an advertisement.
              </p>

              <h2>Cookie management</h2>
              <p>
                You can control and manage cookies in several ways:
              </p>
              <ul>
                <li>Via our cookie banner during your first visit</li>
                <li>By modifying your browser settings</li>
                <li>By using unsubscribe links in our emails</li>
              </ul>

              <h2>Third-party cookies</h2>
              <p>
                We use third-party services that may place their own cookies:
              </p>
              <ul>
                <li>Google Analytics (audience analysis)</li>
                <li>Google Maps (interactive maps)</li>
                <li>YouTube (embedded videos)</li>
              </ul>

              <h2>Retention period</h2>
              <p>
                The retention period for cookies varies according to their type:
              </p>
              <ul>
                <li>Session cookies: deleted when the browser is closed</li>
                <li>Persistent cookies: retained for up to 13 months maximum</li>
              </ul>

              <h2>Contact</h2>
              <p>
                For any questions regarding our cookie policy:<br />
                Email: cookies@neorent.fr<br />
                Phone: +33 1 23 45 67 89
              </p>
            </>
          ) : (
            <>
              <h2>Qu'est-ce qu'un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre ordinateur lors 
                de la visite d'un site web. Il permet de reconnaître votre navigateur 
                et de mémoriser certaines informations vous concernant.
              </p>

              <h2>Types de cookies utilisés</h2>
              
              <h3>1. Cookies nécessaires</h3>
              <p>
                Ces cookies sont indispensables au fonctionnement du site. Ils permettent 
                notamment la navigation et l'utilisation des fonctionnalités de base.
              </p>

              <h3>2. Cookies de performance</h3>
              <p>
                Ces cookies nous permettent d'analyser l'utilisation du site afin 
                d'améliorer ses performances et votre expérience utilisateur.
              </p>

              <h3>3. Cookies de fonctionnalité</h3>
              <p>
                Ces cookies permettent au site de mémoriser vos choix (langue, région) 
                et de fournir des fonctionnalités améliorées et personnalisées.
              </p>

              <h3>4. Cookies publicitaires</h3>
              <p>
                Ces cookies sont utilisés pour diffuser des publicités pertinentes 
                et limiter le nombre de fois où vous voyez une publicité.
              </p>

              <h2>Gestion des cookies</h2>
              <p>
                Vous pouvez contrôler et gérer les cookies de plusieurs façons :
              </p>
              <ul>
                <li>Via notre bandeau de cookies lors de votre première visite</li>
                <li>En modifiant les paramètres de votre navigateur</li>
                <li>En utilisant les liens de désinscription dans nos emails</li>
              </ul>

              <h2>Cookies tiers</h2>
              <p>
                Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :
              </p>
              <ul>
                <li>Google Analytics (analyse d'audience)</li>
                <li>Google Maps (cartes interactives)</li>
                <li>YouTube (vidéos intégrées)</li>
              </ul>

              <h2>Durée de conservation</h2>
              <p>
                La durée de conservation des cookies varie selon leur type :
              </p>
              <ul>
                <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                <li>Cookies persistants : conservés jusqu'à 13 mois maximum</li>
              </ul>

              <h2>Contact</h2>
              <p>
                Pour toute question concernant notre politique de cookies :<br />
                Email : cookies@neorent.fr<br />
                Téléphone : +33 1 23 45 67 89
              </p>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CookiePolicy;
