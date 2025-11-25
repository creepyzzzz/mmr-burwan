import React from 'react';
import { FileX, Inbox, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'search' | 'file';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  const defaultIcons = {
    default: <Inbox size={48} className="text-gray-300" />,
    search: <Search size={48} className="text-gray-300" />,
    file: <FileX size={48} className="text-gray-300" />,
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 text-gray-300">
        {displayIcon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;

