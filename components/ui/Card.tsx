import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl
        transition-all duration-200 ease-out
        ${hover ? 'hover:shadow-2xl hover:shadow-gray-200/50 cursor-pointer' : 'shadow-sm'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;

