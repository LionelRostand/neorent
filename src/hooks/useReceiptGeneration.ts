import { generateRentReceipt } from '@/services/receiptPdfService';

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
  
  const generateReceipt = async (paymentData: {
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
      tenant: {
        name: tenantName,
        address: propertyAddress,
        email: 'email@example.com'
      },
      property: {
        address: propertyAddress,
        rent: paymentData.rentAmount,
        charges: paymentData.charges
      },
      payment: {
        amount: paymentData.rentAmount + paymentData.charges,
        date: paymentData.paymentDate,
        method: paymentData.paymentMethod,
        reference: '',
        period: `${monthName} ${year}`
      }
    };
    
    // Utiliser le service PDF corrigé
    await generateRentReceipt(receiptData);
  };
  
  return { generateReceipt };
};