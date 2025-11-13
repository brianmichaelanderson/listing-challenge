/**
 * Mock Supabase Client
 * Simulates Supabase API without real database connection
 *
 * IMPORTANT: This is a mock. In production, we use real Supabase.
 */

// Mock user data
const MOCK_USER = {
  id: 'test-user-123',
  email: 'candidate@example.com',
  created_at: '2024-01-01T00:00:00Z',
};

// Mock listing progress data (using object to allow mutation for mock updates)
let MOCK_PROGRESS = {
  id: 'progress-123',
  user_id: 'test-user-123',
  current_step: 'step-1',
  progress_data: {
    completedSteps: ['step-1'],
    step1: {
      selectedPropertyId: 'prop-456',
      propertyAddress: '123 Main Street, San Francisco, CA 94102',
    },
  },
  updated_at: new Date().toISOString(),
};

// Mock properties list
const MOCK_PROPERTIES = [
  {
    id: 'prop-456',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    estimated_value: 850000,
  },
  {
    id: 'prop-789',
    address: '456 Oak Avenue',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    estimated_value: 650000,
  },
];

/**
 * Mock Supabase Client
 * Mimics the real Supabase client API
 */
export const supabase = {
  /**
   * Database query builder
   */
  from: (table) => {
    // Track which table is being queried
    const tableData = {
      listing_progress: [MOCK_PROGRESS],
      properties: MOCK_PROPERTIES,
    };

    let selectedTable = table;
    let updateData = null;
    let whereFilters = [];

    // Helper to get current table data (always fresh from MOCK_PROGRESS)
    const getCurrentTableData = () => {
      const currentTableData = {
        listing_progress: [MOCK_PROGRESS],
        properties: MOCK_PROPERTIES,
      };
      return currentTableData[selectedTable] || [];
    };

    const selectQuery = {
      eq: (column, value) => {
        whereFilters.push({ column, value });
        return {
          single: () => {
            // Return first matching record (always get fresh data)
            const currentData = getCurrentTableData();
            const data = currentData?.[0] || null;
            console.log(`[MOCK] SELECT from ${selectedTable} WHERE ${column} = ${value}`);
            return Promise.resolve({ data, error: null });
          },
          maybeSingle: () => {
            // Return first matching record or null (always get fresh data)
            const currentData = getCurrentTableData();
            const data = currentData?.[0] || null;
            console.log(`[MOCK] SELECT from ${selectedTable} WHERE ${column} = ${value}`);
            return Promise.resolve({ data, error: null });
          },
        };
      },
    };

    // Make selectQuery awaitable directly (for queries without .eq())
    selectQuery.then = (resolve, reject) => {
      const data = getCurrentTableData();
      console.log(`[MOCK] SELECT from ${selectedTable} (all records)`);
      return Promise.resolve({ data, error: null }).then(resolve, reject);
    };
    selectQuery.catch = (reject) => {
      return Promise.resolve({ data: [], error: null }).catch(reject);
    };

    return {
      select: (columns = '*') => selectQuery,

      update: (data) => {
        updateData = data;
        return {
          eq: (column, value) => {
            whereFilters.push({ column, value });
            return {
              select: () => {
                // Merge update data with existing mock data
                // Deep merge progress_data if it exists
                let updated = { ...MOCK_PROGRESS };

                if (data.progress_data && MOCK_PROGRESS.progress_data) {
                  updated = {
                    ...updated,
                    ...updateData,
                    progress_data: {
                      ...MOCK_PROGRESS.progress_data,
                      ...updateData.progress_data,
                    },
                    updated_at: new Date().toISOString(),
                  };
                } else {
                  updated = {
                    ...updated,
                    ...updateData,
                    updated_at: new Date().toISOString(),
                  };
                }

                // Update the mock data for persistence
                Object.assign(MOCK_PROGRESS, updated);

                console.log(`[MOCK] UPDATE ${selectedTable} SET`, updateData, `WHERE ${column} = ${value}`);
                return {
                  single: () => Promise.resolve({ data: updated, error: null }),
                };
              },
            };
          },
        };
      },

      insert: (data) => {
        console.log(`[MOCK] INSERT into ${selectedTable}`, data);
        const newRecord = {
          ...data,
          id: `mock-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return {
          select: () => ({
            single: () => Promise.resolve({ data: newRecord, error: null }),
          }),
        };
      },
    };
  },

  /**
   * Auth methods
   */
  auth: {
    /**
     * Get user from auth token
     * @param {string} token - JWT token
     */
    getUser: (token) => {
      console.log(`[MOCK] auth.getUser() called with token:`, token?.substring(0, 20) + '...');

      // Simulate token validation
      if (!token || token === 'invalid-token') {
        return Promise.resolve({
          data: { user: null },
          error: { message: 'Invalid token' },
        });
      }

      // Return mock user
      return Promise.resolve({
        data: { user: MOCK_USER },
        error: null,
      });
    },

    /**
     * Get current session
     */
    getSession: () => {
      console.log(`[MOCK] auth.getSession() called`);
      return Promise.resolve({
        data: {
          session: {
            access_token: 'mock-access-token',
            user: MOCK_USER,
          },
        },
        error: null,
      });
    },
  },
};

// Export mock user for testing
export const MOCK_USER_DATA = MOCK_USER;
export const MOCK_PROGRESS_DATA = MOCK_PROGRESS;
