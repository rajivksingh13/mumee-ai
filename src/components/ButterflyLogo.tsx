import React from 'react';

interface ButterflyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ButterflyLogo: React.FC<ButterflyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img
        src="/butterflylogo.png"
        alt="titliAI Butterfly Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a simple butterfly emoji if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = '🦋';
        }}
      />
    </div>
  );
};

export default ButterflyLogo;
