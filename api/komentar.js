export const config = { runtime: 'edge' };

export default async function handler(request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers });
    }

    try {
        if (request.method === 'GET') {
            return new Response(JSON.stringify([]), { status: 200, headers });
        }

        if (request.method === 'POST') {
            const body = await request.json();
            return new Response(JSON.stringify({ success: true }), { status: 200, headers });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}