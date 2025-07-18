
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ExternalLink, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useCertificateCheck } from '@/hooks/useCertificateCheck';

interface CertificateHelperProps {
  baseUrl: string;
  onCertificateAccepted?: () => void;
}

const CertificateHelper: React.FC<CertificateHelperProps> = ({ 
  baseUrl, 
  onCertificateAccepted 
}) => {
  const { 
    isChecking, 
    certificateAccepted, 
    checkCertificate, 
    openCertificateAcceptance 
  } = useCertificateCheck();

  useEffect(() => {
    // Vérification initiale
    checkCertificate(baseUrl);
  }, [baseUrl, checkCertificate]);

  useEffect(() => {
    if (certificateAccepted && onCertificateAccepted) {
      onCertificateAccepted();
    }
  }, [certificateAccepted, onCertificateAccepted]);

  const handleAcceptCertificate = () => {
    openCertificateAcceptance(baseUrl);
    // Re-vérifier après un délai pour laisser le temps à l'utilisateur
    setTimeout(() => {
      checkCertificate(baseUrl);
    }, 3000);
  };

  const handleRecheck = () => {
    checkCertificate(baseUrl);
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Shield className="h-5 w-5" />
          Gestion du certificat SSL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificateAccepted ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✅ Certificat accepté !</strong> La connexion SSL est maintenant disponible.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Certificat SSL requis</strong>
                <br />
                Pour utiliser cette API, vous devez d'abord accepter le certificat SSL du serveur.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAcceptCertificate}
                className="flex items-center gap-2"
                variant="default"
              >
                <ExternalLink className="h-4 w-4" />
                Accepter le certificat
              </Button>
              
              <Button 
                onClick={handleRecheck}
                disabled={isChecking}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Vérification...' : 'Re-vérifier'}
              </Button>
            </div>

            <div className="text-sm text-amber-700 space-y-2">
              <p><strong>Instructions :</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Cliquez sur "Accepter le certificat" ci-dessus</li>
                <li>Dans le nouvel onglet, cliquez sur "Avancé" puis "Continuer vers le site"</li>
                <li>Fermez l'onglet et cliquez sur "Re-vérifier"</li>
                <li>Testez ensuite votre connexion MongoDB</li>
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateHelper;
