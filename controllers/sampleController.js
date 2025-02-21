// controllers/sampleController.js
const { getTenantClient } = require('../tenantDb');

exports.getTenantData = async (req, res) => {
  // Assume tenantId comes from a request header, subdomain, or authentication token
  const tenantId = req.headers['x-tenant-id']; 

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  let client;
  try {
    client = await getTenantClient(tenantId);
    const result = await client.query('SELECT * FROM some_table;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tenant data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Release the client back to the pool
    if (client) client.release();
  }
};
