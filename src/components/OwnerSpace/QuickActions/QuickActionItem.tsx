
import React from 'react';
import QuickActionButton from './QuickActionButton';
import QuickActionPreview from './QuickActionPreview';
import { QuickAction } from './types';

interface QuickActionItemProps {
  action: QuickAction;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ action }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
      <QuickActionButton
        title={action.title}
        description={action.description}
        icon={action.icon}
        color={action.color}
        onClick={action.action}
      />
      
      <QuickActionPreview
        preview={action.preview}
        PreviewIcon={action.previewIcon}
      />
    </div>
  );
};

export default QuickActionItem;
