import navigation from '../locales/en/navigation.json';
import common from '../locales/en/common.json';
import properties from '../locales/en/properties.json';
import contractForm from '../locales/en/contractForm.json';
import contracts from '../locales/en/contracts.json';
import  dashboard  from '../locales/en/dashboard.json';
import forecasting from '../locales/en/forecasting.json';
import  help from '../locatles/en/help.json';
import inspections  from '../locales/en/inspections.json';
import legal  from '../locales/en/legal.json';
import  maintenanceCommon from '../locales/en/maintenanceCommon.json';
import  maintenanceCosts from '../locales/en/maintenanceCosts.json';
import maintenanceHistory from '../locales/en/maintenanceHistory.json';
import maintenanceInterventions from '../locales/en/maintenanceInterventions.json';
import maintenanceResponsibilities from '../locales/en/maintenanceResponsibilities.json';
import messages from '../locales/en/messages.json';
import ownerSpace '../locales/en/ownerSpace.json';
import pages from '../locales/en/pages.json';
import profile from '../locales/en/profile.json';
import publicSite from '../locales/en/publicSite.json';
import quickActions  from '../locales/en/quickActions.json';
import rentManagement from '../locales/en/rentManagement.json';
import rentalCharges from '../locales/en/rentalCharges.json';
import roommateSpace from '../locales/en/roommateSpace.json';
import roommates from '../locales/en/roommates.json';
import settings from '../locales/en/settings.json';
import taxes from '../locales/en/taxes.json';
import tenantDocuments from '../locales/en/tenantDocuments.json';
import tenantHistory from '../locales/en/tenantHistory.json';
import tenantOverview from '../locales/en/tenantOverview.json';
import tenantPayments from '../locales/en/tenantPayments.json';
import tenantProfile from '../locales/en/tenantProfile.json';
import tenantSpace  from '../locales/en/tenantSpace.json';
import tenantUpload from '../locales/en/tenantUpload.json';
import tenants from '../locales/en/tenants.json';
import website from '../locales/en/website.json';


export const englishResources = {
  translation: {
    ...navigation,
    ...common,
    ...properties,
    ...contractForm,
    ...contracts,
...dashboard, 
...forecasting, 
...help, 
...inspections,  
...legal,  
...maintenanceCommon, 
...maintenanceCosts,
...maintenanceHistory, 
...maintenanceInterventions, 
...maintenanceResponsibilities, 
...messages,
...ownerSpace, 
...pages,
...profile, 
...publicSite, 
...quickActions,  
...rentManagement, 
...rentalCharges,
...roommateSpace,
...roommates,
...settings,
...taxes,
...tenantDocuments, 
...tenantHistory,
...tenantOverview, 
...tenantPayments, 
...tenantProfile,
...tenantSpace,
...tenantUpload, 
...tenants',
...website',
    // General translations
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      view: "View",
      close: "Close",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      none: "None",
      all: "All",
      yes: "Yes",
      no: "No"
    },
    // Navigation
    navigation: {
      dashboard: "Dashboard",
      properties: "Properties",
      tenants: "Tenants",
      roommates: "Roommates",
      contracts: "Contracts",
      leases: "Leases",
      inspections: "Inspections",
      rentManagement: "Rent Management",
      rentalCharges: "Rental Charges",
      forecasting: "Forecasting",
      maintenance: "Maintenance",
      messages: "Messages",
      taxes: "Taxes",
      website: "Website",
      settings: "Settings",
      help: "Help",
      profile: "Profile",
      logout: "Logout"
    },
    // Profile and authentication
    profile: {
      owner: "Owner",
      tenant: "Tenant",
      roommate: "Roommate",
      administrator: "Administrator",
      logout: "Logout",
      editProfile: "Edit Profile",
      settings: "Profile Settings"
    },
    // Tenants
    tenants: {
      title: "Tenants",
      subtitle: "Manage your tenants and their information",
      addTenant: "Add Tenant",
      editTenant: "Edit Tenant",
      deleteTenant: "Delete Tenant",
      tenant: "Tenant",
      totalTenants: "Total Tenants",
      activeTenants: "Active Tenants",
      listTitle: "Tenants List",
      noTenants: "No Tenants",
      noTenantsDesc: "Start by adding your first tenant",
      confirmDelete: "Are you sure you want to delete this tenant?",
      fields: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        property: "Property",
        rentAmount: "Rent Amount",
        startDate: "Start Date",
        endDate: "End Date",
        status: "Status"
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        pending: "Pending"
      }
    },
    // Roommates
    roommates: {
      title: "Roommates",
      subtitle: "Manage roommates and their rooms",
      addRoommate: "Add Roommate",
      editRoommate: "Edit Roommate",
      deleteRoommate: "Delete Roommate",
      roommate: "Roommate",
      totalRoommates: "Total Roommates",
      activeRoommates: "Active Roommates",
      listTitle: "Roommates List",
      noRoommates: "No Roommates",
      noRoommatesDesc: "Start by adding your first roommate",
      room: "Room",
      roomNumber: "Room Number"
    },
    // Contracts
    contracts: {
      title: "Contracts",
      subtitle: "Manage your rental contracts",
      addContract: "Create Contract",
      editContract: "Edit Contract",
      deleteContract: "Delete Contract",
      viewContract: "View Contract",
      totalContracts: "Total Contracts",
      activeContracts: "Active Contracts",
      expiringSoon: "Expiring Soon",
      listTitle: "Contracts List",
      noContracts: "No Contracts",
      noContractsDesc: "Start by creating your first contract",
      fields: {
        tenant: "Tenant",
        property: "Property",
        startDate: "Start Date",
        endDate: "End Date",
        rentAmount: "Rent Amount",
        deposit: "Security Deposit",
        status: "Status"
      },
      status: {
        active: "Active",
        expired: "Expired",
        terminated: "Terminated",
        draft: "Draft"
      }
    },
    // Inspections
    inspections: {
      title: "Inspections",
      subtitle: "Schedule and manage property inspections",
      addInspection: "Schedule Inspection",
      editInspection: "Edit Inspection",
      deleteInspection: "Delete Inspection",
      totalInspections: "Total Inspections",
      completedInspections: "Completed Inspections",
      pendingInspections: "Pending Inspections",
      listTitle: "Inspections List",
      noInspections: "No Inspections",
      noInspectionsDesc: "Start by scheduling your first inspection",
      types: {
        entryInspection: "Move-in Inspection",
        exitInspection: "Move-out Inspection",
        periodicInspection: "Periodic Inspection",
        maintenanceInspection: "Maintenance Inspection"
      },
      fields: {
        type: "Inspection Type",
        property: "Property",
        tenant: "Tenant",
        date: "Date",
        time: "Time",
        status: "Status",
        notes: "Notes"
      },
      status: {
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled",
        inProgress: "In Progress"
      }
    },
    // Rent Management
    rentManagement: {
      title: "Rent Management",
      subtitle: "Track payments and manage rent",
      recordPayment: "Record Payment",
      sendReminder: "Send Reminder",
      totalRevenue: "Total Revenue",
      pendingPayments: "Pending Payments",
      overduePayments: "Overdue Payments",
      thisMonth: "This Month",
      paymentHistory: "Payment History",
      noPayments: "No Payments",
      noPaymentsDesc: "Payments will appear here once recorded",
      fields: {
        tenant: "Tenant",
        property: "Property",
        amount: "Amount",
        dueDate: "Due Date",
        paidDate: "Paid Date",
        status: "Status",
        method: "Payment Method"
      },
      status: {
        paid: "Paid",
        pending: "Pending",
        overdue: "Overdue",
        partial: "Partial"
      },
      methods: {
        cash: "Cash",
        bank: "Bank Transfer",
        check: "Check",
        online: "Online Payment"
      }
    },
    // Rental Charges
    rentalCharges: {
      title: "Rental Charges",
      subtitle: "Manage charges and provisions",
      addCharge: "Add Charge",
      editCharge: "Edit Charge",
      deleteCharge: "Delete Charge",
      totalCharges: "Total Charges",
      monthlyCharges: "Monthly Charges",
      yearlyCharges: "Yearly Charges",
      listTitle: "Charges List",
      noCharges: "No Charges",
      noChargesDesc: "Start by adding your first charge",
      types: {
        water: "Water",
        electricity: "Electricity",
        gas: "Gas",
        heating: "Heating",
        internet: "Internet",
        maintenance: "Maintenance",
        insurance: "Insurance",
        taxes: "Taxes",
        other: "Other"
      }
    },
    // Forecasting
    forecasting: {
      title: "Forecasting",
      subtitle: "Analyze trends and financial forecasts",
      monthlyForecast: "Monthly Forecast",
      yearlyForecast: "Yearly Forecast",
      revenueProjection: "Revenue Projection",
      expenseProjection: "Expense Projection",
      occupancyForecast: "Occupancy Forecast",
      noData: "No Data Available",
      noDataDesc: "Forecasts will appear when you have more history"
    },
    // Maintenance
    maintenance: {
      title: "Maintenance",
      subtitle: "Manage maintenance requests and interventions",
      addRequest: "New Request",
      editRequest: "Edit Request",
      deleteRequest: "Delete Request",
      totalRequests: "Total Requests",
      pendingRequests: "Pending Requests",
      completedRequests: "Completed Requests",
      urgentRequests: "Urgent Requests",
      listTitle: "Maintenance Requests",
      noRequests: "No Requests",
      noRequestsDesc: "Maintenance requests will appear here",
      priority: {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent"
      },
      status: {
        pending: "Pending",
        inProgress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled"
      },
      categories: {
        plumbing: "Plumbing",
        electrical: "Electrical",
        heating: "Heating",
        painting: "Painting",
        cleaning: "Cleaning",
        appliances: "Appliances",
        other: "Other"
      }
    },
    // Messages
    messages: {
      title: "Messages",
      subtitle: "Communicate with your tenants",
      compose: "Compose",
      reply: "Reply",
      forward: "Forward",
      delete: "Delete",
      inbox: "Inbox",
      sent: "Sent",
      drafts: "Drafts",
      noMessages: "No Messages",
      noMessagesDesc: "Your messages will appear here"
    },
    // Taxes
    taxes: {
      title: "Taxes",
      subtitle: "Manage your tax obligations",
      taxReturn: "Tax Return",
      deductions: "Deductions",
      totalTaxes: "Total Taxes",
      yearlyTaxes: "Yearly Taxes",
      taxableIncome: "Taxable Income",
      noTaxData: "No Tax Data",
      noTaxDataDesc: "Tax information will appear here"
    },
    // Website
    website: {
      title: "Website",
      subtitle: "Manage your website and listings",
      publishProperty: "Publish Property",
      editWebsite: "Edit Website",
      viewWebsite: "View Website",
      publishedProperties: "Published Properties",
      draftProperties: "Draft Properties",
      websiteSettings: "Website Settings",
      noPublishedProperties: "No Published Properties",
      websiteVisibility: "Website Visibility",
      visible: "Visible",
      feature: "Feature",
      featured: "Featured",
      propertyHidden: "Property hidden from website",
      propertyVisible: "Property visible on website",
      propertyUnfeatured: "Property removed from featured",
      propertyFeatured: "Property featured"
    },
    // Settings
    settings: {
      title: "Settings",
      subtitle: "Configure your application",
      profile: "Profile",
      notifications: "Notifications",
      preferences: "Preferences",
      security: "Security",
      billing: "Billing",
      language: "Language",
      theme: "Theme",
      saveSettings: "Save Settings"
    },
    // Help
    help: {
      title: "Help",
      subtitle: "Help center and support",
      faq: "FAQ",
      contact: "Contact Support",
      documentation: "Documentation",
      tutorials: "Tutorials",
      whatIsNew: "What's New"
    },
    // Owner Space
    ownerSpace: {
      title: "Owner Space",
      owner: "Owner",
      properties: "My Properties",
      tenants: "My Tenants",
      revenue: "My Revenue",
      maintenance: "Maintenance",
      documents: "Documents"
    },
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
      type: "Type",
      surface: "Surface",
      floor: "Floor",
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
      close: "Close",
      confirm: "Confirm",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort"
    }
  }
};
