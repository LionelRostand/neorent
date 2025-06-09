
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyData } from '@/hooks/useCompanyData';
import { Plus, X } from 'lucide-react';

const CompanyManagement: React.FC = () => {
  const { company, loading, updateCompany } = useCompanyData();
  const [companyName, setCompanyName] = useState(company?.name || '');
  const [subsidiaries, setSubsidiaries] = useState<string[]>(company?.subsidiaries || []);
  const [newSubsidiary, setNewSubsidiary] = useState('');

  React.useEffect(() => {
    if (company) {
      setCompanyName(company.name);
      setSubsidiaries(company.subsidiaries);
    }
  }, [company]);

  const handleSave = async () => {
    await updateCompany({
      name: companyName,
      subsidiaries
    });
  };

  const addSubsidiary = () => {
    if (newSubsidiary.trim() && !subsidiaries.includes(newSubsidiary.trim())) {
      setSubsidiaries([...subsidiaries, newSubsidiary.trim()]);
      setNewSubsidiary('');
    }
  };

  const removeSubsidiary = (index: number) => {
    setSubsidiaries(subsidiaries.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>Chargement des données de l'entreprise...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          🏢 Gestion de l'Entreprise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Nom de l'entreprise</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom de votre entreprise"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce nom apparaîtra dans la sidebar à la place de "Neo Rent"
            </p>
          </div>

          <div>
            <Label>Filiales</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSubsidiary}
                  onChange={(e) => setNewSubsidiary(e.target.value)}
                  placeholder="Nom de la filiale"
                  onKeyPress={(e) => e.key === 'Enter' && addSubsidiary()}
                />
                <Button onClick={addSubsidiary} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {subsidiaries.map((subsidiary, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{subsidiary}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubsidiary(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          Sauvegarder les modifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;
