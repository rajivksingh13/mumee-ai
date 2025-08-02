import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { getCurrencySymbol } from '../utils/currencyUtils';

interface CurrencyDisplayProps {
  className?: string;
  showDetails?: boolean;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const { location, loading, error, isIndianUser, countryCode } = useGeolocation();

  if (loading || !countryCode) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        <div className="animate-pulse">🌍 Detecting your location...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        <span>🌍 Location: Default (India)</span>
        <span className="ml-2">💱 Currency: INR</span>
      </div>
    );
  }

  const currencySymbol = getCurrencySymbol(isIndianUser ? 'INR' : 'USD');
  const currencyCode = isIndianUser ? 'INR' : 'USD';

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {showDetails ? (
        <>
          <span>🌍 {location?.countryName || `Country: ${countryCode}`}</span>
          <span className="ml-2">💱 {currencySymbol} {currencyCode}</span>
        </>
      ) : (
        <span>💱 Prices in {currencyCode}</span>
      )}
    </div>
  );
};

export default CurrencyDisplay; 