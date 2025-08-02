import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

interface CountryFlagProps {
  className?: string;
  isLoggedIn?: boolean;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ className = '', isLoggedIn = false }) => {
  const { location, loading, error } = useGeolocation();
  
  // Get country code from the geolocation hook
  const countryCode = location?.countryCode || 'IN';

  const getFlagImageUrl = (countryCode: string) => {
    // Use a reliable flag image service
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  if (loading) {
    return (
      <div className={`w-6 h-6 bg-gray-300 rounded animate-pulse ${className}`} />
    );
  }

  // If there's an error, show a globe icon instead of flag
  if (error) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full border border-white/20 ${className}`}>
        <span className="text-sm">🌍</span>
        <span className="text-xs font-medium text-white">IN</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full border border-white/20 ${className}`}>
      <img 
        src={getFlagImageUrl(countryCode)}
        alt={`Flag of ${countryCode}`}
        className="w-4 h-3 object-cover rounded-sm"
        onError={(e) => {
          // Fallback to a globe icon if flag image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('span');
          fallback.textContent = '🌍';
          fallback.className = 'text-sm';
          target.parentNode?.insertBefore(fallback, target);
        }}
      />
      <span className="text-xs font-medium text-white">{countryCode}</span>
    </div>
  );
};

export default CountryFlag; 