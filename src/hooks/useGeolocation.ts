import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../services/databaseService';
import { buildApiUrl } from '../config/api';

interface UserLocation {
  countryCode: string;
  countryName?: string;
  region?: string;
  city?: string;
  timezone?: string;
  ipAddress?: string;
}

// Cache key for localStorage
const GEOLOCATION_CACHE_KEY = 'mumee_geolocation_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to get cached geolocation data
const getCachedGeolocation = (): UserLocation | null => {
  try {
    const cached = localStorage.getItem(GEOLOCATION_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid (within 24 hours)
      if (now - timestamp < CACHE_DURATION) {
        console.log('✅ Using cached geolocation data');
        return data;
      } else {
        console.log('⏰ Cached geolocation data expired, will fetch fresh');
        localStorage.removeItem(GEOLOCATION_CACHE_KEY);
      }
    }
  } catch (error) {
    console.log('❌ Error reading cached geolocation:', error);
  }
  return null;
};

// Helper function to cache geolocation data
const cacheGeolocation = (data: UserLocation): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify(cacheData));
    console.log('✅ Geolocation data cached');
  } catch (error) {
    console.log('❌ Error caching geolocation data:', error);
  }
};

// Helper function to clear geolocation cache (for testing/debugging)
export const clearGeolocationCache = (): void => {
  try {
    localStorage.removeItem(GEOLOCATION_CACHE_KEY);
    console.log('🗑️ Geolocation cache cleared');
  } catch (error) {
    console.log('❌ Error clearing geolocation cache:', error);
  }
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        // For logged-in users, first try to get location from saved data
        if (user) {
          try {
            const savedLocation = await databaseService.getUserGeolocation(user.uid);
            if (savedLocation) {
              console.log('✅ Using saved location for logged-in user:', savedLocation);
              setLocation(savedLocation);
              setLoading(false);
              return;
            }
          } catch (dbError) {
            console.log('Could not get saved location, will detect fresh:', dbError);
          }
        }

        // For non-logged-in users, check localStorage cache first
        if (!user) {
          const cachedLocation = getCachedGeolocation();
          if (cachedLocation) {
            console.log('✅ Using cached location for non-logged-in user:', cachedLocation);
            setLocation(cachedLocation);
            setLoading(false);
            return;
          }
        }

        // For both logged-in and non-logged-in users, detect location using backend proxy
        try {
          console.log('🔍 Detecting location via backend proxy...');
          const response = await fetch(buildApiUrl('/api/geolocation/detect'), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.log(`❌ Backend geolocation API failed with status: ${response.status}`);
            throw new Error(`Backend geolocation API failed with status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('📍 Backend Geolocation Response:', result);
          
          if (result.success && result.data) {
            const geolocationData = result.data;
            console.log('✅ Location detected:', geolocationData);
            console.log('🔍 Country Code Check:', {
              countryCode: geolocationData.countryCode,
              isIndianUser: geolocationData.countryCode === 'IN'
            });
            setLocation(geolocationData);
            
            // Cache the data for non-logged-in users
            if (!user) {
              cacheGeolocation(geolocationData);
            }
            
            // Save geolocation data to Firestore for logged-in users
            if (user) {
              try {
                await databaseService.updateUserGeolocation(user.uid, geolocationData);
                console.log('✅ Geolocation data saved to Firestore');
              } catch (dbError) {
                console.error('❌ Failed to save geolocation data:', dbError);
              }
            }
          } else {
            throw new Error('Invalid response from backend geolocation API');
          }
        } catch (apiError) {
          console.log('❌ Backend geolocation API error:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.log('❌ Could not detect country, using default IN (India):', error);
        const fallbackLocation = {
          countryCode: 'IN',
          countryName: 'India'
        };
        setLocation(fallbackLocation);
        setError('Could not detect location, using default India');
        
        // Cache the fallback data for non-logged-in users
        if (!user) {
          cacheGeolocation(fallbackLocation);
        }
      } finally {
        setLoading(false);
      }
    };

    detectUserLocation();
  }, [user]);

  // Debug logging for geolocation hook
  console.log('🌍 useGeolocation Debug:', {
    location,
    loading,
    error,
    countryCode: location?.countryCode || null,
    isIndianUser: location?.countryCode === 'IN'
  });

  return {
    location,
    loading,
    error,
    isIndianUser: location?.countryCode === 'IN',
    countryCode: location?.countryCode || null // Return null instead of 'US' when loading
  };
}; 