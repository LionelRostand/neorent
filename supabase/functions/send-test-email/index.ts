
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { smtp, to, subject, message } = await req.json()

    // Validation des paramètres
    if (!smtp || !to || !subject || !message) {
      throw new Error('Paramètres d\'email manquants')
    }

    const { host, port, username, password, security, fromEmail, fromName } = smtp

    if (!host || !port || !username || !password || !fromEmail) {
      throw new Error('Configuration SMTP incomplète')
    }

    console.log(`📧 Envoi d'email de test de ${fromEmail} vers ${to}`)

    // Validation de l'email destinataire
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      throw new Error('Adresse email destinataire invalide')
    }

    if (!emailRegex.test(fromEmail)) {
      throw new Error('Adresse email expéditeur invalide')
    }

    // Ici vous intégreriez un vrai service d'envoi d'email comme SendGrid, Mailgun, etc.
    // Pour l'instant, on simule l'envoi avec une validation des paramètres

    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 3000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de test envoyé avec succès',
        details: {
          from: `${fromName} <${fromEmail}>`,
          to,
          subject,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}

serve(handler)
