
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionItemProps {
  action: {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    action: () => void;
    preview?: string;
  };
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ action }) => {
  const Icon = action.icon;

  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group bg-white/90 backdrop-blur-sm border-0 shadow-sm">
      <CardContent 
        className="p-3 sm:p-4"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          action.action();
        }}
      >
        <div className="flex items-start gap-3">
          {/* Icon container - responsive sizing */}
          <div className={`${action.color} rounded-lg p-2.5 sm:p-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          
          {/* Content container - flexible layout */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2 sm:line-clamp-1">
                  {action.description}
                </p>
                {action.preview && (
                  <p className="text-xs text-blue-600 font-medium mt-1.5 sm:mt-1 truncate">
                    {action.preview}
                  </p>
                )}
              </div>
              
              {/* Action button - responsive positioning */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <div className="bg-gray-100 group-hover:bg-gray-200 text-gray-600 group-hover:text-gray-800 rounded-full p-1.5 sm:p-2 transition-all duration-200">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionItem;
