
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Monitor, Smartphone, Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThemeTab = () => {
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#64748b');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Inter');
  const { toast } = useToast();

  const themes = [
    { id: 'modern', name: 'Moderne', preview: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'classic', name: 'Classique', preview: 'bg-gradient-to-br from-gray-700 to-gray-900' },
    { id: 'nature', name: 'Nature', preview: 'bg-gradient-to-br from-green-500 to-emerald-600' },
    { id: 'sunset', name: 'Coucher de soleil', preview: 'bg-gradient-to-br from-orange-500 to-red-600' },
    { id: 'ocean', name: 'Océan', preview: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
    { id: 'minimal', name: 'Minimaliste', preview: 'bg-gradient-to-br from-slate-400 to-slate-600' }
  ];

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito', 'Source Sans Pro'
  ];

  const handleSaveTheme = () => {
    toast({
      title: "Thème sauvegardé",
      description: "Votre personnalisation de thème a été appliquée avec succès.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Aperçu généré",
      description: "L'aperçu du thème est maintenant disponible.",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🎨 Personnalisation du thème</h2>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Personnalisez l'apparence de votre site web selon votre identité de marque.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handlePreview} className="w-full sm:w-auto">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={handleSaveTheme} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Palette className="h-5 w-5" />
            Thèmes prédéfinis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  selectedTheme === theme.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className={`h-20 sm:h-24 md:h-28 rounded-t-lg ${theme.preview}`} />
                <div className="p-2 sm:p-3">
                  <h3 className="font-medium text-xs sm:text-sm text-center">{theme.name}</h3>
                  {selectedTheme === theme.id && (
                    <Badge className="w-full mt-1 text-xs bg-blue-100 text-blue-800 justify-center">
                      Sélectionné
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Couleurs personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-sm md:text-base">Couleur primaire</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1 rounded border"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="text-sm md:text-base">Couleur secondaire</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 p-1 rounded border"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#64748b"
                  className="flex-1 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor" className="text-sm md:text-base">Couleur d'accent</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 p-1 rounded border"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#f59e0b"
                  className="flex-1 text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Typographie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="fontFamily" className="text-sm md:text-base">Police de caractère</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fontSize" className="text-sm md:text-base">Taille de police (px)</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14px - Petit</SelectItem>
                  <SelectItem value="16">16px - Normal</SelectItem>
                  <SelectItem value="18">18px - Grand</SelectItem>
                  <SelectItem value="20">20px - Très grand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Aperçu en temps réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                <Monitor className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Desktop</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Mobile</span>
              </Button>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 min-h-[200px] sm:min-h-[300px] flex items-center justify-center"
              style={{
                backgroundColor: `${primaryColor}10`,
                borderColor: primaryColor,
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`
              }}
            >
              <div className="text-center space-y-2 sm:space-y-4">
                <h3 
                  className="text-lg sm:text-xl md:text-2xl font-bold"
                  style={{ color: primaryColor }}
                >
                  Aperçu du thème
                </h3>
                <p 
                  className="text-sm sm:text-base"
                  style={{ color: secondaryColor }}
                >
                  Voici comment votre site apparaîtra avec ce thème
                </p>
                <Button 
                  style={{ 
                    backgroundColor: accentColor, 
                    borderColor: accentColor,
                    fontSize: `${Math.max(12, parseInt(fontSize) - 2)}px`
                  }}
                  className="text-white hover:opacity-90 text-xs sm:text-sm"
                >
                  Bouton d'exemple
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTab;
