// tenantDb.js
const pool = require('./db');

/**
 * getTenantClient retrieves a pool client and sets the search_path to the tenant's schema.
 * @param {string} tenantId - Unique identifier for the tenant (e.g., "org1", "org2").
 * @returns {Promise<Client>} - A PostgreSQL client configured for the tenant.
 */
async function getTenantClient(tenantId) {
  // Get a client from the pool
  const client = await pool.connect();
  
  try {
    // Set the search_path for the tenant's schema
    // Note: Ensure that tenantId is sanitized/validated to avoid SQL injection.
    await client.query(`SET search_path TO ${tenantId}, public;`);
    return client;
  } catch (error) {
    // Release client in case of an error during schema switching
    client.release();
    throw error;
  }
}

module.exports = { getTenantClient };
