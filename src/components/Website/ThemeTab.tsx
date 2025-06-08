
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';

const ThemeTab = () => {
  const [colors, setColors] = useState({
    primary: '#22c55e',
    secondary: '#16a34a'
  });

  const handleApplyColors = () => {
    console.log('Application des couleurs:', colors);
    // Ici on appliquerait les couleurs au thème
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">🎨 Personnalisation du thème</h2>
        <Button onClick={handleApplyColors} className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Appliquer les couleurs
        </Button>
      </div>
      <p className="text-gray-600">Personnaliser l'apparence avec application en temps réel et cohérence visuelle.</p>

      <Card>
        <CardHeader>
          <CardTitle>Couleurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Couleur principale</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <Input
                  value={colors.primary}
                  onChange={(e) => setColors({...colors, primary: e.target.value})}
                  placeholder="#22c55e"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur secondaire</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: colors.secondary }}
                ></div>
                <Input
                  value={colors.secondary}
                  onChange={(e) => setColors({...colors, secondary: e.target.value})}
                  placeholder="#16a34a"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typographie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Police principale</Label>
            <Select defaultValue="inter">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTab;
