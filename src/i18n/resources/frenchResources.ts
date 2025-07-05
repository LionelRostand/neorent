
import navigation from '../locales/fr/navigation.json';
import common from '../locales/fr/common.json';
import properties from '../locales/fr/properties.json';
import contractForm from '../locales/en/contractForm.json';
import messages from '../locales/fr/messages.json';
import maintenanceInterventions from '../locales/fr/maintenanceInterventions.json';

export const frenchResources = {
  translation: {
    ...navigation,
    ...common,
    ...properties,
    ...contractForm,
    ...messages,
    ...maintenanceInterventions,
    // Mots spécifiques pour le formulaire de propriété
    propertyForm: {
      title: "Titre",
      addProperty: "Ajouter propriété", 
      editProperty: "Modifier propriété",
      immobilien: "Immobilier",
      hinzufugen: "Ajouter",
      adresse: "Adresse",
      flache: "Surface",
      miete: "Loyer",
      gesamtzahlDerZimmer: "Nombre total de chambres",
      annuler: "Annuler",
      ajouterPropriete: "Ajouter propriété",
      propertyTypes: {
        appartement: "Appartement",
        studio: "Studio", 
        maison: "Maison",
        loft: "Loft",
        duplex: "Duplex"
      },
      locationTypes: {
        entier: "Entier",
        colocation: "Colocation"
      },
      placeholders: {
        surface: "ex: 45 m²",
        rent: "€",
        title: "Titre de la propriété"
      }
    },
    buttons: {
      cancel: "Annuler",
      save: "Enregistrer",
      add: "Ajouter",
      edit: "Modifier",
      delete: "Supprimer",
      close: "Fermer"
    }
  }
};
