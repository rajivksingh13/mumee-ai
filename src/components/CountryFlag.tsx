import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';

interface CountryFlagProps {
  className?: string;
  isLoggedIn?: boolean;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ className = '', isLoggedIn = false }) => {
  const [countryCode, setCountryCode] = useState<string>('US');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Only detect country if user is logged in
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    const detectCountry = async () => {
      try {
        setLoading(true);
        
        // Try multiple geolocation APIs for better reliability
        const apis = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json'
        ];

        let countryCode = null;
        let geolocationData = null;

        for (const api of apis) {
          try {
            console.log(`Trying API: ${api}`);
            const response = await fetch(api, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (!response.ok) {
              console.log(`API ${api} failed with status: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            // Handle different API response formats
            if (data.country_code && data.country_code.length === 2) {
              countryCode = data.country_code.toUpperCase();
              geolocationData = {
                countryCode: data.country_code.toUpperCase(),
                countryName: data.country_name,
                region: data.region,
                city: data.city,
                timezone: data.timezone,
                ipAddress: data.ip
              };
              console.log(`Found country code: ${countryCode}`);
              break;
            } else if (data.country && data.country.length === 2) {
              countryCode = data.country.toUpperCase();
              geolocationData = {
                countryCode: data.country.toUpperCase(),
                countryName: data.country,
                region: data.region,
                city: data.city,
                timezone: data.timezone,
                ipAddress: data.ip
              };
              console.log(`Found country code: ${countryCode}`);
              break;
            }
          } catch (apiError) {
            console.log(`API ${api} error:`, apiError);
            continue;
          }
        }

        if (countryCode) {
          setCountryCode(countryCode);
          console.log(`Setting country code to: ${countryCode}`);
          
          // Save geolocation data to Firestore
          if (geolocationData && user) {
            try {
              await databaseService.updateUserGeolocation(user.uid, geolocationData);
              console.log('✅ Geolocation data saved to Firestore');
            } catch (dbError) {
              console.error('❌ Failed to save geolocation data:', dbError);
            }
          }
        } else {
          throw new Error('No valid country code found from any API');
        }
      } catch (error) {
        console.log('Could not detect country, using default US:', error);
        setCountryCode('US');
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, [isLoggedIn, user]);

  const getFlagImageUrl = (countryCode: string) => {
    // Use a reliable flag image service
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  // Don't render anything if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className={`w-6 h-6 bg-gray-300 rounded animate-pulse ${className}`} />
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