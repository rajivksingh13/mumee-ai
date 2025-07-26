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
      {/* Butterfly Body */}
      <div className="absolute left-1/2 top-1/4 w-0.5 h-1/2 bg-gradient-to-b from-indigo-600 via-purple-500 to-indigo-600 transform -translate-x-1/2 rounded-full"></div>
      
      {/* Left Wing - Main */}
      <div className="absolute left-0 top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-90"></div>
      
      {/* Left Wing - Inner Detail */}
      <div className="absolute left-1/4 top-1/3 w-1/4 h-1/4 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
      
      {/* Left Wing - Outer Detail */}
      <div className="absolute left-1/6 top-1/4 w-1/6 h-1/6 bg-gradient-to-br from-indigo-400 to-purple-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      
      {/* Right Wing - Main */}
      <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-500 via-purple-400 to-pink-300 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-90"></div>
      
      {/* Right Wing - Inner Detail */}
      <div className="absolute right-1/4 top-1/3 w-1/4 h-1/4 bg-gradient-to-bl from-purple-300 to-pink-200 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-70"></div>
      
      {/* Right Wing - Outer Detail */}
      <div className="absolute right-1/6 top-1/4 w-1/6 h-1/6 bg-gradient-to-bl from-indigo-400 to-purple-300 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      
      {/* Head */}
      <div className="absolute left-1/2 top-1/4 w-1.5 h-1.5 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
      
      {/* Antennae - Left */}
      <div className="absolute left-1/2 top-1/4 w-0.5 h-1.5 bg-gradient-to-b from-indigo-500 to-purple-400 transform -translate-x-1/2 -translate-y-full rotate-12 origin-bottom rounded-full"></div>
      
      {/* Antennae - Right */}
      <div className="absolute left-1/2 top-1/4 w-0.5 h-1.5 bg-gradient-to-b from-indigo-500 to-purple-400 transform -translate-x-1/2 -translate-y-full -rotate-12 origin-bottom rounded-full"></div>
      
      {/* Antennae Tips */}
      <div className="absolute left-1/2 top-1/4 w-1 h-1 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full transform -translate-x-1/2 -translate-y-full -translate-x-1 rotate-12 origin-bottom"></div>
      <div className="absolute left-1/2 top-1/4 w-1 h-1 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full transform -translate-x-1/2 -translate-y-full translate-x-1 -rotate-12 origin-bottom"></div>
      
      {/* Wing Spots - Left */}
      <div className="absolute left-1/4 top-1/3 w-0.5 h-0.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      <div className="absolute left-1/3 top-2/5 w-0.5 h-0.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      
      {/* Wing Spots - Right */}
      <div className="absolute right-1/4 top-1/3 w-0.5 h-0.5 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-80"></div>
      <div className="absolute right-1/3 top-2/5 w-0.5 h-0.5 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      
      {/* Wing Veins - Left */}
      <div className="absolute left-1/4 top-1/4 w-0.5 h-1/4 bg-gradient-to-b from-indigo-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 origin-top opacity-40"></div>
      <div className="absolute left-1/3 top-1/3 w-0.5 h-1/6 bg-gradient-to-b from-indigo-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-30 origin-top opacity-40"></div>
      
      {/* Wing Veins - Right */}
      <div className="absolute right-1/4 top-1/4 w-0.5 h-1/4 bg-gradient-to-b from-indigo-400 to-transparent transform translate-x-1/2 -translate-y-1/2 -rotate-45 origin-top opacity-40"></div>
      <div className="absolute right-1/3 top-1/3 w-0.5 h-1/6 bg-gradient-to-b from-indigo-400 to-transparent transform translate-x-1/2 -translate-y-1/2 -rotate-30 origin-top opacity-40"></div>
      
      {/* Body Segments */}
      <div className="absolute left-1/2 top-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full transform -translate-x-1/2 opacity-60"></div>
      <div className="absolute left-1/2 top-1/2 w-0.5 h-0.5 bg-purple-400 rounded-full transform -translate-x-1/2 opacity-60"></div>
      <div className="absolute left-1/2 top-2/3 w-0.5 h-0.5 bg-purple-400 rounded-full transform -translate-x-1/2 opacity-60"></div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-sm"></div>
    </div>
  );
};

export default ButterflyLogo; 