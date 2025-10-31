/**
 * @fileoverview API Configuration
 * 
 * Switch between API and Mock Data mode
 */

// Set to true to use mock data directly (no API calls)
// Set to false to use real API with mock data as fallback
// Default to false to sync with museum-portal changes in real-time
export const USE_MOCK_DATA_ONLY = process.env.NEXT_PUBLIC_USE_MOCK_DATA_ONLY === 'true';

