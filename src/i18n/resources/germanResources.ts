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
    // Allgemeine Übersetzungen
    common: {
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
      add: "Hinzufügen",
      view: "Ansehen",
      close: "Schließen",
      confirm: "Bestätigen",
      back: "Zurück",
      next: "Weiter",
      previous: "Vorherige",
      search: "Suchen",
      filter: "Filtern",
      sort: "Sortieren",
      none: "Keine",
      all: "Alle",
      yes: "Ja",
      no: "Nein"
    },
    // Navigation
    navigation: {
      dashboard: "Dashboard",
      properties: "Immobilien",
      tenants: "Mieter",
      roommates: "Mitbewohner",
      contracts: "Verträge",
      leases: "Mietverträge",
      inspections: "Inspektionen",
      rentManagement: "Mietverwaltung",
      rentalCharges: "Nebenkosten",
      forecasting: "Prognosen",
      maintenance: "Wartung",
      messages: "Nachrichten",
      taxes: "Steuern",
      website: "Website",
      settings: "Einstellungen",
      help: "Hilfe",
      profile: "Profil",
      logout: "Abmelden"
    },
    // Profil und Authentifizierung
    profile: {
      owner: "Eigentümer",
      tenant: "Mieter",
      roommate: "Mitbewohner",
      administrator: "Administrator",
      logout: "Abmelden",
      editProfile: "Profil bearbeiten",
      settings: "Profileinstellungen"
    },
    // Mieter
    tenants: {
      title: "Mieter",
      subtitle: "Verwalten Sie Ihre Mieter und deren Informationen",
      addTenant: "Mieter hinzufügen",
      editTenant: "Mieter bearbeiten",
      deleteTenant: "Mieter löschen",
      tenant: "Mieter",
      totalTenants: "Gesamte Mieter",
      activeTenants: "Aktive Mieter",
      listTitle: "Mieterliste",
      noTenants: "Keine Mieter",
      noTenantsDesc: "Beginnen Sie mit Ihrem ersten Mieter",
      confirmDelete: "Sind Sie sicher, dass Sie diesen Mieter löschen möchten?",
      fields: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        property: "Immobilie",
        rentAmount: "Mietbetrag",
        startDate: "Startdatum",
        endDate: "Enddatum",
        status: "Status"
      },
      status: {
        active: "Aktiv",
        inactive: "Inaktiv",
        pending: "Ausstehend"
      }
    },
    // Mitbewohner
    roommates: {
      title: "Mitbewohner",
      subtitle: "Verwalten Sie Mitbewohner und deren Zimmer",
      addRoommate: "Mitbewohner hinzufügen",
      editRoommate: "Mitbewohner bearbeiten",
      deleteRoommate: "Mitbewohner löschen",
      roommate: "Mitbewohner",
      totalRoommates: "Gesamte Mitbewohner",
      activeRoommates: "Aktive Mitbewohner",
      listTitle: "Mitbewohnerliste",
      noRoommates: "Keine Mitbewohner",
      noRoommatesDesc: "Beginnen Sie mit Ihrem ersten Mitbewohner",
      room: "Zimmer",
      roomNumber: "Zimmernummer"
    },
    // Verträge
    contracts: {
      title: "Verträge",
      subtitle: "Verwalten Sie Ihre Mietverträge",
      addContract: "Vertrag erstellen",
      editContract: "Vertrag bearbeiten",
      deleteContract: "Vertrag löschen",
      viewContract: "Vertrag ansehen",
      totalContracts: "Gesamte Verträge",
      activeContracts: "Aktive Verträge",
      expiringSoon: "Läuft bald ab",
      listTitle: "Vertragsliste",
      noContracts: "Keine Verträge",
      noContractsDesc: "Beginnen Sie mit Ihrem ersten Vertrag",
      fields: {
        tenant: "Mieter",
        property: "Immobilie",
        startDate: "Startdatum",
        endDate: "Enddatum",
        rentAmount: "Mietbetrag",
        deposit: "Kaution",
        status: "Status"
      },
      status: {
        active: "Aktiv",
        expired: "Abgelaufen",
        terminated: "Gekündigt",
        draft: "Entwurf"
      }
    },
    // Inspektionen
    inspections: {
      title: "Inspektionen",
      subtitle: "Planen und verwalten Sie Immobilieninspektionen",
      addInspection: "Inspektion planen",
      editInspection: "Inspektion bearbeiten",
      deleteInspection: "Inspektion löschen",
      totalInspections: "Gesamte Inspektionen",
      completedInspections: "Abgeschlossene Inspektionen",
      pendingInspections: "Ausstehende Inspektionen",
      listTitle: "Inspektionsliste",
      noInspections: "Keine Inspektionen",
      noInspectionsDesc: "Beginnen Sie mit Ihrer ersten Inspektion",
      types: {
        entryInspection: "Einzugsinspektion",
        exitInspection: "Auszugsinspektion",
        periodicInspection: "Regelmäßige Inspektion",
        maintenanceInspection: "Wartungsinspektion"
      },
      fields: {
        type: "Inspektionstyp",
        property: "Immobilie",
        tenant: "Mieter",
        date: "Datum",
        time: "Uhrzeit",
        status: "Status",
        notes: "Notizen"
      },
      status: {
        scheduled: "Geplant",
        completed: "Abgeschlossen",
        cancelled: "Abgebrochen",
        inProgress: "In Bearbeitung"
      }
    },
    // Mietverwaltung
    rentManagement: {
      title: "Mietverwaltung",
      subtitle: "Verfolgen Sie Zahlungen und verwalten Sie Mieten",
      recordPayment: "Zahlung erfassen",
      sendReminder: "Erinnerung senden",
      totalRevenue: "Gesamteinnahmen",
      pendingPayments: "Ausstehende Zahlungen",
      overduePayments: "Überfällige Zahlungen",
      thisMonth: "Diesen Monat",
      paymentHistory: "Zahlungshistorie",
      noPayments: "Keine Zahlungen",
      noPaymentsDesc: "Zahlungen werden hier angezeigt, sobald sie erfasst sind",
      fields: {
        tenant: "Mieter",
        property: "Immobilie",
        amount: "Betrag",
        dueDate: "Fälligkeitsdatum",
        paidDate: "Zahlungsdatum",
        status: "Status",
        method: "Zahlungsmethode"
      },
      status: {
        paid: "Bezahlt",
        pending: "Ausstehend",
        overdue: "Überfällig",
        partial: "Teilweise"
      },
      methods: {
        cash: "Bargeld",
        bank: "Banküberweisung",
        check: "Scheck",
        online: "Online-Zahlung"
      }
    },
    // Nebenkosten
    rentalCharges: {
      title: "Nebenkosten",
      subtitle: "Verwalten Sie Kosten und Rücklagen",
      addCharge: "Kosten hinzufügen",
      editCharge: "Kosten bearbeiten",
      deleteCharge: "Kosten löschen",
      totalCharges: "Gesamtkosten",
      monthlyCharges: "Monatliche Kosten",
      yearlyCharges: "Jährliche Kosten",
      listTitle: "Kostenliste",
      noCharges: "Keine Kosten",
      noChargesDesc: "Beginnen Sie mit Ihren ersten Kosten",
      types: {
        water: "Wasser",
        electricity: "Strom",
        gas: "Gas",
        heating: "Heizung",
        internet: "Internet",
        maintenance: "Wartung",
        insurance: "Versicherung",
        taxes: "Steuern",
        other: "Sonstige"
      }
    },
    // Prognosen
    forecasting: {
      title: "Prognosen",
      subtitle: "Analysieren Sie Trends und Finanzprognosen",
      monthlyForecast: "Monatliche Prognose",
      yearlyForecast: "Jährliche Prognose",
      revenueProjection: "Umsatzprognose",
      expenseProjection: "Kostenprognose",
      occupancyForecast: "Belegungsprognose",
      noData: "Keine Daten verfügbar",
      noDataDesc: "Prognosen erscheinen, wenn Sie mehr Historie haben"
    },
    // Wartung
    maintenance: {
      title: "Wartung",
      subtitle: "Verwalten Sie Wartungsanfragen und Interventionen",
      addRequest: "Neue Anfrage",
      editRequest: "Anfrage bearbeiten",
      deleteRequest: "Anfrage löschen",
      totalRequests: "Gesamte Anfragen",
      pendingRequests: "Ausstehende Anfragen",
      completedRequests: "Abgeschlossene Anfragen",
      urgentRequests: "Dringende Anfragen",
      listTitle: "Wartungsanfragen",
      noRequests: "Keine Anfragen",
      noRequestsDesc: "Wartungsanfragen werden hier angezeigt",
      priority: {
        low: "Niedrig",
        medium: "Mittel",
        high: "Hoch",
        urgent: "Dringend"
      },
      status: {
        pending: "Ausstehend",
        inProgress: "In Bearbeitung",
        completed: "Abgeschlossen",
        cancelled: "Abgebrochen"
      },
      categories: {
        plumbing: "Sanitär",
        electrical: "Elektrik",
        heating: "Heizung",
        painting: "Malerei",
        cleaning: "Reinigung",
        appliances: "Geräte",
        other: "Sonstige"
      }
    },
    // Nachrichten
    messages: {
      title: "Nachrichten",
      subtitle: "Kommunizieren Sie mit Ihren Mietern",
      compose: "Verfassen",
      reply: "Antworten",
      forward: "Weiterleiten",
      delete: "Löschen",
      inbox: "Posteingang",
      sent: "Gesendet",
      drafts: "Entwürfe",
      noMessages: "Keine Nachrichten",
      noMessagesDesc: "Ihre Nachrichten werden hier angezeigt"
    },
    // Steuern
    taxes: {
      title: "Steuern",
      subtitle: "Verwalten Sie Ihre Steuerpflichten",
      taxReturn: "Steuererklärung",
      deductions: "Abzüge",
      totalTaxes: "Gesamtsteuern",
      yearlyTaxes: "Jährliche Steuern",
      taxableIncome: "Steuerpflichtiges Einkommen",
      noTaxData: "Keine Steuerdaten",
      noTaxDataDesc: "Steuerinformationen werden hier angezeigt"
    },
    // Website
    website: {
      title: "Website",
      subtitle: "Verwalten Sie Ihre Website und Anzeigen",
      publishProperty: "Immobilie veröffentlichen",
      editWebsite: "Website bearbeiten",
      viewWebsite: "Website ansehen",
      publishedProperties: "Veröffentlichte Immobilien",
      draftProperties: "Entwurf Immobilien",
      websiteSettings: "Website-Einstellungen",
      noPublishedProperties: "Keine veröffentlichten Immobilien",
      websiteVisibility: "Website-Sichtbarkeit",
      visible: "Sichtbar",
      feature: "Hervorheben",
      featured: "Hervorgehoben",
      propertyHidden: "Immobilie von Website ausgeblendet",
      propertyVisible: "Immobilie auf Website sichtbar",
      propertyUnfeatured: "Immobilie nicht mehr hervorgehoben",
      propertyFeatured: "Immobilie hervorgehoben"
    },
    // Einstellungen
    settings: {
      title: "Einstellungen",
      subtitle: "Konfigurieren Sie Ihre Anwendung",
      profile: "Profil",
      notifications: "Benachrichtigungen",
      preferences: "Einstellungen",
      security: "Sicherheit",
      billing: "Abrechnung",
      language: "Sprache",
      theme: "Thema",
      saveSettings: "Einstellungen speichern"
    },
    // Hilfe
    help: {
      title: "Hilfe",
      subtitle: "Hilfezentrum und Support",
      faq: "FAQ",
      contact: "Support kontaktieren",
      documentation: "Dokumentation",
      tutorials: "Tutorials",
      whatIsNew: "Was ist neu"
    },
    // Eigentümerbereich
    ownerSpace: {
      title: "Eigentümerbereich",
      owner: "Eigentümer",
      properties: "Meine Immobilien",
      tenants: "Meine Mieter",
      revenue: "Meine Einnahmen",
      maintenance: "Wartung",
      documents: "Dokumente"
    },
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
      type: "Typ",
      surface: "Fläche",
      floor: "Etage",
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
      close: "Schließen",
      confirm: "Bestätigen",
      view: "Ansehen",
      back: "Zurück",
      next: "Weiter",
      previous: "Vorherige",
      search: "Suchen",
      filter: "Filtern",
      sort: "Sortieren"
    }
  }
};
