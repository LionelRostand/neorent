
import { useState, useCallback } from 'react';

export const useCertificateCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [certificateAccepted, setCertificateAccepted] = useState(false);

  const checkCertificate = useCallback(async (baseUrl: string) => {
    setIsChecking(true);
    try {
      // Tentative de connexion simple pour vérifier si le certificat est accepté
      const response = await fetch(`${baseUrl}/api/health`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      setCertificateAccepted(response.ok || response.status < 500);
      return response.ok || response.status < 500;
    } catch (error) {
      setCertificateAccepted(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const openCertificateAcceptance = useCallback((baseUrl: string) => {
    // Ouvre le lien dans un nouvel onglet pour accepter le certificat
    window.open(baseUrl, '_blank', 'noopener,noreferrer');
  }, []);

  return {
    isChecking,
    certificateAccepted,
    checkCertificate,
    openCertificateAcceptance
  };
};
