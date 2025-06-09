
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleSettingsTabProps {
  icon: string;
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    placeholder: string;
    type?: string;
  }>;
}

const SimpleSettingsTab: React.FC<SimpleSettingsTabProps> = ({ 
  icon, 
  title, 
  description, 
  fields 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{icon} {title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-4">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input 
                id={field.id} 
                type={field.type || 'text'}
                placeholder={field.placeholder} 
              />
            </div>
          ))}
        </div>
        <Button className="w-full sm:w-auto">Sauvegarder</Button>
      </CardContent>
    </Card>
  );
};

export default SimpleSettingsTab;
