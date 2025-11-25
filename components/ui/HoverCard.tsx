import React, { useRef, useState } from 'react';
import { calculateHoverRotation, getHoverTransform, getSpotlightGradient } from '../../utils/animations';
import { colors } from '../../utils/designTokens';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'rose' | 'gold';
  spotlight?: boolean;
}

const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  color = 'gold',
  spotlight = true,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRotation = calculateHoverRotation(x, y, rect.width, rect.height, 3);
    setPosition({ x, y });
    setRotation(newRotation);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotation({ x: 0, y: 0 });
  };

  const colorConfig = {
    rose: {
      bg: 'bg-rose-50',
      spotlight: `rgba(255, 228, 233, 0.4)`,
      border: 'group-hover:border-rose-200',
    },
    gold: {
      bg: 'bg-gold-50',
      spotlight: `rgba(248, 241, 216, 0.4)`,
      border: 'group-hover:border-gold-300',
    },
  };

  const currentConfig = colorConfig[color];

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={getHoverTransform(rotation)}
      className={`
        relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl
        transition-all duration-200 ease-out
        hover:shadow-2xl hover:shadow-gray-200/50
        group cursor-pointer
        ${className}
      `}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: getSpotlightGradient(position.x, position.y, currentConfig.spotlight, 600),
          }}
        />
      )}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default HoverCard;

