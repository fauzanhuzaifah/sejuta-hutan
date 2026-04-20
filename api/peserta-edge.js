export const config = {
    runtime: 'edge'
};

import { createClient } from '@libsql/client/web';

export default async function handler(request) {
    const url = new URL(request.url);
    const method = request.method;
    
    const turso = createClient({
        url: process.env.TURSO_URL,
        authToken: process.env.TURSO_TOKEN
    });

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { 
            status: 200, 
            headers: {
                ...headers,
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    try {
        if (method === 'GET') {
            const result = await turso.execute('SELECT * FROM peserta ORDER BY id DESC');
            return new Response(JSON.stringify(result.rows), { headers });
        }
        else if (method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi } = body;
            
            await turso.execute({
                sql: `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                args: [nama, whatsapp, email || null, usia || null, pekerjaan, alamat, jumlah_pohon || 1, motivasi]
            });
            
            return new Response(JSON.stringify({ success: true, message: 'Data saved' }), { 
                status: 201, 
                headers 
            });
        }
        else if (method === 'DELETE') {
            await turso.execute('DELETE FROM peserta');
            return new Response(JSON.stringify({ success: true, message: 'All data cleared' }), { headers });
        }
        else {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
                status: 405, 
                headers 
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers 
        });
    }
}
