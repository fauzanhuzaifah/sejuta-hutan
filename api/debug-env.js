export const config = { runtime: 'edge' };

export default async function handler(request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers });
    }

    try {
        // Check environment variables (without exposing sensitive data)
        const envStatus = {
            TURSO_URL: process.env.TURSO_URL ? '✅ Configured' : '❌ Missing',
            TURSO_TOKEN: process.env.TURSO_TOKEN ? '✅ Configured' : '❌ Missing',
            NODE_ENV: process.env.NODE_ENV || 'production',
            VERCEL_URL: process.env.VERCEL_URL || 'Not set',
            VERCEL_ENV: process.env.VERCEL_ENV || 'Not set'
        };

        // Check request headers
        const requestHeaders = {};
        for (const [key, value] of request.headers.entries()) {
            requestHeaders[key] = value;
        }

        // Get request info
        const url = new URL(request.url);
        
        const debugInfo = {
            timestamp: new Date().toISOString(),
            environment: envStatus,
            request: {
                method: request.method,
                url: url.toString(),
                origin: request.headers.get('origin'),
                userAgent: request.headers.get('user-agent'),
                headers: requestHeaders
            },
            system: {
                runtime: 'edge',
                region: process.env.VERCEL_REGION || 'unknown'
            }
        };

        return new Response(JSON.stringify(debugInfo, null, 2), { 
            status: 200, 
            headers 
        });

    } catch (error) {
        console.error('Debug endpoint error:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            timestamp: new Date().toISOString()
        }), { 
            status: 500, 
            headers 
        });
    }
}