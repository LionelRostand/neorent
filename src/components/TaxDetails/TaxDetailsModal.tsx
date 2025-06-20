
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Building2, DollarSign, Calendar, Calculator, FileText, X } from 'lucide-react';
import { RentFiscality } from '@/hooks/useFirebaseFiscality';
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

interface TaxDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tax: RentFiscality | null;
  onEdit: (taxId: string) => void;
  onDelete: (taxId: string) => void;
}

const TaxDetailsModal = ({ isOpen, onClose, tax, onEdit, onDelete }: TaxDetailsModalProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  if (!tax) return null;

  const handleEdit = () => {
    onEdit(tax.id);
    onClose();
  };

  const handleDelete = () => {
    onDelete(tax.id);
    setShowDeleteAlert(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'À déclarer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'À payer':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails de la Fiscalité
              </span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* En-tête avec statut */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{tax.title}</CardTitle>
                    <p className="text-sm text-gray-600">{tax.type}</p>
                  </div>
                  <Badge className={`${getStatusColor(tax.status)} border`}>
                    {tax.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Propriété
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium">{tax.property}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Montant
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium text-lg text-blue-600">{tax.amount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date d'échéance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium">{new Date(tax.dueDate).toLocaleDateString('fr-FR')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Année fiscale
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium">{tax.year}</p>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {tax.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700">{tax.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Dates de création et modification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tax.createdAt && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Créé le</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{new Date(tax.createdAt).toLocaleString('fr-FR')}</p>
                  </CardContent>
                </Card>
              )}

              {tax.updatedAt && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Modifié le</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{new Date(tax.updatedAt).toLocaleString('fr-FR')}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteAlert(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette fiscalité ? Cette action est irréversible.
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
    </>
  );
};

export default TaxDetailsModal;
