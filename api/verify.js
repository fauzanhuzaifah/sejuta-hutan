export const config = { runtime: 'edge' };

import { createClient } from '@libsql/client/web';

export default async function handler(request) {
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
            headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
        });
    }

    if (method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    }

    try {
        const body = await request.json();
        const { nama, whatsapp } = body;
        
        if (!nama || !whatsapp) {
            return new Response(JSON.stringify({ error: 'Nama dan WhatsApp wajib diisi' }), { status: 400, headers });
        }

        const result = await turso.execute({
            sql: `SELECT id, nama, whatsapp FROM peserta 
                  WHERE nama = ? AND whatsapp = ?
                  LIMIT 1`,
            args: [nama.trim(), whatsapp.trim()]
        });
        
        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, user: result.rows[0] }), { headers });
        } else {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Data tidak ditemukan. Pastikan nama dan nomor WhatsApp sudah terdaftar sebagai peserta.' 
            }), { status: 404, headers });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
