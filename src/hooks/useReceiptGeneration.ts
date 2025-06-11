
import { generateReceiptPDF } from '@/services/receiptPdfService';

interface UseReceiptGenerationProps {
  tenantName: string;
  tenantType?: 'Locataire' | 'Colocataire';
  propertyAddress: string;
  propertyType?: string;
}

export const useReceiptGeneration = ({
  tenantName,
  tenantType = 'Locataire',
  propertyAddress,
  propertyType = 'Appartement'
}: UseReceiptGenerationProps) => {
  
  const generateReceipt = (paymentData: {
    month: string;
    rentAmount: number;
    charges: number;
    paymentDate: string;
    paymentMethod: string;
  }) => {
    // Extraire l'année et le mois
    const monthName = paymentData.month.split(' ')[0];
    const year = paymentData.month.split(' ')[1] || new Date().getFullYear().toString();
    
    const receiptData = {
      companyName: 'Neo Rent',
      companyAddress: '123 Rue de la Gestion, 75001 Paris',
      tenantName,
      tenantType,
      propertyAddress,
      propertyType: tenantType === 'Colocataire' ? 'Chambre en colocation' : propertyType,
      month: monthName,
      year,
      rentAmount: paymentData.rentAmount,
      charges: paymentData.charges,
      totalAmount: paymentData.rentAmount + paymentData.charges,
      paymentDate: new Date(paymentData.paymentDate).toLocaleDateString('fr-FR'),
      paymentMethod: paymentData.paymentMethod
    };
    
    generateReceiptPDF(receiptData);
  };
  
  return { generateReceipt };
};
