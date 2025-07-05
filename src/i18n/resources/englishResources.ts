
import navigation from '../locales/en/navigation.json';
import common from '../locales/en/common.json';
import properties from '../locales/en/properties.json';
import contractForm from '../locales/en/contractForm.json';

export const englishResources = {
  translation: {
    ...navigation,
    ...common,
    ...properties,
    ...contractForm,
    // Specific words for property form
    propertyForm: {
      title: "Title",
      addProperty: "Add Property",
      editProperty: "Edit Property", 
      immobilien: "Real Estate",
      hinzufugen: "Add",
      adresse: "Address",
      flache: "Surface",
      miete: "Rent",
      gesamtzahlDerZimmer: "Total number of rooms",
      annuler: "Cancel",
      ajouterPropriete: "Add Property",
      propertyTypes: {
        appartement: "Apartment",
        studio: "Studio",
        maison: "House", 
        loft: "Loft",
        duplex: "Duplex"
      },
      locationTypes: {
        entier: "Entire",
        colocation: "Shared"
      },
      placeholders: {
        surface: "ex: 45 m²",
        rent: "€",
        title: "Property title"
      }
    },
    buttons: {
      cancel: "Cancel",
      save: "Save",
      add: "Add",
      edit: "Edit", 
      delete: "Delete",
      close: "Close"
    }
  }
};
