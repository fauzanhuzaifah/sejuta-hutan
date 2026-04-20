export const config = { runtime: 'edge' };

import { createClient } from '@libsql/client/web';

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

export default async function handler(request) {
    const method = request.method;
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { 
            status: 200, 
            headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
        });
    }

    if (method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    }

    try {
        const body = await request.json();
        const { data } = body;
        
        if (!Array.isArray(data) || data.length === 0) {
            return new Response(JSON.stringify({ error: 'No data provided' }), { status: 400, headers });
        }

        let inserted = 0;
        for (const item of data) {
            if (!item.nama || !item.whatsapp) continue;
            
            try {
                await turso.execute({
                    sql: `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                    args: [
                        item.nama,
                        item.whatsapp,
                        item.email || null,
                        item.usia || null,
                        item.pekerjaan,
                        item.alamat,
                        item.jumlah_pohon || item.jumlah || 1,
                        item.motivasi
                    ]
                });
                inserted++;
            } catch (e) {
                console.error('Insert error:', e.message);
            }
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: `Migrated ${inserted} records`,
            total: data.length 
        }), { headers });
    } catch (error) {
        console.error('Migration error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
