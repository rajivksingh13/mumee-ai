/**
 * Currency utilities for handling pricing display based on user location
 */

// Exchange rate (you can update this or fetch from an API)
const USD_TO_INR_RATE = 83.5; // Approximate rate, can be updated

export interface PriceDisplay {
  amount: number;
  currency: string;
  symbol: string;
  formattedPrice: string;
}

/**
 * Convert INR price to USD
 */
export const convertINRToUSD = (inrPrice: number): number => {
  return Math.round((inrPrice / USD_TO_INR_RATE) * 100) / 100; // Round to 2 decimal places
};

/**
 * Get price display based on user's country
 */
export const getPriceDisplay = (inrPrice: number, userCountryCode?: string): PriceDisplay => {
  // Default to INR if country code is not available
  const isIndianUser = userCountryCode === 'IN';
  
  console.log('💰 getPriceDisplay Debug:', {
    inrPrice,
    userCountryCode,
    isIndianUser
  });
  
  if (isIndianUser) {
    return {
      amount: inrPrice,
      currency: 'INR',
      symbol: '₹',
      formattedPrice: `₹${inrPrice.toLocaleString('en-IN')}`
    };
  } else {
    const usdPrice = convertINRToUSD(inrPrice);
    return {
      amount: usdPrice,
      currency: 'USD',
      symbol: '$',
      formattedPrice: `$${usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  }
};

/**
 * Get workshop pricing based on level and user country
 */
export const getWorkshopPricing = (level: 'beginner' | 'foundation' | 'advanced', userCountryCode?: string): PriceDisplay => {
  const pricing = {
    beginner: 0, // Free
    foundation: 2999,
    advanced: 5999
  };
  
  const inrPrice = pricing[level];
  
  if (level === 'beginner') {
    return {
      amount: 0,
      currency: 'FREE',
      symbol: '',
      formattedPrice: 'Free'
    };
  }
  
  return getPriceDisplay(inrPrice, userCountryCode);
};

/**
 * Format price for display with currency symbol
 */
export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'USD') {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (currency === 'INR') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return `${price}`;
};

/**
 * Get currency symbol based on currency code
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£'
  };
  return symbols[currency] || currency;
}; 