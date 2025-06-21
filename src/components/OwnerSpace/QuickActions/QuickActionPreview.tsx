
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionPreviewProps {
  preview: string;
  PreviewIcon: LucideIcon;
}

const QuickActionPreview: React.FC<QuickActionPreviewProps> = ({ preview, PreviewIcon }) => {
  return (
    <div className="mt-3 bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-center text-center">
        <div>
          <PreviewIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium">{preview}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActionPreview;
