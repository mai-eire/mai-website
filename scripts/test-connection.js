const { Client } = require('pg');

async function testConnection() {
  console.log('Testing connection to Supabase database...');
  
  const connectionString = 'postgresql://postgres:Mahmoud808$@db.oisbtpaptnztmbcohmww.supabase.co:5432/postgres';
  
  // Log connection details (without password)
  const urlObj = new URL(connectionString);
  console.log('Connection details:', {
    host: urlObj.hostname,
    port: urlObj.port,
    database: urlObj.pathname.substring(1),
    user: urlObj.username,
    hasPassword: !!urlObj.password,
  });
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000, // 10 seconds
  });
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection(); 