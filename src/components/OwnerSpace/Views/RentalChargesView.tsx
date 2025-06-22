
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import RentalChargeForm from '@/components/RentalChargeForm';
import ChargeMetrics from '@/components/RentalCharges/ChargeMetrics';
import MonthSelector from '@/components/RentalCharges/MonthSelector';
import ViewSelector from '@/components/RentalCharges/ViewSelector';
import ChargesList from '@/components/RentalCharges/ChargesList';
import AnnualChargesList from '@/components/RentalCharges/AnnualChargesList';
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

interface RentalChargesViewProps {
  currentProfile: any;
}

const RentalChargesView: React.FC<RentalChargesViewProps> = ({ currentProfile }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedView, setSelectedView] = useState<'monthly' | 'annual'>('monthly');
  const { charges, loading, error, addCharge, deleteCharge } = useFirebaseCharges();
  const { properties = [] } = useFirebaseProperties();
  const { toast } = useToast();

  // Filter owner's properties
  const ownerProperties = properties.filter(property => 
    property.owner === currentProfile?.name || property.owner === currentProfile?.email
  );

  // Get property titles for filtering
  const ownerPropertyTitles = ownerProperties.map(p => p.title);

  // Filter charges based on owner's properties
  const ownerCharges = charges.filter(charge => 
    ownerPropertyTitles.includes(charge.propertyName)
  );

  const filteredCharges = selectedView === 'monthly' 
    ? ownerCharges.filter(charge => charge.month === selectedMonth)
    : ownerCharges.filter(charge => charge.month && charge.month.startsWith('2024'));
  
  const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.total, 0);
  const averageCharges = filteredCharges.length > 0 ? totalCharges / filteredCharges.length : 0;
  const propertiesCount = selectedView === 'monthly' 
    ? filteredCharges.length 
    : new Set(filteredCharges.map(c => c.propertyName)).size;
  const highestCharge = filteredCharges.length > 0 ? Math.max(...filteredCharges.map(c => c.total)) : 0;

  const handleAddCharge = async (data: any) => {
    try {
      await addCharge(data);
      toast({
        title: "Success",
        description: "Rental charge added successfully",
      });
      console.log('Charge added to Rent_Charges collection:', data);
    } catch (err) {
      console.error('Error adding charge:', err);
      toast({
        title: "Error",
        description: "Error adding rental charge",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCharge = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this rental charge?")) {
      try {
        await deleteCharge(id);
        toast({
          title: "Success",
          description: "Rental charge deleted successfully",
        });
        console.log('Charge deleted from Rent_Charges collection:', id);
      } catch (err) {
        console.error('Error deleting charge:', err);
        toast({
          title: "Error",
          description: "Error deleting rental charge",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading charges data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rental Charges Management</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage rental charges and property expenses
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Charge
            </Button>
          </DialogTrigger>
          <RentalChargeForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleAddCharge}
          />
        </Dialog>
      </div>

      {/* View and month selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <ViewSelector 
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />
        
        <div className="w-full sm:w-auto">
          <MonthSelector 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </div>

      {/* Metrics */}
      <ChargeMetrics
        totalCharges={totalCharges}
        averageCharges={averageCharges}
        propertiesCount={propertiesCount}
        highestCharge={highestCharge}
      />

      {/* Charges list */}
      {selectedView === 'monthly' ? (
        <ChargesList
          charges={filteredCharges}
          selectedMonth={selectedMonth}
          onDeleteCharge={handleDeleteCharge}
        />
      ) : (
        <AnnualChargesList
          charges={filteredCharges}
          selectedYear="2024"
        />
      )}
    </div>
  );
};

export default RentalChargesView;
