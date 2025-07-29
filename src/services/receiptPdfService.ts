import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReceiptData {
  tenant: {
    name: string;
    address: string;
    email: string;
  };
  property: {
    address: string;
    rent: number;
    charges: number;
  };
  payment: {
    amount: number;
    date: string;
    method: string;
    reference: string;
    period: string;
  };
}

// Fonction pour générer et retourner le PDF en tant que Blob
export const generateReceiptPDF = async (data: ReceiptData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Configuration des couleurs (typées explicitement)
  const primaryColor: [number, number, number] = [34, 197, 94]; // Vert
  const secondaryColor: [number, number, number] = [75, 85, 99]; // Gris
  const textColor: [number, number, number] = [31, 41, 55]; // Gris foncé
  
  let currentY = 30;
  
  // En-tête
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('QUITTANCE DE LOYER', 20, 17);
  
  currentY = 40;
  
  // Informations du propriétaire (à gauche)
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BAILLEUR', 20, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  currentY += 8;
  doc.text('Lionel DJOSSA', 20, currentY);
  currentY += 5;
  doc.text('Gestionnaire Immobilier', 20, currentY);
  currentY += 5;
  doc.text('contact@property-manager.com', 20, currentY);
  
  // Informations du locataire (à droite)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LOCATAIRE', 120, 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.tenant.name, 120, 48);
  doc.text(data.tenant.address, 120, 53);
  doc.text(data.tenant.email, 120, 58);
  
  currentY = 80;
  
  // Numéro et date de la quittance
  doc.setDrawColor(...secondaryColor);
  doc.line(20, currentY, 190, currentY);
  currentY += 10;
  
  const receiptNumber = `QR-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Quittance N° ${receiptNumber}`, 20, currentY);
  doc.text(`Date: ${currentDate}`, 120, currentY);
  
  currentY += 20;
  
  // Titre principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text('Je soussigné reconnaît avoir reçu la somme de :', 20, currentY);
  
  currentY += 15;
  
  // Montant en toutes lettres
  const amountInWords = numberToWords(data.payment.amount);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(`${amountInWords} euros (${data.payment.amount} €)`, 20, currentY);
  
  currentY += 20;
  
  // Détails du paiement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Pour le règlement du loyer et charges de la période : ${data.payment.period}`, 20, currentY);
  
  currentY += 10;
  doc.text(`Concernant le logement situé : ${data.property.address}`, 20, currentY);
  
  currentY += 20;
  
  // Tableau des montants
  const tableStartY = currentY;
  
  // En-tête du tableau
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableStartY, 170, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DÉTAIL DU PAIEMENT', 25, tableStartY + 7);
  
  currentY = tableStartY + 15;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Loyer', 25, currentY);
  doc.text(`${data.property.rent} €`, 160, currentY);
  
  currentY += 8;
  doc.text('Charges', 25, currentY);
  doc.text(`${data.property.charges} €`, 160, currentY);
  
  currentY += 8;
  doc.setDrawColor(...secondaryColor);
  doc.line(25, currentY, 185, currentY);
  
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', 25, currentY);
  doc.text(`${data.payment.amount} €`, 160, currentY);
  
  // Bordure du tableau
  doc.setDrawColor(...secondaryColor);
  doc.rect(20, tableStartY, 170, currentY - tableStartY + 5);
  
  currentY += 20;
  
  // Informations sur le paiement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Mode de paiement : ${data.payment.method}`, 20, currentY);
  currentY += 6;
  doc.text(`Date du paiement : ${format(new Date(data.payment.date), 'dd MMMM yyyy', { locale: fr })}`, 20, currentY);
  
  if (data.payment.reference) {
    currentY += 6;
    doc.text(`Référence : ${data.payment.reference}`, 20, currentY);
  }
  
  currentY += 20;
  
  // Mentions légales
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text('Cette quittance annule tous reçus partiels qui auraient pu être délivrés précédemment', 20, currentY);
  currentY += 5;
  doc.text('pour le paiement du loyer de la période mentionnée ci-dessus.', 20, currentY);
  
  // Pied de page
  currentY = 260;
  doc.setDrawColor(...primaryColor);
  doc.line(20, currentY, 190, currentY);
  
  currentY += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Document généré automatiquement le ' + format(new Date(), 'dd/MM/yyyy à HH:mm'), 20, currentY);
  
  // Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text('Signature du bailleur :', 120, 220);
  
  // Retourner le PDF en tant que Blob
  return doc.output('blob');
};

// Fonction pour télécharger directement le PDF
export const generateRentReceipt = async (data: ReceiptData) => {
  const pdfBlob = await generateReceiptPDF(data);
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  
  const fileName = `Quittance_${data.tenant.name.replace(/\s+/g, '_')}_${format(new Date(data.payment.date), 'yyyy-MM')}.pdf`;
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Fonction pour convertir un nombre en mots (simplifiée)
function numberToWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];
  const hundreds = ['', 'cent', 'deux cents', 'trois cents', 'quatre cents', 'cinq cents', 'six cents', 'sept cents', 'huit cents', 'neuf cents'];
  
  if (num === 0) return 'zéro';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const tenDigit = Math.floor(num / 10);
    const unitDigit = num % 10;
    return tens[tenDigit] + (unitDigit ? '-' + units[unitDigit] : '');
  }
  if (num < 1000) {
    const hundredDigit = Math.floor(num / 100);
    const remainder = num % 100;
    return hundreds[hundredDigit] + (remainder ? ' ' + numberToWords(remainder) : '');
  }
  
  // Pour les nombres plus grands, retourner une version simplifiée
  return num.toString();
}