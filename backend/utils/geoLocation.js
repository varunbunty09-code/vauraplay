const axios = require('axios');

/**
 * Get location from IP address using ip-api.com (free, no API key needed)
 * Returns { city, region, country } or fallback values
 */
const getLocationFromIP = async (ip) => {
  try {
    // Skip private/local IPs
    const privateIPs = ['127.0.0.1', '::1', 'localhost', '0.0.0.0'];
    if (privateIPs.includes(ip) || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
      return { city: 'Local Network', region: '', country: '', query: ip };
    }

    const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=status,city,regionName,country,query`, {
      timeout: 3000, // 3 second timeout
    });

    if (data.status === 'success') {
      return {
        city: data.city || 'Unknown',
        region: data.regionName || '',
        country: data.country || '',
        query: data.query || ip,
      };
    }

    return { city: 'Unknown', region: '', country: '', query: ip };
  } catch (error) {
    console.error('Geolocation lookup failed:', error.message);
    return { city: 'Unknown', region: '', country: '', query: ip };
  }
};

/**
 * Format location object to a readable string
 */
const formatLocation = (location) => {
  if (!location) return 'Unknown Location';
  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
};

module.exports = { getLocationFromIP, formatLocation };
