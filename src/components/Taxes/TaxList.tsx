
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, DollarSign, Calendar, Calculator, Receipt, FileText, Edit, Trash2 } from 'lucide-react';
import { RentFiscality } from '@/hooks/useFirebaseFiscality';

interface TaxListProps {
  filteredTaxes: RentFiscality[];
  selectedYear: number;
  onShowDetails: (tax: RentFiscality) => void;
  onEditTax: (taxId: string) => void;
  onDeleteTax: (taxId: string) => void;
  onMarkAsPaid: (taxId: string) => void;
}

const TaxList = ({ 
  filteredTaxes, 
  selectedYear, 
  onShowDetails, 
  onEditTax, 
  onDeleteTax, 
  onMarkAsPaid 
}: TaxListProps) => {
  const { t } = useTranslation();

  if (filteredTaxes.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Receipt className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
        <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">Aucune fiscalité</h3>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 px-4">
          Aucune obligation fiscale trouvée pour l'année {selectedYear}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="pt-2 sm:pt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('taxes.taxList2025', { year: selectedYear })}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredTaxes.map((tax) => (
          <Card key={tax.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{tax.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{tax.type}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tax.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <Badge 
                      variant={tax.status === 'Payée' ? 'default' : tax.status === 'À déclarer' ? 'secondary' : 'destructive'}
                      className={`text-xs ${
                        tax.status === 'Payée' ? 'bg-green-100 text-green-800' : 
                        tax.status === 'À déclarer' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {tax.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTax(tax.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTax(tax.id)}
                        className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                    <Building2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{tax.property}</span>
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold text-xs sm:text-sm">
                    <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">Montant: {tax.amount}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                    <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">Échéance: {new Date(tax.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                    <Calculator className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Année: {tax.year}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => onShowDetails(tax)}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    <span className="hidden sm:inline">Détails</span>
                    <span className="sm:hidden">Voir</span>
                  </Button>
                  {tax.status !== 'Payée' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => onMarkAsPaid(tax.id)}
                    >
                      <span className="hidden sm:inline">Marquer payé</span>
                      <span className="sm:hidden">Payé</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TaxList;
