
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mongoApi, MongoProperty, PropertyWebsiteSettings } from '@/services/mongoApi';

// Hook pour récupérer toutes les propriétés
export const useMongoProperties = () => {
  return useQuery({
    queryKey: ['mongo-properties'],
    queryFn: () => mongoApi.getProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Hook pour récupérer les propriétés d'un propriétaire
export const useMongoOwnerProperties = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['mongo-owner-properties', ownerId],
    queryFn: () => ownerId ? mongoApi.getPropertiesByOwner(ownerId) : Promise.resolve([]),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

// Hook pour récupérer une propriété par ID
export const useMongoProperty = (id: string) => {
  return useQuery({
    queryKey: ['mongo-property', id],
    queryFn: () => mongoApi.getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

// Hook pour récupérer les paramètres du site web
export const useWebsiteSettings = () => {
  return useQuery({
    queryKey: ['website-settings'],
    queryFn: () => mongoApi.getWebsiteSettings(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

// Hook pour sauvegarder les paramètres du site web
export const useSaveWebsiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: PropertyWebsiteSettings[]) => mongoApi.saveWebsiteSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-settings'] });
    },
  });
};

// Hook pour mettre à jour les paramètres d'une propriété
export const useUpdatePropertyWebsiteSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ propertyId, settings }: { propertyId: string; settings: Partial<PropertyWebsiteSettings> }) =>
      mongoApi.updatePropertyWebsiteSettings(propertyId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-settings'] });
    },
  });
};

// Hook pour vérifier la connexion à l'API
export const useMongoHealthCheck = () => {
  return useQuery({
    queryKey: ['mongo-health'],
    queryFn: () => mongoApi.healthCheck(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
};

// Hook pour créer une propriété
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (property: Omit<MongoProperty, '_id' | 'createdAt' | 'updatedAt'>) => 
      mongoApi.createProperty(property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mongo-properties'] });
      queryClient.invalidateQueries({ queryKey: ['mongo-owner-properties'] });
    },
  });
};

// Hook pour mettre à jour une propriété
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MongoProperty> }) =>
      mongoApi.updateProperty(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mongo-properties'] });
      queryClient.invalidateQueries({ queryKey: ['mongo-owner-properties'] });
      queryClient.invalidateQueries({ queryKey: ['mongo-property', data._id] });
    },
  });
};

// Hook pour supprimer une propriété
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mongoApi.deleteProperty(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['mongo-properties'] });
      queryClient.invalidateQueries({ queryKey: ['mongo-owner-properties'] });
      queryClient.removeQueries({ queryKey: ['mongo-property', deletedId] });
    },
  });
};
