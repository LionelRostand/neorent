
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOwnerRegistrations } from '@/hooks/useOwnerRegistrations';
import { Check, X, Trash2, Mail, Phone, Building, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OwnerRegistrations: React.FC = () => {
  const { t } = useTranslation();
  const { requests, loading, approveRequest, rejectRequest, deleteRequest } = useOwnerRegistrations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t('settings.ownerRegistrations.status.pending')}</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('settings.ownerRegistrations.status.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t('settings.ownerRegistrations.status.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div>{t('settings.ownerRegistrations.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('settings.ownerRegistrations.title')}</h2>
        <Badge variant="outline">
          {requests.filter(r => r.status === 'pending').length} {t('settings.ownerRegistrations.pendingCount')}
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">{t('settings.ownerRegistrations.noRequests')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {t('settings.ownerRegistrations.requestCreated')} {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{request.email}</span>
                  </div>
                  
                  {request.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{request.phone}</span>
                    </div>
                  )}
                  
                  {request.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{request.company}</span>
                    </div>
                  )}
                  
                  {request.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{request.address}</span>
                    </div>
                  )}
                </div>

                {request.message && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>{t('settings.ownerRegistrations.message')}:</strong> {request.message}
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => approveRequest(request)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t('settings.ownerRegistrations.approve')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectRequest(request.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t('settings.ownerRegistrations.reject')}
                    </Button>
                  </div>
                )}

                {request.status !== 'pending' && (
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRequest(request.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('settings.ownerRegistrations.delete')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRegistrations;
