
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { messageService } from '@/services/messageService';

export const ContactFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📧 ContactForm: Soumission du formulaire de contact:', formData);
      
      // Vérifier s'il y a déjà une conversation pour cet email
      let conversation = await messageService.findConversationByEmail(formData.email);
      let conversationId: string;
      
      if (conversation) {
        console.log('📧 ContactForm: Conversation existante trouvée:', conversation.id);
        conversationId = conversation.id;
      } else {
        console.log('📧 ContactForm: Création d\'une nouvelle conversation');
        // Créer une nouvelle conversation
        conversationId = await messageService.createConversation({
          clientName: formData.name,
          clientEmail: formData.email
        });
        console.log('📧 ContactForm: Nouvelle conversation créée:', conversationId);
      }

      // Créer le message complet avec le sujet
      const fullMessage = formData.subject 
        ? `Sujet: ${formData.subject}\n\n${formData.message}`
        : formData.message;

      // Envoyer le message
      console.log('📧 ContactForm: Envoi du message...');
      await messageService.sendMessage({
        conversationId,
        sender: 'client',
        senderName: formData.name,
        senderEmail: formData.email,
        message: fullMessage
      });

      console.log('📧 ContactForm: Message envoyé avec succès');

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      toast({
        title: "Message envoyé !",
        description: "Votre message a été transmis à notre équipe. Nous vous répondrons dans les plus brefs délais.",
      });

    } catch (error) {
      console.error('📧 ContactForm: Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Envoyez-nous un message
      </h2>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-1"
                placeholder="Objet de votre message (optionnel)"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-1"
                placeholder="Décrivez votre demande..."
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le message'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
