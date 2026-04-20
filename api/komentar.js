export const config = { runtime: 'edge' };

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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
            const rows = await sql`SELECT * FROM komentar ORDER BY created_at DESC`;
            return new Response(JSON.stringify(rows), { status: 200, headers });
        }

        if (request.method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, isi, parent_id, peserta_id } = body;

            const result = await sql`
                INSERT INTO komentar (nama, whatsapp, isi, parent_id, peserta_id, created_at) 
                VALUES (${nama}, ${whatsapp}, ${isi}, ${parent_id || null}, ${peserta_id || null}, NOW())
                RETURNING *
            `;
            
            return new Response(JSON.stringify(result[0]), { status: 200, headers });
        }

        if (request.method === 'PATCH') {
            const body = await request.json();
            const { id, suka } = body;

            const result = await sql`
                UPDATE komentar SET suka = ${suka} WHERE id = ${id}
                RETURNING *
            `;
            
            return new Response(JSON.stringify(result[0]), { status: 200, headers });
        }

        if (request.method === 'DELETE') {
            const url = new URL(request.url);
            const id = url.searchParams.get('id');
            
            if (!id) {
                return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers });
            }

            await sql`DELETE FROM komentar WHERE id = ${id}`;
            return new Response(JSON.stringify({ success: true, message: 'Komentar berhasil dihapus' }), { status: 200, headers });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

    } catch (error) {
        console.error('Comments API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}