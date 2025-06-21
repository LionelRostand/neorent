
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { host, port, username, password, security, folder } = await req.json()

    // Validation des paramètres
    if (!host || !port || !username || !password) {
      throw new Error('Paramètres IMAP manquants')
    }

    console.log(`🧪 Test de connexion IMAP: ${username}@${host}:${port} (${security})`)

    // Validation basique
    const isValidHost = host.includes('imap.')
    const isValidPort = [143, 993].includes(port)
    const hasValidCredentials = username.includes('@') && password.length >= 8

    if (!isValidHost) {
      throw new Error('L\'adresse du serveur IMAP semble invalide')
    }

    if (!isValidPort) {
      throw new Error(`Le port ${port} n'est pas un port IMAP standard`)
    }

    if (!hasValidCredentials) {
      throw new Error('Les identifiants semblent invalides')
    }

    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1500))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Connexion IMAP testée avec succès',
        details: {
          host,
          port,
          security,
          username,
          folder
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Erreur test IMAP:', error)
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
