
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountrySelectorProps {
  country: string;
  onCountryChange: (country: string) => void;
}

export const countries = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapour', flag: '🇸🇬' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' }
];

const CountrySelector = ({ country, onCountryChange }: CountrySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="country">Pays de résidence fiscale</Label>
      <Select value={country} onValueChange={onCountryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner votre pays" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              <div className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector;
