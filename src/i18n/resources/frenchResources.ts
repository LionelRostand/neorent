import navigation from '../locales/fr/navigation.json';
import common from '../locales/fr/common.json';
import properties from '../locales/fr/properties.json';
import contractForm from '../locales/en/contractForm.json';
import messages from '../locales/fr/messages.json';
import dashbord from '../locales/fr/dashbord.json';
import maintenanceInterventions from '../locales/fr/maintenanceInterventions.json';

export const frenchResources = {
  translation: {
    ...navigation,
    ...common,
    ...properties,
    ...contractForm,
    ...messages,
    ...maintenanceInterventions,
    // Traductions générales
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      view: "Voir",
      close: "Fermer",
      confirm: "Confirmer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      none: "Aucun",
      all: "Tous",
      yes: "Oui",
      no: "Non"
    },
    // Navigation
    navigation: {
      dashboard: "Tableau de bord",
      properties: "Propriétés",
      tenants: "Locataires",
      roommates: "Colocataires",
      contracts: "Contrats",
      leases: "Baux",
      inspections: "Inspections",
      rentManagement: "Gestion des loyers",
      rentalCharges: "Charges locatives",
      forecasting: "Prévisions",
      maintenance: "Maintenance",
      messages: "Messages",
      taxes: "Taxes",
      website: "Site web",
      settings: "Paramètres",
      help: "Aide",
      profile: "Profil",
      logout: "Déconnexion"
    },
    // Profile et authentification
    profile: {
      owner: "Propriétaire",
      tenant: "Locataire",
      roommate: "Colocataire",
      administrator: "Administrateur",
      logout: "Déconnexion",
      editProfile: "Modifier le profil",
      settings: "Paramètres du profil"
    },
    // Locataires
    tenants: {
      title: "Locataires",
      subtitle: "Gérez vos locataires et leurs informations",
      addTenant: "Ajouter un locataire",
      editTenant: "Modifier le locataire",
      deleteTenant: "Supprimer le locataire",
      tenant: "Locataire",
      totalTenants: "Total Locataires",
      activeTenants: "Locataires actifs",
      listTitle: "Liste des locataires",
      noTenants: "Aucun locataire",
      noTenantsDesc: "Commencez par ajouter votre premier locataire",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce locataire ?",
      fields: {
        name: "Nom",
        email: "Email",
        phone: "Téléphone",
        property: "Propriété",
        rentAmount: "Montant du loyer",
        startDate: "Date de début",
        endDate: "Date de fin",
        status: "Statut"
      },
      status: {
        active: "Actif",
        inactive: "Inactif",
        pending: "En attente"
      }
    },
    // Colocataires
    roommates: {
      title: "Colocataires",
      subtitle: "Gérez les colocataires et leurs chambres",
      addRoommate: "Ajouter un colocataire",
      editRoommate: "Modifier le colocataire",
      deleteRoommate: "Supprimer le colocataire",
      roommate: "Colocataire",
      totalRoommates: "Total Colocataires",
      activeRoommates: "Colocataires actifs",
      listTitle: "Liste des colocataires",
      noRoommates: "Aucun colocataire",
      noRoommatesDesc: "Commencez par ajouter votre premier colocataire",
      room: "Chambre",
      roomNumber: "Numéro de chambre"
    },
    // Contrats
    contracts: {
      title: "Contrats",
      subtitle: "Gérez vos contrats de location",
      addContract: "Créer un contrat",
      editContract: "Modifier le contrat",
      deleteContract: "Supprimer le contrat",
      viewContract: "Voir le contrat",
      totalContracts: "Total Contrats",
      activeContracts: "Contrats actifs",
      expiringSoon: "Expirant bientôt",
      listTitle: "Liste des contrats",
      noContracts: "Aucun contrat",
      noContractsDesc: "Commencez par créer votre premier contrat",
      fields: {
        tenant: "Locataire",
        property: "Propriété",
        startDate: "Date de début",
        endDate: "Date de fin",
        rentAmount: "Montant du loyer",
        deposit: "Dépôt de garantie",
        status: "Statut"
      },
      status: {
        active: "Actif",
        expired: "Expiré",
        terminated: "Résilié",
        draft: "Brouillon"
      }
    },
    // Inspections
    inspections: {
      title: "Inspections",
      subtitle: "Planifiez et gérez les inspections de vos propriétés",
      addInspection: "Programmer une inspection",
      editInspection: "Modifier l'inspection",
      deleteInspection: "Supprimer l'inspection",
      totalInspections: "Total Inspections",
      completedInspections: "Inspections terminées",
      pendingInspections: "Inspections en attente",
      listTitle: "Liste des inspections",
      noInspections: "Aucune inspection",
      noInspectionsDesc: "Commencez par programmer votre première inspection",
      types: {
        entryInspection: "État des lieux d'entrée",
        exitInspection: "État des lieux de sortie",
        periodicInspection: "Inspection périodique",
        maintenanceInspection: "Inspection de maintenance"
      },
      fields: {
        type: "Type d'inspection",
        property: "Propriété",
        tenant: "Locataire",
        date: "Date",
        time: "Heure",
        status: "Statut",
        notes: "Notes"
      },
      status: {
        scheduled: "Programmée",
        completed: "Terminée",
        cancelled: "Annulée",
        inProgress: "En cours"
      }
    },
    // Gestion des loyers
    rentManagement: {
      title: "Gestion des loyers",
      subtitle: "Suivez les paiements et gérez les loyers",
      recordPayment: "Enregistrer un paiement",
      sendReminder: "Envoyer un rappel",
      totalRevenue: "Revenus totaux",
      pendingPayments: "Paiements en attente",
      overduePayments: "Paiements en retard",
      thisMonth: "Ce mois-ci",
      paymentHistory: "Historique des paiements",
      noPayments: "Aucun paiement",
      noPaymentsDesc: "Les paiements apparaîtront ici une fois enregistrés",
      fields: {
        tenant: "Locataire",
        property: "Propriété",
        amount: "Montant",
        dueDate: "Date d'échéance",
        paidDate: "Date de paiement",
        status: "Statut",
        method: "Méthode de paiement"
      },
      status: {
        paid: "Payé",
        pending: "En attente",
        overdue: "En retard",
        partial: "Partiel"
      },
      methods: {
        cash: "Espèces",
        bank: "Virement bancaire",
        check: "Chèque",
        online: "Paiement en ligne"
      }
    },
    // Tableau de bord 
  dashboard: {
    "title": "Tableau de bord",
    "subtitle": "Vue d'ensemble de votre activité immobilière",
    "welcome": "Bienvenue",
    "quickActions": "Actions rapides",
    "recentActivity": "Activité récente",
    "overview": "Aperçu",
    "analytics": "Analyses",
    "statistics": "Statistiques",
    "totalProperties": "Total Propriétés",
    "totalPropertiesDesc": "propriétés enregistrées",
    "occupiedProperties": "Propriétés Occupées",
    "occupiedPropertiesDesc": "propriétés occupées",
    "vacantProperties": "Propriétés Vacantes",
    "vacantPropertiesDesc": "propriétés disponibles",
    "totalTenants": "Total Locataires",
    "totalTenantsDesc": "locataires actifs",
    "totalRoommates": "Total Colocataires",
    "totalRoommatesDesc": "colocataires actifs",
    "monthlyRevenue": "Revenus Mensuels",
    "monthlyRevenueDesc": "revenus totaux ce mois",
    "monthlyTurnover": "Chiffre d'Affaires Mensuel",
    "monthlyTurnoverDesc": "chiffre d'affaires ce mois",
    "pendingPayments": "Paiements en Attente",
    "pendingPaymentsDesc": "paiements dus",
    "recentPayments": "Paiements Récents",
    "upcomingPayments": "Paiements à Venir",
    "maintenanceRequests": "Demandes de Maintenance",
    "maintenanceRequestsDesc": "demandes en cours",
    "contractsExpiring": "Contrats Expirant",
    "contractsExpiringDesc": "contrats arrivant à échéance",
    "occupancyRate": "Taux d'Occupation",
    "occupancyRateDesc": "taux d'occupation global",
    "averageRent": "Loyer Moyen",
    "averageRentDesc": "loyer moyen par propriété",
    "collectionRate": "Taux de Recouvrement",
    "collectionRateDesc": "taux de paiement des loyers",
    "viewAll": "Voir tout",
    "addProperty": "Ajouter Propriété",
    "addTenant": "Ajouter Locataire",
    "addRoommate": "Ajouter Colocataire",
    "recordPayment": "Enregistrer Paiement",
    "scheduleInspection": "Programmer Inspection",
    "sendMessage": "Envoyer Message",
    "generateReport": "Générer Rapport",
    "managedProperties": "Propriétés Gérées",
    "newThisMonth": "nouveaux ce mois",
    "activeTenants": "Locataires Actifs",
    "averageYield": "Rendement Moyen",
    "vsQuarter": "vs trimestre",
    "vsLastMonth": "vs mois dernier",
    "vsLastMonthShort": "vs mois dernier",
    "vsQuarterShort": "vs trimestre",
    "occupancyGrade": "Taux d'occupation",
    "importantAlerts": "Alertes Importantes",
    "lateRent": "Loyer en Retard",
    "late": "en retard",
    "expiringLease": "Bail Expirant",
    "days": "jours",
    "urgentInspection": "Inspection Urgente",
    "urgent": "urgent",
    "noRecentActivity": "Aucune activité récente",
    "rentReceived": "Loyer reçu",
    "timeAgo": {
      "weeks": "il y a quelques semaines"
    },
    "latePayment": "Paiement en retard",
    "rentalRevenue": "Revenus Locatifs"
  },
    // Charges locatives
    rentalCharges: {
      title: "Charges locatives",
      subtitle: "Gérez les charges et provisions",
      addCharge: "Ajouter une charge",
      editCharge: "Modifier la charge",
      deleteCharge: "Supprimer la charge",
      totalCharges: "Total Charges",
      monthlyCharges: "Charges mensuelles",
      yearlyCharges: "Charges annuelles",
      listTitle: "Liste des charges",
      noCharges: "Aucune charge",
      noChargesDesc: "Commencez par ajouter votre première charge",
      types: {
        water: "Eau",
        electricity: "Électricité",
        gas: "Gaz",
        heating: "Chauffage",
        internet: "Internet",
        maintenance: "Maintenance",
        insurance: "Assurance",
        taxes: "Taxes",
        other: "Autres"
      }
    },
    // Prévisions
    forecasting: {
      title: "Prévisions",
      subtitle: "Analysez les tendances et prévisions financières",
      monthlyForecast: "Prévisions mensuelles",
      yearlyForecast: "Prévisions annuelles",
      revenueProjection: "Projection des revenus",
      expenseProjection: "Projection des dépenses",
      occupancyForecast: "Prévision d'occupation",
      noData: "Aucune donnée disponible",
      noDataDesc: "Les prévisions apparaîtront quand vous aurez plus d'historique"
    },
    // Maintenance
    maintenance: {
      title: "Maintenance",
      subtitle: "Gérez les demandes et interventions de maintenance",
      addRequest: "Nouvelle demande",
      editRequest: "Modifier la demande",
      deleteRequest: "Supprimer la demande",
      totalRequests: "Total Demandes",
      pendingRequests: "Demandes en attente",
      completedRequests: "Demandes terminées",
      urgentRequests: "Demandes urgentes",
      listTitle: "Demandes de maintenance",
      noRequests: "Aucune demande",
      noRequestsDesc: "Les demandes de maintenance apparaîtront ici",
      priority: {
        low: "Faible",
        medium: "Moyenne",
        high: "Élevée",
        urgent: "Urgente"
      },
      status: {
        pending: "En attente",
        inProgress: "En cours",
        completed: "Terminée",
        cancelled: "Annulée"
      },
      categories: {
        plumbing: "Plomberie",
        electrical: "Électricité",
        heating: "Chauffage",
        painting: "Peinture",
        cleaning: "Nettoyage",
        appliances: "Électroménager",
        other: "Autres"
      }
    },
    // Messages
    messages: {
      title: "Messages",
      subtitle: "Communiquez avec vos locataires",
      compose: "Nouveau message",
      reply: "Répondre",
      forward: "Transférer",
      delete: "Supprimer",
      inbox: "Boîte de réception",
      sent: "Messages envoyés",
      drafts: "Brouillons",
      noMessages: "Aucun message",
      noMessagesDesc: "Vos messages apparaîtront ici"
    },
    // Taxes
    taxes: {
      title: "Taxes",
      subtitle: "Gérez vos obligations fiscales",
      taxReturn: "Déclaration fiscale",
      deductions: "Déductions",
      totalTaxes: "Total Taxes",
      yearlyTaxes: "Taxes annuelles",
      taxableIncome: "Revenus imposables",
      noTaxData: "Aucune donnée fiscale",
      noTaxDataDesc: "Les informations fiscales apparaîtront ici"
    },
    // Site web
    website: {
      title: "Site web",
      subtitle: "Gérez votre site web et vos annonces",
      publishProperty: "Publier une propriété",
      editWebsite: "Modifier le site",
      viewWebsite: "Voir le site",
      publishedProperties: "Propriétés publiées",
      draftProperties: "Propriétés en brouillon",
      websiteSettings: "Paramètres du site",
      noPublishedProperties: "Aucune propriété publiée",
      websiteVisibility: "Visibilité site web",
      visible: "Visible",
      feature: "Mettre en avant",
      featured: "Mise en avant",
      propertyHidden: "Propriété masquée du site web",
      propertyVisible: "Propriété visible sur le site web",
      propertyUnfeatured: "Propriété retirée de la mise en avant",
      propertyFeatured: "Propriété mise en avant"
    },
    // Paramètres
    settings: {
      title: "Paramètres",
      subtitle: "Configurez votre application",
      profile: "Profil",
      notifications: "Notifications",
      preferences: "Préférences",
      security: "Sécurité",
      billing: "Facturation",
      language: "Langue",
      theme: "Thème",
      saveSettings: "Enregistrer les paramètres"
    },
    // Aide
    help: {
      title: "Aide",
      subtitle: "Centre d'aide et support",
      faq: "Questions fréquentes",
      contact: "Contacter le support",
      documentation: "Documentation",
      tutorials: "Tutoriels",
      whatIsNew: "Nouveautés"
    },
    // Espace propriétaire
    ownerSpace: {
      title: "Espace Propriétaire",
      owner: "Propriétaire",
      properties: "Mes propriétés",
      tenants: "Mes locataires",
      revenue: "Mes revenus",
      maintenance: "Maintenance",
      documents: "Documents"
    },
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
      type: "Type",
      surface: "Surface",
      floor: "Étage",
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
      close: "Fermer",
      confirm: "Confirmer",
      view: "Voir",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier"
    }
  }
};
