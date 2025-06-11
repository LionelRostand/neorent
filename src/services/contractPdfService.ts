
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
  signatures?: {
    owner?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
    tenant?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
  };
}

const addFrenchLegalClauses = (pdf: jsPDF, yPosition: number): number => {
  let y = yPosition;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDITIONS GÉNÉRALES (Droit français)', 20, y);
  y += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const clauses = [
    'Article 1 - Durée du bail : Le présent bail est conclu pour une durée de 3 ans renouvelable, conformément à la loi du 6 juillet 1989.',
    'Article 2 - Loyer : Le loyer est payable mensuellement et d\'avance, le premier de chaque mois.',
    'Article 3 - Charges : Les charges sont récupérées selon les dispositions du décret n°87-713 du 26 août 1987.',
    'Article 4 - Dépôt de garantie : Un dépôt de garantie équivalent à un mois de loyer est exigé.',
    'Article 5 - État des lieux : Un état des lieux contradictoire sera établi à l\'entrée et à la sortie.',
    'Article 6 - Assurance : Le locataire s\'engage à souscrire une assurance habitation.',
    'Article 7 - Résiliation : Le bail peut être résilié selon les conditions de l\'article 15 de la loi de 1989.'
  ];
  
  clauses.forEach(clause => {
    const lines = pdf.splitTextToSize(clause, 170);
    pdf.text(lines, 20, y);
    y += lines.length * 5 + 3;
  });
  
  return y;
};

const addCameroonianLegalClauses = (pdf: jsPDF, yPosition: number): number => {
  let y = yPosition;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONDITIONS GÉNÉRALES (Droit camerounais)', 20, y);
  y += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const clauses = [
    'Article 1 - Durée du bail : Le présent bail est conclu conformément au Code civil camerounais.',
    'Article 2 - Loyer : Le loyer est payable selon les termes convenus entre les parties.',
    'Article 3 - Charges : Les charges locatives sont définies selon la réglementation camerounaise.',
    'Article 4 - Caution : Une caution peut être exigée selon les dispositions légales en vigueur.',
    'Article 5 - État des lieux : Un état des lieux sera établi contradictoirement.',
    'Article 6 - Assurance : Le locataire doit souscrire les assurances nécessaires.',
    'Article 7 - Résiliation : La résiliation du bail suit les procédures du droit camerounais.'
  ];
  
  clauses.forEach(clause => {
    const lines = pdf.splitTextToSize(clause, 170);
    pdf.text(lines, 20, y);
    y += lines.length * 5 + 3;
  });
  
  return y;
};

export const generateContractPDF = (contractData: ContractData) => {
  const pdf = new jsPDF();
  let yPosition = 20;
  
  // En-tête
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTRAT DE BAIL', 105, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Informations du contrat
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const contractInfo = [
    `Titre: ${contractData.title}`,
    `Type: ${contractData.type}`,
    `Bien immobilier: ${contractData.property}`,
    `Locataire: ${contractData.tenant}`,
    `Période: Du ${new Date(contractData.startDate).toLocaleDateString('fr-FR')} au ${new Date(contractData.endDate).toLocaleDateString('fr-FR')}`,
    `Montant: ${contractData.amount}`,
    `Juridiction: ${contractData.jurisdiction === 'francaise' ? 'Française' : 'Camerounaise'}`
  ];
  
  contractInfo.forEach(info => {
    pdf.text(info, 20, yPosition);
    yPosition += 8;
  });
  
  yPosition += 10;
  
  // Clauses légales selon la juridiction
  if (contractData.jurisdiction === 'francaise') {
    yPosition = addFrenchLegalClauses(pdf, yPosition);
  } else {
    yPosition = addCameroonianLegalClauses(pdf, yPosition);
  }
  
  yPosition += 20;
  
  // Signatures
  if (contractData.signatures) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNATURES', 20, yPosition);
    yPosition += 15;
    
    if (contractData.signatures.owner) {
      pdf.setFont('helvetica', 'normal');
      pdf.text('Propriétaire/Bailleur:', 20, yPosition);
      yPosition += 10;
      
      // Ajouter la signature du propriétaire
      try {
        pdf.addImage(contractData.signatures.owner.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la signature du propriétaire:', error);
      }
      
      pdf.text(`Signé le: ${new Date(contractData.signatures.owner.signerInfo.date).toLocaleDateString('fr-FR')}`, 20, yPosition + 25);
      yPosition += 40;
    }
    
    if (contractData.signatures.tenant) {
      pdf.text('Locataire:', 20, yPosition);
      yPosition += 10;
      
      // Ajouter la signature du locataire
      try {
        pdf.addImage(contractData.signatures.tenant.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la signature du locataire:', error);
      }
      
      pdf.text(`Signé le: ${new Date(contractData.signatures.tenant.signerInfo.date).toLocaleDateString('fr-FR')}`, 20, yPosition + 25);
    }
  }
  
  // Télécharger le PDF
  const fileName = `Contrat_${contractData.type.replace(/\s+/g, '_')}_${contractData.tenant.split(' ')[0]}.pdf`;
  pdf.save(fileName);
};
