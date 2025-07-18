
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Globe, Server } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const baseUrl = 'https://161.97.108.157:30433/api';

  const endpoints = [
    {
      method: 'GET',
      path: '/properties',
      description: 'Récupérer toutes les propriétés',
      response: `{
  "properties": [
    {
      "_id": "string",
      "title": "string",
      "address": "string",
      "rent": number,
      "surface": number,
      "status": "string",
      "ownerId": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}`,
    },
    {
      method: 'GET',
      path: '/properties/:id',
      description: 'Récupérer une propriété par ID',
      response: `{
  "_id": "string",
  "title": "string",
  "address": "string",
  "rent": number,
  "surface": number,
  "status": "string",
  "ownerId": "string",
  "createdAt": "date",
  "updatedAt": "date"
}`,
    },
    {
      method: 'GET',
      path: '/properties/owner/:ownerId',
      description: 'Récupérer les propriétés d\'un propriétaire',
      response: `{
  "properties": [...]
}`,
    },
    {
      method: 'POST',
      path: '/properties',
      description: 'Créer une nouvelle propriété',
      body: `{
  "title": "string",
  "address": "string",
  "rent": number,
  "surface": number,
  "status": "string",
  "ownerId": "string"
}`,
    },
    {
      method: 'PUT',
      path: '/properties/:id',
      description: 'Mettre à jour une propriété',
      body: `{
  "title": "string",
  "address": "string",
  "rent": number,
  "surface": number,
  "status": "string"
}`,
    },
    {
      method: 'DELETE',
      path: '/properties/:id',
      description: 'Supprimer une propriété',
      response: `{
  "message": "Property deleted successfully"
}`,
    },
    {
      method: 'GET',
      path: '/website-settings',
      description: 'Récupérer les paramètres du site web',
      response: `{
  "settings": [
    {
      "propertyId": "string",
      "visible": boolean,
      "description": "string",
      "featured": boolean
    }
  ]
}`,
    },
    {
      method: 'POST',
      path: '/website-settings',
      description: 'Sauvegarder les paramètres du site web',
      body: `{
  "settings": [
    {
      "propertyId": "string",
      "visible": boolean,
      "description": "string",
      "featured": boolean
    }
  ]
}`,
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Vérifier l\'état de l\'API',
      response: `{
  "status": "ok",
  "timestamp": "date",
  "database": "connected"
}`,
    },
    {
      method: 'POST',
      path: '/test-connection',
      description: 'Tester la connexion à MongoDB',
      body: `{
  "connectionUrl": "string",
  "database": "string"
}`,
    },
    {
      method: 'GET',
      path: '/database-stats',
      description: 'Récupérer les statistiques de la base de données',
      response: `{
  "collections": number,
  "documents": number,
  "size": number,
  "indexes": number
}`,
    },
  ];

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Documentation API REST
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4" />
            <span className="font-medium">Base URL:</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-white px-2 py-1 rounded text-sm flex-1">
              {baseUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(baseUrl, 'baseUrl')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}`, endpoint.path)}
                  >
                    {copiedEndpoint === endpoint.path ? (
                      <span className="text-green-600">Copié!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="response" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="response">Response</TabsTrigger>
                    {endpoint.body && <TabsTrigger value="body">Request Body</TabsTrigger>}
                  </TabsList>
                  <TabsContent value="response" className="mt-4">
                    <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                      <code>{endpoint.response}</code>
                    </pre>
                  </TabsContent>
                  {endpoint.body && (
                    <TabsContent value="body" className="mt-4">
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        <code>{endpoint.body}</code>
                      </pre>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiDocumentation;
