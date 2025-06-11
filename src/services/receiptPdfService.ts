
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
  
  // Informations du locataire
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('LOCATAIRE / COLOCATAIRE', 20, 90);
  
  doc.setFontSize(10);
  doc.text(`Nom: ${data.tenantName}`, 20, 100);
  doc.text(`Type: ${data.tenantType}`, 20, 110);
  
  // Informations du bien
  doc.setFontSize(12);
  doc.text('BIEN LOUÉ', 20, 130);
  
  doc.setFontSize(10);
  doc.text(`Adresse: ${data.propertyAddress}`, 20, 140);
  doc.text(`Type: ${data.propertyType}`, 20, 150);
  
  // Période et montants
  doc.setFontSize(12);
  doc.text('DÉTAILS DU PAIEMENT', 20, 170);
  
  doc.setFontSize(10);
  doc.text(`Période: ${data.month} ${data.year}`, 20, 180);
  doc.text(`Date de paiement: ${data.paymentDate}`, 20, 190);
  doc.text(`Mode de paiement: ${data.paymentMethod}`, 20, 200);
  
  // Tableau des montants
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 210, 170, 30, 'F');
  
  doc.setFontSize(10);
  doc.text('Loyer:', 25, 225);
  doc.text(`${data.rentAmount.toFixed(2)} €`, 150, 225);
  
  doc.text('Charges:', 25, 235);
  doc.text(`${data.charges.toFixed(2)} €`, 150, 235);
  
  // Total avec bordure
  doc.setLineWidth(0.5);
  doc.line(20, 245, 190, 245);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL PAYÉ:', 25, 255);
  doc.text(`${data.totalAmount.toFixed(2)} €`, 145, 255);
  
  // Signature et date
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`Fait le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280);
  doc.text('Signature du bailleur:', 120, 280);
  
  // Téléchargement du fichier
  const fileName = `Quittance_${data.tenantName.replace(' ', '_')}_${data.month}_${data.year}.pdf`;
  doc.save(fileName);
};
