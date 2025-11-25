import React, { useRef, useState } from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  active?: boolean;
  color: 'rose' | 'gold' | 'indigo';
  className?: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, active = false, color, className = '', onClick }) => {
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

    // Calculate rotation based on mouse position relative to center
    // Max rotation is +/- 3 degrees
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3; 
    const rotateY = ((x - centerX) / centerX) * 3;

    setPosition({ x, y });
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setRotation({ x: 0, y: 0 }); // Reset rotation on leave
  };

  const colorConfig = {
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      spotlight: 'rgba(255, 228, 233, 0.4)',
      border: 'group-hover:border-rose-200',
    },
    gold: {
      bg: 'bg-gold-50',
      icon: 'text-gold-600',
      spotlight: 'rgba(248, 241, 216, 0.4)',
      border: 'group-hover:border-gold-300',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      spotlight: 'rgba(224, 231, 255, 0.4)',
      border: 'group-hover:border-indigo-200',
    },
  };

  const currentConfig = colorConfig[color];

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className={`
        relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl
        transition-all duration-200 ease-out
        hover:shadow-2xl hover:shadow-gray-200/50
        group cursor-pointer h-full
        ${active ? 'ring-1 ring-gold-400/50 shadow-gold-100/50' : 'shadow-sm'}
        ${className}
      `}
    >
      {/* Spotlight Effect Layer */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${currentConfig.spotlight}, transparent 40%)`,
        }}
      />

      <div className="relative h-full flex flex-col justify-between p-6 z-20 transform translate-z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl ${currentConfig.bg} flex items-center justify-center ${currentConfig.icon} shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {icon}
          </div>
          
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center 
            bg-gray-50 text-gray-400 
            transition-all duration-300 
            group-hover:bg-gray-900 group-hover:text-white group-hover:rotate-45
          `}>
            {active ? <ArrowUpRight size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-gray-900 leading-snug mb-1 group-hover:text-gray-800 transition-colors">
            {title}
          </h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2 group-hover:text-gold-600 transition-colors">
            {active && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>}
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;