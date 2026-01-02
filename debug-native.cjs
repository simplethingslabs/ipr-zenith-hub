const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function testApi() {
    console.log('🔍 Testing Local API Connectivity (Native HTTP)...');

    try {
        // 1. Test Health
        console.log('\n1. Checking Health Endpoint...');
        const health = await get('http://localhost:3001/health');
        console.log(`Status: ${health.status}`);
        console.log(`Response: ${health.data}`);

        // 2. Test Settings
        console.log('\n2. Checking Settings Endpoint (GET)...');
        const settings = await get('http://localhost:3001/api/settings');
        console.log(`Status: ${settings.status}`);
        console.log(`Response: ${settings.data.substring(0, 100)}...`); // Truncate

        // 3. Authenticate
        console.log('\n3. Authenticating...');
        const loginPayload = JSON.stringify({
            email: "sahil09pr@gmail.com",
            password: "M07Choudhary"
        });

        const loginReq = await new Promise((resolve, reject) => {
            const req = http.request('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': loginPayload.length
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, data }));
            });
            req.on('error', reject);
            req.write(loginPayload);
            req.end();
        });

        let token = '';
        if (loginReq.status === 200) {
            const loginData = JSON.parse(loginReq.data);
            token = loginData.token;
            console.log('✅ Authenticated! Token received.');
        } else {
            console.error('❌ Authentication Failed:', loginReq.data);
            return;
        }

        // 4. Test Settings Update (PUT)
        console.log('\n4. Checking Settings Update (PUT)...');
        const updatePayload = JSON.stringify({
            firmName: "IPR Central",
            tagline: "Protecting Your Intellectual Property",
            bio: "IPR Central is a leading intellectual property consultancy dedicated to helping businesses and individuals protect their innovations, brands, and creative works.",
            email: "sahil09pr@gmail.com",
            phone: "+91 98765 43210",
            whatsapp: "+919876543210",
            heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
            address: {
                line: "123 IP Tower, Business District",
                city: "Mumbai",
                state: "Maharashtra",
                postalCode: "400001"
            },
            socialLinks: {
                linkedin: "",
                twitter: "",
                facebook: ""
            }
        });

        const updateReq = await new Promise((resolve, reject) => {
            const req = http.request('http://localhost:3001/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': updatePayload.length,
                    'Authorization': `Bearer ${token}`
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, data }));
            });
            req.on('error', reject);
            req.write(updatePayload);
            req.end();
        });

        console.log(`Status: ${updateReq.status}`);
        console.log(`Response: ${updateReq.data}`);

    } catch (error) {
        console.error('❌ Connection Error:', error.message);
    }
}

testApi();
