import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
  includeMargin?: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = 'M',
  className = '',
  includeMargin = true,
}) => {
  return (
    <div className={`inline-flex items-center justify-center p-4 bg-white rounded-xl ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        fgColor="#2B230B"
        bgColor="#FFFFFF"
      />
    </div>
  );
};

export default QRCode;

