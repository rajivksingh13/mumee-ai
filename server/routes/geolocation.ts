import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * Get user's geolocation by proxying external APIs
 */
router.get('/detect', async (req, res) => {
  try {
    const apis = [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json'
    ];

    let countryCode = null;
    let geolocationData = null;

    for (const api of apis) {
      try {
        console.log(`Trying geolocation API: ${api}`);
        const response = await axios.get(api, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MumeeAI/1.0'
          }
        });
        
        if (response.status !== 200) {
          console.log(`API ${api} failed with status: ${response.status}`);
          continue;
        }
        
        const data = response.data;
        console.log('Geolocation API Response:', data);
        
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

    if (countryCode && geolocationData) {
      res.json({
        success: true,
        data: geolocationData
      });
    } else {
      // Fallback to IN (India) if no API works
      res.json({
        success: true,
        data: {
          countryCode: 'IN',
          countryName: 'India'
        }
      });
    }
  } catch (error) {
    console.error('Geolocation detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect location',
      data: {
        countryCode: 'IN',
        countryName: 'India'
      }
    });
  }
});

export default router; 