
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useOwnerRegistrations } from '@/hooks/useOwnerRegistrations';
import { useEmployeePassword } from '@/hooks/useEmployeePassword';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Clock, User, Building, Mail, FileText } from 'lucide-react';

const OwnerRegistrations: React.FC = () => {
  const { registrations, loading, updateRegistrationStatus, deleteRegistration } = useOwnerRegistrations();
  const { ensureEmployeeCanLogin } = useEmployeePassword();
  const { toast } = useToast();

  const handleApprove = async (registration: any) => {
    try {
      // Créer le compte employé dans user_roles
      const employeeId = `emp_${Date.now()}`;
      const employeeData = {
        name: registration.name,
        email: registration.email,
        role: 'employee',
        companyId: registration.companyName, // Utiliser le nom de l'entreprise comme ID temporaire
        createdAt: new Date().toISOString(),
        permissions: ['read'],
        approvedFrom: 'registration'
      };

      await setDoc(doc(db, 'user_roles', employeeId), employeeData);

      // Créer l'accès de connexion
      const result = await ensureEmployeeCanLogin(employeeId, registration.email);

      // Mettre à jour le statut de la demande
      await updateRegistrationStatus(registration.id, 'approved');

      toast({
        title: "Demande approuvée",
        description: `Le compte de ${registration.name} a été créé avec succès. ${result.tempPassword ? `Mot de passe temporaire: ${result.tempPassword}` : ''}`,
      });
    } catch (error) {
      console.error('Error approving registration:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'approbation de la demande",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (registration: any) => {
    try {
      await updateRegistrationStatus(registration.id, 'rejected');
      toast({
        title: "Demande rejetée",
        description: `La demande de ${registration.name} a été rejetée.`,
      });
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du rejet de la demande",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (registration: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement la demande de ${registration.name} ?`)) {
      return;
    }

    try {
      await deleteRegistration(registration.id);
      toast({
        title: "Demande supprimée",
        description: `La demande de ${registration.name} a été supprimée.`,
      });
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la demande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Chargement des demandes...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Demandes d'inscription des propriétaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune demande d'inscription</p>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{registration.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {registration.email}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(registration.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Entreprise:</span>
                    <span>{registration.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Créé le:</span>
                    <span>{new Date(registration.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {registration.description && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="mt-1 text-gray-700">{registration.description}</p>
                    </div>
                  </div>
                )}

                {registration.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => handleApprove(registration)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      onClick={() => handleReject(registration)}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                )}

                {registration.status !== 'pending' && (
                  <div className="flex justify-end pt-2 border-t">
                    <Button
                      onClick={() => handleDelete(registration)}
                      size="sm"
                      variant="outline"
                      className="text-gray-500 hover:text-red-600"
                    >
                      Supprimer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerRegistrations;
