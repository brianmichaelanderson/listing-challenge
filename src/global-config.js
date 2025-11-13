/**
 * Global Configuration
 * Centralized config matching our main project pattern
 */

export const CONFIG = {
  appName: 'Property Listing Platform',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3032',

  // Mock mode is always enabled for this challenge
  mockMode: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',

  // API settings
  api: {
    timeout: 30000,
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3032',
  },

  // Auth settings (mocked)
  auth: {
    method: 'supabase',
    skip: false,
  },

  // Supabase (mocked)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key',
  },
};













