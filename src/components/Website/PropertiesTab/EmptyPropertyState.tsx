
import React from 'react';

interface EmptyPropertyStateProps {
  loadingProperties: boolean;
  onAddProperty: () => void;
}

export const EmptyPropertyState = ({
  loadingProperties,
  onAddProperty
}: EmptyPropertyStateProps) => {
  // Ne plus afficher l'état vide
  return null;
};
