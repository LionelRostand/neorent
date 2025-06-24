
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';

const CookiePolicy = () => {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Cookies</h1>
        
        <div className="prose prose-lg max-w-none">
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
        </div>
      </div>
    </PublicLayout>
  );
};

export default CookiePolicy;
