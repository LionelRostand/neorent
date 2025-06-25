
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  MapPin, 
  Euro, 
  Bed, 
  Bath, 
  Square, 
  Building,
  Phone,
  Mail,
  Calendar,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export const PropertyDetailsModal = ({
  isOpen,
  onClose,
  property
}: PropertyDetailsModalProps) => {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800';
      case 'Occupé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomInfo = (property: any) => {
    const rooms = property.locationType === 'Colocation' 
      ? property.totalRooms || 1
      : property.type === 'Studio' ? 1 : 2;
    const bathrooms = 1;
    return { rooms, bathrooms };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVisitForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi de la demande de visite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Demande de visite envoyée', {
        description: 'Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous.'
      });

      // Réinitialiser le formulaire
      setVisitForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      
      setShowVisitForm(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi', {
        description: 'Veuillez réessayer ou nous contacter directement.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomInfo = getRoomInfo(property);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{property.title}</span>
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {!showVisitForm ? (
          <div className="space-y-6">
            {/* Image principale */}
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              {property.image && property.image !== '/placeholder.svg' ? (
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Informations générales
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {property.address}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {roomInfo.rooms} {property.locationType === 'Colocation' ? 'chambres' : 'pièces'}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {roomInfo.bathrooms} SDB
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.surface}m²
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="font-medium text-blue-600">{property.type}</span>
                      {property.locationType && (
                        <span className="text-gray-500">• {property.locationType}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prix et charges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tarification
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Loyer mensuel</span>
                      <div className="flex items-center font-semibold text-lg text-green-600">
                        <Euro className="h-4 w-4 mr-1" />
                        {property.rent}€
                      </div>
                    </div>
                    {property.charges && (
                      <div className="text-sm text-gray-600">
                        Charges comprises dans le loyer
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Contact
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">Neo Rent</p>
                      <p className="text-sm text-gray-600">Gestionnaire immobilier</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <span>+33 1 23 45 67 89</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span>contact@neorent.fr</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowVisitForm(true)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Programmer une visite
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Disponibilité */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Disponibilité
                  </h3>
                  <div className={`p-3 rounded-lg ${
                    property.status === 'Libre' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {property.status === 'Libre' ? 'Disponible immédiatement' : 'Non disponible'}
                      </span>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                    {property.status === 'Libre' && (
                      <p className="text-sm text-gray-600 mt-1">
                        Visite possible sous 24h
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {property.locationType === 'Colocation' 
                    ? `Belle ${property.type.toLowerCase()} en colocation de ${property.surface}m² située ${property.address}. ${property.totalRooms} chambres disponibles dans un environnement convivial et moderne.`
                    : `Magnifique ${property.type.toLowerCase()} de ${property.surface}m² situé ${property.address}. Idéal pour une personne recherchant confort et praticité dans un quartier dynamique.`
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* En-tête du formulaire de visite */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Programmer une visite pour {property.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVisitForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Formulaire de demande de visite */}
            <form onSubmit={handleSubmitVisit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={visitForm.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={visitForm.email}
                    onChange={handleInputChange}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={visitForm.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="06 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="preferredDate">Date souhaitée *</Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={visitForm.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Heure souhaitée *</Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={visitForm.preferredTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={visitForm.message}
                  onChange={handleInputChange}
                  placeholder="Questions particulières ou informations complémentaires..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• La visite sera confirmée par téléphone dans les 24h</li>
                  <li>• Veuillez vous munir d'une pièce d'identité</li>
                  <li>• Les visites sont possibles du lundi au samedi de 9h à 18h</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVisitForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Calendar className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
