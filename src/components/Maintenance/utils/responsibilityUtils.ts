
export const determineResponsibility = (category: string): string => {
  const proprietaireCategories = ['Plomberie', 'Électricité', 'Chauffage', 'Structure'];
  return proprietaireCategories.includes(category) ? 'Propriétaire' : 'Locataire';
};
