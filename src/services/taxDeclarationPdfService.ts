
import jsPDF from 'jspdf';

interface TaxDeclarationData {
  declarationYear: number;
  selectedProperties: string[];
  deductibleCharges: number;
  taxBracket: string;
  calculations: {
    totalRentalIncome: number;
    totalCharges: number;
    netIncome: number;
    estimatedTax: number;
  };
}

interface CompanyInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  siret?: string;
}

export const generateTaxDeclarationPDF = (data: TaxDeclarationData, companyInfo: CompanyInfo) => {
  const doc = new jsPDF();
  
  // Configuration des couleurs
  const primaryColor = [34, 139, 34]; // Vert
  const textColor = [51, 51, 51]; // Gris foncé
  
  // En-tête de l'entreprise
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(companyInfo.name, 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(companyInfo.address, 20, 40);
  
  if (companyInfo.phone) {
    doc.text(`Tél: ${companyInfo.phone}`, 20, 50);
  }
  
  if (companyInfo.email) {
    doc.text(`Email: ${companyInfo.email}`, 20, 60);
  }
  
  if (companyInfo.siret) {
    doc.text(`SIRET: ${companyInfo.siret}`, 20, 70);
  }
  
  // Titre du document
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`DÉCLARATION FISCALE ${data.declarationYear}`, 20, 90);
  
  // Date de génération
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`Générée le ${new Date().toLocaleDateString('fr-FR')}`, 20, 100);
  
  // Informations de la déclaration
  doc.setFontSize(12);
  doc.text('REVENUS FONCIERS', 20, 120);
  
  doc.setFontSize(10);
  doc.text(`Nombre de biens sélectionnés: ${data.selectedProperties.length}`, 20, 130);
  doc.text(`Tranche d'imposition: ${data.taxBracket}%`, 20, 140);
  
  // Tableau des montants
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 155, 170, 60, 'F');
  
  doc.setFontSize(11);
  doc.text('DÉTAIL DES CALCULS', 25, 170);
  
  doc.setFontSize(10);
  doc.text('Revenus locatifs bruts annuels:', 25, 185);
  doc.text(`${data.calculations.totalRentalIncome.toLocaleString('fr-FR')} €`, 150, 185);
  
  doc.text('Charges déductibles:', 25, 195);
  doc.text(`${data.calculations.totalCharges.toLocaleString('fr-FR')} €`, 150, 195);
  
  doc.text('Revenus nets imposables:', 25, 205);
  doc.text(`${data.calculations.netIncome.toLocaleString('fr-FR')} €`, 150, 205);
  
  // Montant de l'impôt avec bordure
  doc.setLineWidth(1);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(20, 225, 170, 25);
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('IMPÔT ESTIMÉ À PAYER:', 25, 240);
  doc.text(`${data.calculations.estimatedTax.toLocaleString('fr-FR')} €`, 130, 240);
  
  // Note importante
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('Note: Cette estimation est basée sur votre tranche marginale d\'imposition.', 20, 260);
  doc.text('Le montant réel peut varier selon votre situation fiscale globale.', 20, 270);
  
  // Signature
  doc.setFontSize(10);
  doc.text('Signature:', 20, 290);
  
  // Téléchargement du fichier
  const fileName = `Declaration_Fiscale_${data.declarationYear}.pdf`;
  doc.save(fileName);
  
  return fileName;
};
