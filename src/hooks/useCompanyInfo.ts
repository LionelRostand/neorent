
import { useState, useEffect } from 'react';
import { useFirebaseCompanies } from './useFirebaseCompanies';

interface CompanyInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  siret?: string;
}

export const useCompanyInfo = () => {
  const { companies } = useFirebaseCompanies();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'NeoRent Admin',
    address: 'Adresse non définie'
  });

  useEffect(() => {
    if (companies && companies.length > 0) {
      const company = companies[0]; // Prendre la première entreprise
      setCompanyInfo({
        name: company.name || 'NeoRent Admin',
        address: company.address || 'Adresse non définie',
        phone: company.phone,
        email: company.email,
        siret: company.siret
      });
    }
  }, [companies]);

  return { companyInfo };
};
