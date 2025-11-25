import React from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';

interface FilePreviewProps {
  file: File | { name: string; url?: string; type?: string };
  onRemove?: () => void;
  showRemove?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  showRemove = true,
  size = 'md',
}) => {
  const fileName = file.name;
  const fileUrl = 'url' in file ? file.url : undefined;
  const fileType = file.type || ('type' in file ? file.type : '');
  const isImage = fileType.startsWith('image/');
  const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="relative group">
      <div className={`
        ${sizeClasses[size]}
        rounded-xl border-2 border-gray-200 overflow-hidden
        bg-gray-50 flex items-center justify-center
        transition-all duration-200 hover:border-gold-300
      `}>
        {isImage && fileUrl ? (
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-full object-cover"
          />
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center p-2">
            <FileText size={size === 'sm' ? 24 : size === 'md' ? 32 : 40} className="text-rose-600" />
            <span className="text-[10px] text-gray-600 mt-1 truncate max-w-full px-1">
              PDF
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2">
            <ImageIcon size={size === 'sm' ? 24 : size === 'md' ? 32 : 40} className="text-gray-400" />
            <span className="text-[10px] text-gray-600 mt-1 truncate max-w-full px-1">
              {fileName.split('.').pop()?.toUpperCase() || 'FILE'}
            </span>
          </div>
        )}
      </div>
      
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 shadow-md"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      )}
      
      <p className="mt-2 text-xs text-gray-600 truncate max-w-full" title={fileName}>
        {fileName}
      </p>
    </div>
  );
};

export default FilePreview;

