import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { messageService } from '@/services/messageService';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { 
  Calendar,
  X
} from 'lucide-react';

interface VisitSchedulingFormProps {
  property: any;
  onClose: () => void;
}

export const VisitSchedulingForm = ({ property, onClose }: VisitSchedulingFormProps) => {
  const { roommates } = useFirebaseRoommates();
  const [visitForm, setVisitForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculer le statut réel (même logique que dans les autres composants)
  const getRealStatus = (property: any) => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.title && roommate.status === 'Actif'
      ).length;
      
      const totalRooms = property.totalRooms || 1;
      const availableRooms = totalRooms - activeRoommates;
      
      if (availableRooms === totalRooms) {
        return 'Libre';
      } else if (availableRooms > 0) {
        return 'Partiellement occupé';
      } else {
        return 'Occupé';
      }
    } else {
      return property.status;
    }
  };

  const realStatus = getRealStatus(property);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVisitForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!visitForm.name || !visitForm.email || !visitForm.phone || !visitForm.preferredDate || !visitForm.preferredTime) {
      toast.error('Erreur de validation', {
        description: 'Veuillez remplir tous les champs obligatoires (nom, email, téléphone, date et heure souhaitées).'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer ou trouver une conversation pour ce client
      let conversationId;
      try {
        const existingConversation = await messageService.findConversationByEmail(visitForm.email);
        conversationId = existingConversation?.id;
      } catch (error) {
        console.log('Conversation not found, creating new one');
      }
      
      if (!conversationId) {
        // createConversation retourne directement l'ID de la conversation
        conversationId = await messageService.createConversation({
          clientName: visitForm.name,
          clientEmail: visitForm.email
        });
      }

      // Vérifier que conversationId n'est pas undefined
      if (!conversationId) {
        throw new Error('Impossible de créer ou trouver une conversation');
      }

      // Construire le message de demande de visite avec toutes les informations
      const visitMessage = `🏠 NOUVELLE DEMANDE DE VISITE

═══════════════════════════════════
📍 PROPRIÉTÉ
═══════════════════════════════════
• Nom : ${property.title}
• Adresse : ${property.address}
• Type : ${property.type} - ${property.surface}m²
• Loyer : ${property.rent}€/mois
• Statut : ${realStatus}

═══════════════════════════════════
👤 INFORMATIONS DU DEMANDEUR
═══════════════════════════════════
• Nom complet : ${visitForm.name}
• Email : ${visitForm.email}
• Téléphone : ${visitForm.phone}

═══════════════════════════════════
📅 CRÉNEAUX DEMANDÉS
═══════════════════════════════════
• Date souhaitée : ${new Date(visitForm.preferredDate).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
• Heure souhaitée : ${visitForm.preferredTime}

💬 MESSAGE DU CLIENT :
${visitForm.message || 'Aucun message particulier'}

═══════════════════════════════════
ℹ️ INFORMATIONS SYSTÈME
═══════════════════════════════════
• Source : Site web public
• Date de demande : ${new Date().toLocaleString('fr-FR')}
• À traiter : Confirmer la visite par téléphone dans les 24h

---
Merci de contacter le client pour confirmer le rendez-vous.`;

      // Envoyer le message via le service de messages
      await messageService.sendMessage({
        conversationId: conversationId,
        sender: 'client',
        senderName: visitForm.name,
        senderEmail: visitForm.email,
        message: visitMessage
      });

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
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de visite:', error);
      toast.error('Erreur lors de l\'envoi', {
        description: 'Veuillez réessayer ou nous contacter directement.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du formulaire de visite */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Programmer une visite pour {property.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Récapitulatif de la propriété */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Propriété sélectionnée</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Adresse :</strong> {property.address}</p>
          <p><strong>Type :</strong> {property.type} - {property.surface}m²</p>
          <p><strong>Loyer :</strong> {property.rent}€/mois</p>
          <p><strong>Statut :</strong> <span className="font-medium">{realStatus}</span></p>
        </div>
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
            <li>• Veuillez vous munir d&apos;une pièce d&apos;identité</li>
            <li>• Les visites sont possibles du lundi au samedi de 9h à 18h</li>
            <li>• Votre demande sera transmise directement à notre équipe</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
  );
};
