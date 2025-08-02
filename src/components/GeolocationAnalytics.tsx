import React, { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';

interface GeolocationAnalyticsProps {
  className?: string;
}

const GeolocationAnalytics: React.FC<GeolocationAnalyticsProps> = ({ className = '' }) => {
  const [topCountries, setTopCountries] = useState<Array<{ countryCode: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countries = await databaseService.getTopCountries(5);
        setTopCountries(countries);
        
        console.log('📊 Geolocation Analytics:', countries);
      } catch (err) {
        console.error('❌ Failed to load geolocation analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const getFlagImageUrl = (countryCode: string) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  if (loading) {
    return (
      <div className={`p-4 bg-gray-800 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-900/20 border border-red-500/30 rounded-lg ${className}`}>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gray-800 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">🌍 User Geography</h3>
      
      {topCountries.length === 0 ? (
        <p className="text-gray-400 text-sm">No geolocation data available yet.</p>
      ) : (
        <div className="space-y-2">
          {topCountries.map((country, index) => (
            <div key={country.countryCode} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">#{index + 1}</span>
                <img 
                  src={getFlagImageUrl(country.countryCode)}
                  alt={`Flag of ${country.countryCode}`}
                  className="w-4 h-3 object-cover rounded-sm"
                />
                <span className="text-white font-medium">{country.countryCode}</span>
              </div>
              <span className="text-indigo-400 font-semibold">{country.count} users</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Data collected from user geolocation detection
        </p>
      </div>
    </div>
  );
};

export default GeolocationAnalytics; 