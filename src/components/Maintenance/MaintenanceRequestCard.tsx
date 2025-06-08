
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantName: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  status: string;
  requestDate: string;
  responsibility: string;
}

interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'destructive';
    case 'normal': return 'default';
    case 'faible': return 'secondary';
    default: return 'default';
  }
};

const MaintenanceRequestCard = ({ request }: MaintenanceRequestCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {request.category} - {request.location}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(request.priority)}>
              {request.priority}
            </Badge>
            <Badge variant="outline">
              {request.responsibility}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {request.propertyId}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {request.tenantName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {request.requestDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
        <Badge variant="secondary">{request.status}</Badge>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestCard;
