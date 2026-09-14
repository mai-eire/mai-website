const https = require('https');

async function checkIpRestrictions() {
  console.log('Checking for IP restrictions on Supabase database...');
  
  // Get your public IP address
  try {
    const ipResponse = await new Promise((resolve, reject) => {
      https.get('https://api.ipify.org?format=json', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
    
    console.log('Your public IP address:', ipResponse.ip);
    console.log('\nIf your Supabase database has IP restrictions, you need to add this IP to the allowed list.');
    console.log('You can do this in the Supabase dashboard:');
    console.log('1. Go to your project');
    console.log('2. Navigate to Database > Settings > Network Restrictions');
    console.log('3. Add your IP address to the allowed list');
    console.log('\nFor Netlify deployments, functions use dynamic IPs, so you will likely need to allow all IPs (0.0.0.0/0)');
    console.log('or use Supabase connection pooling (recommended) instead of IP allowlisting.');
  } catch (error) {
    console.error('Error checking IP:', error);
  }
}

checkIpRestrictions(); 