
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Home, User, AlertCircle } from 'lucide-react';

const ResponsibilityGuide = () => {
  const proprietaireResponsibilities = [
    {
      category: 'Gros œuvre et structure',
      items: [
        'Réparation des murs porteurs',
        'Étanchéité de la toiture',
        'Isolation thermique',
        'Fondations et structure du bâtiment'
      ]
    },
    {
      category: 'Installations principales',
      items: [
        'Plomberie générale et canalisations',
        'Installation électrique',
        'Système de chauffage collectif',
        'Ascenseur',
        'Interphone et digicode'
      ]
    },
    {
      category: 'Équipements de sécurité',
      items: [
        'Détecteurs de fumée (fourniture)',
        'Garde-corps et rampes',
        'Éclairage des parties communes',
        'Système de sécurité incendie'
      ]
    },
    {
      category: 'Menuiseries extérieures',
      items: [
        'Fenêtres et volets',
        'Porte d\'entrée du logement',
        'Serrure de la porte d\'entrée (remplacement)',
        'Joints d\'étanchéité'
      ]
    }
  ];

  const locataireResponsibilities = [
    {
      category: 'Entretien courant',
      items: [
        'Nettoyage régulier du logement',
        'Entretien des joints silicone',
        'Nettoyage des vitres',
        'Entretien des espaces verts privatifs'
      ]
    },
    {
      category: 'Petites réparations',
      items: [
        'Remplacement des ampoules',
        'Débouchage des évacuations',
        'Réparation des robinets qui gouttent',
        'Remplacement des joints de robinetterie'
      ]
    },
    {
      category: 'Équipements et installations',
      items: [
        'Entretien de la chaudière individuelle',
        'Ramonage (si cheminée)',
        'Entretien des VMC',
        'Pile des détecteurs de fumée'
      ]
    },
    {
      category: 'Usure normale',
      items: [
        'Peinture et tapisserie',
        'Moquette et revêtements de sol',
        'Poignées de portes et fenêtres',
        'Interrupteurs et prises'
      ]
    }
  ];

  const specialCases = [
    {
      title: 'Vices cachés',
      description: 'Défauts non apparents lors de la remise des clés',
      responsibility: 'Propriétaire',
      details: 'Le propriétaire doit réparer tous les vices cachés découverts après l\'entrée du locataire.'
    },
    {
      title: 'Dégradations locatives',
      description: 'Dommages causés par le locataire ou ses invités',
      responsibility: 'Locataire',
      details: 'Le locataire est responsable des réparations liées aux dégradations qu\'il a causées.'
    },
    {
      title: 'Urgences',
      description: 'Interventions urgentes en cas de danger',
      responsibility: 'Propriétaire',
      details: 'En cas d\'urgence (fuite, panne électrique dangereuse), le propriétaire doit intervenir rapidement.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Responsabilité Propriétaire
            </CardTitle>
            <CardDescription>
              Travaux et réparations à la charge du bailleur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {proprietaireResponsibilities.map((section, index) => (
                <AccordionItem key={index} value={`proprietaire-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {section.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Responsabilité Locataire
            </CardTitle>
            <CardDescription>
              Entretien et réparations à la charge du locataire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {locataireResponsibilities.map((section, index) => (
                <AccordionItem key={index} value={`locataire-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {section.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Cas Particuliers
          </CardTitle>
          <CardDescription>
            Situations spéciales et exceptions à connaître
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {specialCases.map((specialCase, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {specialCase.title}
                  </CardTitle>
                  <Badge 
                    variant={specialCase.responsibility === 'Propriétaire' ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {specialCase.responsibility}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {specialCase.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {specialCase.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Référence Légale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            La répartition des charges de maintenance est encadrée par :
          </p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• <strong>Loi du 6 juillet 1989</strong> - Rapports locatifs</li>
            <li>• <strong>Décret n°87-712 du 26 août 1987</strong> - Réparations locatives</li>
            <li>• <strong>Article 1724 du Code Civil</strong> - Obligations du bailleur</li>
            <li>• <strong>Article 1728 du Code Civil</strong> - Obligations du locataire</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsibilityGuide;
