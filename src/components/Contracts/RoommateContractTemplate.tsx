
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoommateData {
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  moveInDate: string;
  primaryTenant: string;
}

interface PropertyData {
  address: string;
  type: string;
  surface: string;
  furnished: boolean;
}

interface RoommateContractTemplateProps {
  roommateData: RoommateData;
  propertyData: PropertyData;
  signatures?: {
    owner?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
    tenant?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
  };
}

const RoommateContractTemplate: React.FC<RoommateContractTemplateProps> = ({
  roommateData,
  propertyData,
  signatures
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">CONTRAT DE COLOCATION</h1>
        <h2 className="text-lg font-semibold">BAIL DE LOCATION MEUBLÉE</h2>
      </div>

      {/* Contract content */}
      <div className="space-y-6 text-sm leading-relaxed">
        <div>
          <h3 className="text-base font-bold mb-3">ENTRE LES SOUSSIGNÉS :</h3>
          <p><strong>Le Bailleur :</strong> {roommateData.primaryTenant}</p>
          <p><strong>Le Locataire :</strong> {roommateData.name}</p>
          <p><strong>Email :</strong> {roommateData.email}</p>
          <p><strong>Téléphone :</strong> {roommateData.phone}</p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-3">DÉSIGNATION DES LOCAUX :</h3>
          <p><strong>Adresse :</strong> {propertyData.address}</p>
          <p><strong>Type :</strong> {propertyData.type}</p>
          <p><strong>Surface :</strong> {propertyData.surface}</p>
          <p><strong>Chambre n° :</strong> {roommateData.roomNumber}</p>
          <p><strong>Meublé :</strong> {propertyData.furnished ? 'Oui' : 'Non'}</p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-3">CONDITIONS FINANCIÈRES :</h3>
          <p><strong>Loyer mensuel :</strong> {roommateData.rentAmount}€</p>
          <p><strong>Date d'entrée :</strong> {new Date(roommateData.moveInDate).toLocaleDateString('fr-FR')}</p>
          <p><strong>Paiement :</strong> Le loyer est payable mensuellement et d'avance avant le 5 de chaque mois.</p>
        </div>

        <div>
          <h3 className="text-base font-bold mb-3">CLAUSES PARTICULIÈRES :</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Le présent contrat est conclu pour une durée d'un an renouvelable.</li>
            <li>Un préavis d'un mois est requis pour la résiliation du contrat.</li>
            <li>Le locataire doit souscrire une assurance multirisque habitation.</li>
            <li>Les espaces communs doivent être entretenus conjointement avec les autres occupants.</li>
            <li>Le règlement intérieur de la colocation doit être respecté.</li>
            <li>Toute modification du contrat doit faire l'objet d'un avenant écrit.</li>
          </ul>
        </div>
      </div>

      {/* Signatures section */}
      {signatures && (
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <h3 className="text-lg font-bold mb-8 text-center">SIGNATURES</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Owner signature */}
            <div className="text-center">
              <h4 className="text-base font-semibold mb-4">Le Propriétaire</h4>
              {signatures.owner && (
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={signatures.owner.signatureDataUrl} 
                      alt="Signature du propriétaire" 
                      className="max-w-full h-24 mx-auto object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{signatures.owner.signerInfo.name}</p>
                    <p>Date et signature</p>
                  </div>
                </div>
              )}
              {!signatures.owner && (
                <div className="space-y-4">
                  <div className="border-b-2 border-gray-400 h-16 flex items-end">
                    <span className="text-xs text-gray-500 mb-1">Signature</span>
                  </div>
                  <p className="text-sm text-gray-600">Propriétaire<br/>Date et signature</p>
                </div>
              )}
            </div>

            {/* Tenant signature */}
            <div className="text-center">
              <h4 className="text-base font-semibold mb-4">Le Colocataire</h4>
              {signatures.tenant && (
                <div className="space-y-4">
                  <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={signatures.tenant.signatureDataUrl} 
                      alt="Signature du colocataire" 
                      className="max-w-full h-24 mx-auto object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{signatures.tenant.signerInfo.name}</p>
                    <p>Date et signature</p>
                  </div>
                </div>
              )}
              {!signatures.tenant && (
                <div className="space-y-4">
                  <div className="border-b-2 border-gray-400 h-16 flex items-end">
                    <span className="text-xs text-gray-500 mb-1">Signature</span>
                  </div>
                  <p className="text-sm text-gray-600">{roommateData.name}<br/>Date et signature</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-500 text-center print:hidden">
        <p>Ce document a été généré automatiquement par le système de gestion locative.</p>
      </div>
    </div>
  );
};

export default RoommateContractTemplate;
