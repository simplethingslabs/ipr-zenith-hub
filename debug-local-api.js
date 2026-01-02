const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch in newer node

async function testApi() {
    console.log('🔍 Testing Local API Connectivity...');
    const baseUrl = 'http://localhost:3001/api';

    try {
        // 1. Test Health
        console.log('\n1. Checking Health Endpoint...');
        const health = await fetch('http://localhost:3001/health');
        console.log(`Status: ${health.status}`);
        console.log(`Response: ${await health.text()}`);

        // 2. Test Settings (Public)
        console.log('\n2. Checking Settings Endpoint (GET)...');
        const settings = await fetch(`${baseUrl}/settings`);
        console.log(`Status: ${settings.status}`);

        if (settings.ok) {
            const data = await settings.json();
            console.log('✅ Settings Loaded Successfully!');
            console.log('Firm Name:', data.firmName);
        } else {
            console.log('❌ Failed to load settings');
            console.log('Response:', await settings.text());
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('⚠️  Connection Refused! Is the backend server running on port 3001?');
        }
    }
}

testApi();
