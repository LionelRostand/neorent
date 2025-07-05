
import navigation from '../locales/de/navigation.json';
import common from '../locales/de/common.json';
import properties from '../locales/de/properties.json';
import contractForm from '../locales/en/contractForm.json';

export const germanResources = {
  translation: {
    ...navigation,
    ...common,
    ...properties,
    ...contractForm,
    // Mots spécifiques pour le formulaire de propriété
    propertyForm: {
      title: "Titel",
      addProperty: "Immobilie hinzufügen",
      editProperty: "Immobilie bearbeiten",
      immobilien: "Immobilien",
      hinzufugen: "Hinzufügen", 
      adresse: "Adresse",
      flache: "Fläche",
      miete: "Miete",
      gesamtzahlDerZimmer: "Gesamtzahl der Zimmer",
      annuler: "Abbrechen",
      ajouterPropriete: "Immobilie hinzufügen",
      propertyTypes: {
        appartement: "Wohnung",
        studio: "Studio",
        maison: "Haus",
        loft: "Loft", 
        duplex: "Duplex"
      },
      locationTypes: {
        entier: "Ganz",
        colocation: "Wohngemeinschaft"
      },
      placeholders: {
        surface: "z.B.: 45 m²",
        rent: "€",
        title: "Immobilientitel"
      }
    },
    buttons: {
      cancel: "Abbrechen",
      save: "Speichern",
      add: "Hinzufügen",
      edit: "Bearbeiten",
      delete: "Löschen", 
      close: "Schließen"
    }
  }
};
