
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChargeData {
  id: string; // Changed from number to string for Firebase compatibility
  propertyName: string;
  propertyType: string;
  month: string;
  electricity: number;
  water: number;
  heating: number;
  maintenance: number;
  insurance: number;
  garbage: number;
  internet: number;
  total: number;
  tenant: string;
}

interface ChargeCardProps {
  charge: ChargeData;
  onDelete: (id: string) => void;
  onEdit: (charge: ChargeData) => void; // Nouvelle prop pour l'édition
}

const ChargeCard: React.FC<ChargeCardProps> = ({ charge, onDelete, onEdit }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(charge.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {charge.propertyName}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">{charge.propertyType}</Badge>
              <span className="text-sm text-gray-600">Locataire: {charge.tenant}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{charge.total.toFixed(2)}€</span>
            
            {/* Menu d'actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(charge)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Électricité</p>
            <p className="font-semibold">{charge.electricity.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Eau</p>
            <p className="font-semibold">{charge.water.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Chauffage</p>
            <p className="font-semibold">{charge.heating.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Entretien</p>
            <p className="font-semibold">{charge.maintenance.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Assurance</p>
            <p className="font-semibold">{charge.insurance.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Ordures</p>
            <p className="font-semibold">{charge.garbage.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Internet</p>
            <p className="font-semibold">{charge.internet.toFixed(2)}€</p>
          </div>
        </div>
      </CardContent>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer les charges de {charge.propertyName} pour ce mois ? 
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ChargeCard;
