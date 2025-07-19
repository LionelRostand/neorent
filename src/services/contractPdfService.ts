
import jsPDF from 'jspdf';

interface ContractData {
  title: string;
  type: string;
  tenant: string;
  property: string;
  startDate: string;
  endDate: string;
  amount: string;
  jurisdiction: string;
  roomNumber?: string;
  primaryTenant?: string;
  signatures?: any;
}

export const generateContractPDF = (contractData: ContractData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(contractData.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Contract details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const details = [
    `Type de contrat: ${contractData.type}`,
    `Locataire: ${contractData.tenant}`,
    `Propriété: ${contractData.property}`,
    `Date de début: ${new Date(contractData.startDate).toLocaleDateString('fr-FR')}`,
    `Date de fin: ${new Date(contractData.endDate).toLocaleDateString('fr-FR')}`,
    `Montant: ${contractData.amount}`,
    `Juridiction: ${contractData.jurisdiction === 'francaise' ? 'Française' : 'Camerounaise'}`
  ];

  if (contractData.roomNumber) {
    details.push(`Chambre: ${contractData.roomNumber}`);
  }

  if (contractData.primaryTenant) {
    details.push(`Locataire principal: ${contractData.primaryTenant}`);
  }

  details.forEach(detail => {
    doc.text(detail, margin, yPosition);
    yPosition += 10;
  });

  yPosition += 10;

  // Contract clauses
  doc.setFont('helvetica', 'bold');
  doc.text('CLAUSES DU CONTRAT:', margin, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'normal');
  const clauses = [
    '1. Le présent contrat prend effet à la date mentionnée ci-dessus.',
    '2. Le loyer doit être payé avant le 5 de chaque mois.',
    '3. Un préavis d\'un mois est requis pour la résiliation.',
    '4. Le locataire doit souscrire une assurance habitation.',
    '5. Toute modification doit faire l\'objet d\'un avenant écrit.'
  ];

  if (contractData.type === 'Colocation') {
    clauses.push('6. Les espaces communs doivent être entretenus conjointement.');
    clauses.push('7. Le règlement intérieur de la colocation doit être respecté.');
  }

  clauses.forEach(clause => {
    const lines = doc.splitTextToSize(clause, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });
    yPosition += 3;
  });

  // Signatures section
  yPosition += 20;
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 30;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES:', margin, yPosition);
  yPosition += 20;

  doc.setFont('helvetica', 'normal');
  
  // Owner signature
  doc.text('Propriétaire:', margin, yPosition);
  doc.text('Date: ___________', margin, yPosition + 15);
  doc.text('Signature:', margin, yPosition + 30);

  // Tenant signature
  doc.text('Locataire:', pageWidth / 2 + 10, yPosition);
  doc.text('Date: ___________', pageWidth / 2 + 10, yPosition + 15);
  doc.text('Signature:', pageWidth / 2 + 10, yPosition + 30);

  // Download the PDF
  const fileName = `${contractData.title.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
