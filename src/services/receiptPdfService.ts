
import jsPDF from 'jspdf';

interface ReceiptData {
  companyName: string;
  companyAddress: string;
  tenantName: string;
  tenantType: 'Locataire' | 'Colocataire';
  propertyAddress: string;
  propertyType: string; // "Appartement" ou "Chambre en colocation"
  month: string;
  year: string;
  rentAmount: number;
  charges: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: string;
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF();
  
  // Configuration des couleurs et styles
  const primaryColor = [34, 139, 34]; // Vert
  const textColor = [51, 51, 51]; // Gris foncé
  
  // En-tête de l'entreprise
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(data.companyName, 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(data.companyAddress, 20, 40);
  
  // Titre du document
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('QUITTANCE DE LOYER', 20, 70);
  
  // Informations du locataire - Section mise en évidence
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 85, 170, 35, 'F');
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`${data.tenantType.toUpperCase()}`, 25, 95);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Nom: ${data.tenantName}`, 25, 105);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Statut: ${data.tenantType}`, 25, 115);
  
  // Informations du bien
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('BIEN LOUÉ', 20, 140);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Adresse: ${data.propertyAddress}`, 20, 150);
  doc.text(`Type: ${data.propertyType}`, 20, 160);
  
  // Période et montants
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DÉTAILS DU PAIEMENT', 20, 180);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Période: ${data.month} ${data.year}`, 20, 190);
  doc.text(`Date de paiement: ${data.paymentDate}`, 20, 200);
  doc.text(`Mode de paiement: ${data.paymentMethod}`, 20, 210);
  
  // Tableau des montants
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 220, 170, 30, 'F');
  
  doc.setFontSize(10);
  doc.text('Loyer:', 25, 235);
  doc.text(`${data.rentAmount.toFixed(2)} €`, 150, 235);
  
  doc.text('Charges:', 25, 245);
  doc.text(`${data.charges.toFixed(2)} €`, 150, 245);
  
  // Total avec bordure
  doc.setLineWidth(0.5);
  doc.line(20, 255, 190, 255);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL PAYÉ:', 25, 265);
  doc.text(`${data.totalAmount.toFixed(2)} €`, 145, 265);
  
  // Signature et date
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Fait le ${new Date().toLocaleDateString('fr-FR')}`, 20, 290);
  doc.text('Signature du bailleur:', 120, 290);
  
  // Téléchargement du fichier avec le nom du locataire
  const fileName = `Quittance_${data.tenantName.replace(/\s+/g, '_')}_${data.month}_${data.year}.pdf`;
  doc.save(fileName);
};
