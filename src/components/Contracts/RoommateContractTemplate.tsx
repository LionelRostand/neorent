
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Home, User, Euro, FileText } from 'lucide-react';

interface RoommateContractProps {
  roommateData: {
    name: string;
    email: string;
    phone: string;
    property: string;
    roomNumber: string;
    rentAmount: string;
    moveInDate: string;
    primaryTenant: string;
  };
  propertyData?: {
    address: string;
    type: string;
    surface: string;
    furnished: boolean;
  };
}

const RoommateContractTemplate: React.FC<RoommateContractProps> = ({ 
  roommateData, 
  propertyData 
}) => {
  const contractDate = new Date().toLocaleDateString('fr-FR');
  const moveInDate = new Date(roommateData.moveInDate).toLocaleDateString('fr-FR');
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* En-tête du contrat */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          CONTRAT DE LOCATION/COLOCATION
        </h1>
        <p className="text-lg text-gray-700">LOGEMENT MEUBLÉ</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Contrat établi le: {contractDate}</p>
        </div>
      </div>

      {/* Section 1 - Parties contractantes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            1. LES PARTIES CONTRACTANTES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">LE BAILLEUR/LOCATAIRE PRINCIPAL:</h4>
            <p className="text-gray-700">{roommateData.primaryTenant}</p>
            <p className="text-sm text-gray-600">Adresse: {propertyData?.address || roommateData.property}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">LE COLOCATAIRE:</h4>
            <p className="text-gray-700">{roommateData.name}</p>
            <p className="text-sm text-gray-600">Email: {roommateData.email}</p>
            <p className="text-sm text-gray-600">Téléphone: {roommateData.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 - Désignation du logement */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            2. DÉSIGNATION DU LOGEMENT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Adresse:</span>
              <p className="text-gray-700">{propertyData?.address || roommateData.property}</p>
            </div>
            <div>
              <span className="font-medium">Chambre n°:</span>
              <p className="text-gray-700">{roommateData.roomNumber}</p>
            </div>
            <div>
              <span className="font-medium">Type de logement:</span>
              <p className="text-gray-700">{propertyData?.type || 'Colocation'}</p>
            </div>
            <div>
              <span className="font-medium">Surface:</span>
              <p className="text-gray-700">{propertyData?.surface || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <span className="font-medium">Équipements et mobilier:</span>
            <div className="mt-2 flex gap-2">
              <Badge variant={propertyData?.furnished ? "default" : "secondary"}>
                {propertyData?.furnished ? "Meublé" : "Non meublé"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 - Durée de la location */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            3. DURÉE DE LA LOCATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Date d'entrée en jouissance:</span>
              <p className="text-gray-700">{moveInDate}</p>
            </div>
            <div>
              <span className="font-medium">Durée:</span>
              <p className="text-gray-700">Indéterminée (résiliable par préavis d'un mois)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4 - Conditions financières */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            4. CONDITIONS FINANCIÈRES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Loyer mensuel:</span>
              <p className="text-2xl font-bold text-blue-900">{roommateData.rentAmount}€</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Dépôt de garantie:</span>
              <p className="text-xl font-bold text-green-900">{roommateData.rentAmount}€</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>• Le loyer est payable mensuellement et d'avance</p>
            <p>• Échéance: le 1er de chaque mois</p>
            <p>• Le dépôt de garantie sera restitué dans les 2 mois suivant la restitution des clés</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5 - Obligations du colocataire */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. OBLIGATIONS DU COLOCATAIRE</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Payer le loyer et les charges aux échéances convenues</li>
            <li>• Occuper paisiblement les lieux et respecter le règlement de colocation</li>
            <li>• Maintenir en bon état la chambre et les parties communes</li>
            <li>• Souscrire une assurance multirisque habitation</li>
            <li>• Respecter le voisinage et ne pas troubler la tranquillité des lieux</li>
            <li>• Autoriser les visites pour travaux d'entretien après préavis</li>
            <li>• Signaler immédiatement toute dégradation ou dysfonctionnement</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 6 - Résiliation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. RÉSILIATION</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-3">
            Le présent contrat peut être résilié par chacune des parties moyennant un préavis d'un mois 
            donné par lettre recommandée avec accusé de réception.
          </p>
          <p className="text-sm text-gray-700">
            En cas de non-respect des obligations contractuelles, résiliation de plein droit après 
            mise en demeure restée sans effet pendant 15 jours.
          </p>
        </CardContent>
      </Card>

      {/* Signatures */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            SIGNATURES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <p className="font-medium mb-4">Le Locataire Principal</p>
              <div className="border-b border-gray-400 mb-2 h-16"></div>
              <p className="text-sm">{roommateData.primaryTenant}</p>
              <p className="text-sm text-gray-600">Date et signature</p>
            </div>
            <div className="text-center">
              <p className="font-medium mb-4">Le Colocataire</p>
              <div className="border-b border-gray-400 mb-2 h-16"></div>
              <p className="text-sm">{roommateData.name}</p>
              <p className="text-sm text-gray-600">Date et signature</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentions légales */}
      <div className="text-xs text-gray-500 mt-8 p-4 bg-gray-50 rounded">
        <p className="font-medium mb-2">MENTIONS LÉGALES:</p>
        <p>
          Le présent contrat est régi par la loi n° 89-462 du 6 juillet 1989 tendant à améliorer les rapports locatifs 
          et portant modification de la loi n° 86-1290 du 23 décembre 1986. En cas de litige, compétence exclusive 
          des tribunaux du lieu de situation de l'immeuble.
        </p>
      </div>
    </div>
  );
};

export default RoommateContractTemplate;
