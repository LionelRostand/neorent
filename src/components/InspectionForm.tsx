
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InspectionFormProps } from '@/types/inspection';
import { useInspectionForm } from '@/hooks/useInspectionForm';
import BasicInfoFields from '@/components/InspectionForm/BasicInfoFields';
import PropertyTenantFields from '@/components/InspectionForm/PropertyTenantFields';
import AdditionalInfoFields from '@/components/InspectionForm/AdditionalInfoFields';

const InspectionForm = ({ onClose, onSubmit }: InspectionFormProps) => {
  const {
    formData,
    handleInputChange,
    getAvailableProperties,
    getAvailableTenants,
    getAvailableRooms
  } = useInspectionForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.contractType || !formData.tenant || !formData.property) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const inspectionData = {
      ...formData,
      id: Date.now(),
      status: 'Planifié'
    };

    console.log('État des lieux ajouté à la collection rent_etat:', inspectionData);
    
    // Simuler la génération et le stockage du PDF
    const pdfDocument = {
      id: Date.now(),
      name: `Etat_lieux_${formData.type}_${formData.tenant.split(' ')[0]}.pdf`,
      type: 'etat_lieux',
      uploadDate: new Date().toISOString(),
      inspectionId: inspectionData.id
    };
    
    console.log('Document PDF généré et stocké:', pdfDocument);
    
    onSubmit(inspectionData);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Nouvel État des Lieux</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicInfoFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <PropertyTenantFields
            formData={formData}
            onInputChange={handleInputChange}
            availableProperties={getAvailableProperties()}
            availableTenants={getAvailableTenants()}
            availableRooms={getAvailableRooms()}
          />
          
          <AdditionalInfoFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer l'état des lieux
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default InspectionForm;
