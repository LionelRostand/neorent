
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const WebsiteHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Site Web</h1>
        <p className="text-gray-600 mt-2">Gérez le contenu et l'apparence de votre site web</p>
      </div>
      <div className="flex gap-2">
        <Link to="/site" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WebsiteHeader;
