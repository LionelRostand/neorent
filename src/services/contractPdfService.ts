
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
    'Article 1 - Durée du bail : Le présent bail est conclu pour une durée de 3 ans renouvelable, conformément à la loi du 6 juillet 1989 tendant à améliorer les rapports locatifs.',
    'Article 2 - Loyer : Le loyer est payable mensuellement et d\'avance, le premier de chaque mois. Il peut être révisé annuellement selon l\'indice de référence des loyers (IRL).',
    'Article 3 - Charges : Les charges sont récupérées selon les dispositions du décret n°87-713 du 26 août 1987. Un décompte annuel sera fourni.',
    'Article 4 - Dépôt de garantie : Un dépôt de garantie équivalent à un mois de loyer hors charges est exigé et restitué dans un délai de 2 mois maximum.',
    'Article 5 - État des lieux : Un état des lieux contradictoire sera établi à l\'entrée et à la sortie, conformément à la loi ALUR.',
    'Article 6 - Assurance : Le locataire s\'engage à souscrire une assurance habitation couvrant les risques locatifs et à en justifier annuellement.',
    'Article 7 - Travaux : Les grosses réparations sont à la charge du bailleur, l\'entretien courant à la charge du locataire.',
    'Article 8 - Résiliation : Le bail peut être résilié par le locataire avec un préavis de 3 mois (1 mois en zone tendue), par le bailleur selon les conditions strictes de l\'article 15 de la loi de 1989.',
    'Article 9 - Clause résolutoire : En cas de non-paiement du loyer, résiliation de plein droit après commandement demeuré infructueux.',
    'Article 10 - Juridiction compétente : Tout litige relève de la compétence du tribunal judiciaire du lieu de situation de l\'immeuble.'
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
    'Article 1 - Durée du bail : Le présent bail est conclu conformément aux articles 1709 et suivants du Code civil camerounais et à la loi n°2011/008 du 6 mai 2011.',
    'Article 2 - Loyer : Le loyer est payable selon les termes convenus. En l\'absence de clause contraire, le paiement s\'effectue au début de chaque période locative.',
    'Article 3 - Caution : Une caution équivalent à 2 mois de loyer peut être exigée et sera restituée dans un délai raisonnable après restitution des clés.',
    'Article 4 - Charges locatives : Les charges sont définies selon la réglementation camerounaise en vigueur et doivent être justifiées par des pièces comptables.',
    'Article 5 - État des lieux : Un état des lieux sera établi contradictoirement à l\'entrée et à la sortie pour constater l\'état du bien.',
    'Article 6 - Obligations du locataire : User paisiblement des lieux, payer le loyer aux échéances, entretenir le logement, souscrire une assurance.',
    'Article 7 - Obligations du bailleur : Délivrer un logement en bon état, assurer la jouissance paisible, effectuer les réparations nécessaires.',
    'Article 8 - Résiliation : La résiliation suit les procédures du droit camerounais. Le préavis est généralement de 3 mois sauf convention contraire.',
    'Article 9 - Contentieux : En cas de litige, compétence des tribunaux camerounais selon les règles de droit commun.',
    'Article 10 - Enregistrement : Le présent bail sera enregistré conformément aux dispositions fiscales camerounaises en vigueur.'
  ];
  
  clauses.forEach(clause => {
    const lines = pdf.splitTextToSize(clause, 170);
    pdf.text(lines, 20, y);
    y += lines.length * 5 + 3;
  });
  
  return y;
};

const addContractHeader = (pdf: jsPDF, contractData: ContractData): number => {
  let yPosition = 20;
  
  // En-tête avec juridiction
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const title = contractData.jurisdiction === 'francaise' 
    ? 'CONTRAT DE BAIL (République Française)' 
    : 'CONTRAT DE BAIL (République du Cameroun)';
  pdf.text(title, 105, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Sous-titre avec type de contrat
  pdf.setFontSize(14);
  pdf.text(contractData.type.toUpperCase(), 105, yPosition, { align: 'center' });
  yPosition += 20;
  
  return yPosition;
};

const addContractParties = (pdf: jsPDF, contractData: ContractData, yPosition: number): number => {
  let y = yPosition;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ENTRE LES SOUSSIGNÉS :', 20, y);
  y += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('LE BAILLEUR : [Nom du propriétaire]', 20, y);
  y += 6;
  pdf.text('Adresse : [Adresse du propriétaire]', 20, y);
  y += 6;
  pdf.text('Ci-après dénommé "le Bailleur"', 20, y);
  y += 10;
  
  pdf.text('ET', 20, y);
  y += 8;
  
  pdf.text(`LE LOCATAIRE : ${contractData.tenant}`, 20, y);
  y += 6;
  pdf.text('Adresse : [Adresse du locataire]', 20, y);
  y += 6;
  pdf.text('Ci-après dénommé "le Locataire"', 20, y);
  y += 15;
  
  return y;
};

const addContractDetails = (pdf: jsPDF, contractData: ContractData, yPosition: number): number => {
  let y = yPosition;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OBJET DU CONTRAT :', 20, y);
  y += 10;
  
  pdf.setFont('helvetica', 'normal');
  const contractInfo = [
    `Bien loué : ${contractData.property}`,
    `Type de bail : ${contractData.type}`,
    `Période de location : Du ${new Date(contractData.startDate).toLocaleDateString('fr-FR')} au ${new Date(contractData.endDate).toLocaleDateString('fr-FR')}`,
    `Montant du loyer mensuel : ${contractData.amount}`,
    `Juridiction applicable : ${contractData.jurisdiction === 'francaise' ? 'Droit français' : 'Droit camerounais'}`
  ];
  
  contractInfo.forEach(info => {
    pdf.text(`• ${info}`, 25, y);
    y += 8;
  });
  
  y += 10;
  return y;
};

export const generateContractPDF = (contractData: ContractData) => {
  const pdf = new jsPDF();
  
  // En-tête du contrat
  let yPosition = addContractHeader(pdf, contractData);
  
  // Parties contractantes
  yPosition = addContractParties(pdf, contractData, yPosition);
  
  // Détails du contrat
  yPosition = addContractDetails(pdf, contractData, yPosition);
  
  // Clauses légales selon la juridiction
  if (contractData.jurisdiction === 'francaise') {
    yPosition = addFrenchLegalClauses(pdf, yPosition);
  } else {
    yPosition = addCameroonianLegalClauses(pdf, yPosition);
  }
  
  // Nouvelle page si nécessaire pour les signatures
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = 20;
  } else {
    yPosition += 20;
  }
  
  // Section signatures
  if (contractData.signatures) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNATURES', 20, yPosition);
    yPosition += 15;
    
    // Signature du propriétaire/bailleur
    if (contractData.signatures.owner) {
      pdf.setFont('helvetica', 'normal');
      pdf.text('Le Bailleur :', 20, yPosition);
      yPosition += 10;
      
      try {
        pdf.addImage(contractData.signatures.owner.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la signature du propriétaire:', error);
      }
      
      pdf.text(`Signé le : ${new Date(contractData.signatures.owner.signerInfo.date).toLocaleDateString('fr-FR')}`, 20, yPosition + 25);
      yPosition += 40;
    }
    
    // Signature du locataire
    if (contractData.signatures.tenant) {
      pdf.text('Le Locataire :', 20, yPosition);
      yPosition += 10;
      
      try {
        pdf.addImage(contractData.signatures.tenant.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la signature du locataire:', error);
      }
      
      pdf.text(`Signé le : ${new Date(contractData.signatures.tenant.signerInfo.date).toLocaleDateString('fr-FR')}`, 20, yPosition + 25);
    }
  } else {
    // Espaces pour signatures manuscrites
    pdf.setFont('helvetica', 'normal');
    pdf.text('Le Bailleur', 20, yPosition);
    pdf.text('Le Locataire', 120, yPosition);
    yPosition += 10;
    
    // Lignes pour signatures
    pdf.line(20, yPosition + 30, 80, yPosition + 30);
    pdf.line(120, yPosition + 30, 180, yPosition + 30);
    
    pdf.text('Signature :', 20, yPosition + 35);
    pdf.text('Signature :', 120, yPosition + 35);
    
    pdf.text('Date :', 20, yPosition + 45);
    pdf.text('Date :', 120, yPosition + 45);
  }
  
  // Télécharger le PDF avec un nom personnalisé
  const jurisdictionLabel = contractData.jurisdiction === 'francaise' ? 'FR' : 'CM';
  const fileName = `Contrat_${contractData.type.replace(/\s+/g, '_')}_${contractData.tenant.split(' ')[0]}_${jurisdictionLabel}.pdf`;
  pdf.save(fileName);
};
