// Configuration des charges de copropriété par appartement
export interface PropertyChargeConfig {
  propertyId: string;
  propertyName: string;
  quarterlyCharges: {
    maintenance: number;    // Charges de maintenance trimestrielles
    insurance: number;      // Assurance trimestrielle
    garbage: number;        // Collecte des ordures trimestrielle
    heating?: number;       // Chauffage (si géré par copropriété)
    water?: number;         // Eau (si géré par copropriété)
  };
  managedByCopropriete: string[]; // Liste des charges gérées par la copropriété
}

// Configuration des charges par appartement
export const PROPERTY_CHARGES_CONFIG: Record<string, PropertyChargeConfig> = {
  'appartement-13': {
    propertyId: 'appartement-13',
    propertyName: 'Appartement 13 - Colocation',
    quarterlyCharges: {
      maintenance: 0,      // Non géré par copropriété
      insurance: 0,        // Non géré par copropriété
      garbage: 300,        // Collecte des ordures - 100€/mois × 3 mois
      heating: 450,        // Chauffage - 150€/mois × 3 mois
      water: 250,          // Eau - 83.33€/mois × 3 mois
    },
    managedByCopropriete: ['heating', 'garbage', 'water'] // Total: 1000€/trimestre
  },
  // Ajouter d'autres appartements ici
  'appartement-12': {
    propertyId: 'appartement-12',
    propertyName: 'Appartement 12',
    quarterlyCharges: {
      maintenance: 120,
      insurance: 60,
      garbage: 45,
    },
    managedByCopropriete: ['maintenance', 'insurance', 'garbage']
  }
};

// Fonction pour obtenir la configuration des charges d'un appartement
export const getPropertyChargesConfig = (propertyName: string): PropertyChargeConfig | null => {
  // Recherche par nom exact
  const configByName = Object.values(PROPERTY_CHARGES_CONFIG).find(
    config => config.propertyName === propertyName
  );
  
  if (configByName) return configByName;
  
  // Recherche par correspondance partielle (pour "Appartement 13")
  const configByPartialMatch = Object.values(PROPERTY_CHARGES_CONFIG).find(
    config => propertyName.includes('13') && config.propertyName.includes('13')
  );
  
  return configByPartialMatch || null;
};

// Fonction pour calculer les charges mensuelles à partir des charges trimestrielles
export const getMonthlyChargesFromQuarterly = (quarterlyCharges: PropertyChargeConfig['quarterlyCharges']) => {
  const monthlyCharges: Record<string, number> = {};
  
  Object.entries(quarterlyCharges).forEach(([key, value]) => {
    if (value) {
      monthlyCharges[key] = Math.round((value / 3) * 100) / 100; // Arrondi à 2 décimales
    }
  });
  
  return monthlyCharges;
};

// Fonction pour vérifier si une charge est gérée par la copropriété
export const isChargeManagedbyCopropriete = (propertyName: string, chargeType: string): boolean => {
  const config = getPropertyChargesConfig(propertyName);
  return config?.managedByCopropriete.includes(chargeType) || false;
};