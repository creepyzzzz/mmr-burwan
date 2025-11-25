import React from 'react';
import { fadeUpAnimation } from '../../utils/animations';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <div
      style={fadeUpAnimation(delay)}
      className={className}
    >
      {children}
    </div>
  );
};

export default Reveal;

