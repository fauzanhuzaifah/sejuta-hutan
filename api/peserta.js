export const config = { runtime: 'edge' };

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(request) {
    const method = request.method;
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { 
            status: 200, 
            headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
        });
    }

    try {
        if (method === 'GET') {
            const rows = await sql`SELECT * FROM peserta ORDER BY id DESC`;
            return new Response(JSON.stringify(rows), { headers });
        }
        else if (method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi } = body;
            
            await sql`
                INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                VALUES (${nama}, ${whatsapp}, ${email || null}, ${usia || null}, ${pekerjaan}, ${alamat}, ${jumlah_pohon || 1}, ${motivasi}, NOW())
            `;
            
            return new Response(JSON.stringify({ success: true, message: 'Data saved' }), { status: 201, headers });
        }
        else if (method === 'DELETE') {
            const url = new URL(request.url);
            const id = url.searchParams.get('id');
            
            if (id) {
                await sql`DELETE FROM peserta WHERE id = ${id}`;
            } else {
                await sql`DELETE FROM peserta`;
            }
            return new Response(JSON.stringify({ success: true, message: 'Data deleted' }), { headers });
        }
        else {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
        }
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
