import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * Get user's geolocation by proxying external APIs
 */
router.get('/detect', async (req, res) => {
  try {
    // Get client's IP address (try multiple headers for different proxy setups)
    let clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.headers['x-client-ip'] ||
                   req.headers['cf-connecting-ip'] ||
                   req.headers['x-forwarded'] ||
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress || 
                   req.ip;
    
    // Clean up IP address (remove IPv6 prefix and port)
    if (clientIP) {
      let ipString = Array.isArray(clientIP) ? clientIP[0] : clientIP;
      
      // Handle x-forwarded-for which can contain multiple IPs
      if (ipString.includes(',')) {
        ipString = ipString.split(',')[0].trim();
      }
      clientIP = ipString.toString().replace(/^::ffff:/, '').split(':')[0];
    }
    
    console.log('🔍 Client IP detected:', clientIP);
    console.log('🔍 Request headers:', {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip'],
      'x-client-ip': req.headers['x-client-ip'],
      'cf-connecting-ip': req.headers['cf-connecting-ip']
    });
    
    // Use client IP if available, otherwise fall back to default APIs
    const apis = clientIP && clientIP !== 'undefined' && clientIP !== 'null' ? [
      `https://ipapi.co/${clientIP}/json/`,
      `https://ipinfo.io/${clientIP}/json`
    ] : [
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
      console.log('✅ Geolocation API success:', geolocationData);
      res.json({
        success: true,
        data: geolocationData
      });
    } else {
      // Fallback to IN (India) if no API works
      console.log('🔄 Geolocation API fallback to IN (India)');
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

// Test endpoint to check IP detection
router.get('/test-ip', (req, res) => {
  let clientIP = req.headers['x-forwarded-for'] || 
                 req.headers['x-real-ip'] || 
                 req.headers['x-client-ip'] ||
                 req.headers['cf-connecting-ip'] ||
                 req.headers['x-forwarded'] ||
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress || 
                 req.ip;
  
  // Clean up IP address
  if (clientIP) {
    let ipString = Array.isArray(clientIP) ? clientIP[0] : clientIP;
    
    // Handle x-forwarded-for which can contain multiple IPs
    if (ipString.includes(',')) {
      ipString = ipString.split(',')[0].trim();
    }
    clientIP = ipString.toString().replace(/^::ffff:/, '').split(':')[0];
  }
  
  res.json({
    clientIP,
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip'],
      'x-client-ip': req.headers['x-client-ip'],
      'cf-connecting-ip': req.headers['cf-connecting-ip'],
      'x-forwarded': req.headers['x-forwarded']
    }
  });
});

export default router; 