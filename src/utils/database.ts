// =====================================================
// GroceryMind - Database Utilities (Browser-side)
// =====================================================

// Database configuration for browser-side operations
// Note: For production, use the backend API instead

const DB_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

/**
 * Execute a query on the database
 * @param text - SQL query text
 * @param params - Query parameters
 */
export async function query(text: string, params?: any[]): Promise<any> {
  try {
    const response = await fetch(`${DB_CONFIG.API_URL}/api/db/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, params }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Query failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a query and return a single row
 * @param text - SQL query text
 * @param params - Query parameters
 */
export async function queryOne(text: string, params?: any[]): Promise<any> {
  const result = await query(text, params);
  return result?.rows?.[0] || null;
}