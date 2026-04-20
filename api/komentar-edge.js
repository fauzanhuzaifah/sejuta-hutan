export const config = { runtime: 'edge' };

import { createClient } from '@libsql/client/web';

export default async function handler(request) {
    const url = new URL(request.url);
    const method = request.method;
    const id = url.searchParams.get('id');
    
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
            headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
        });
    }

    try {
        if (method === 'GET') {
            const result = await turso.execute(`
                SELECT k.*, p.id as peserta_id 
                FROM komentar k
                LEFT JOIN peserta p ON k.whatsapp = p.whatsapp
                WHERE k.is_deleted = false
                ORDER BY k.created_at ASC
            `);
            return new Response(JSON.stringify(result.rows), { headers });
        }
        else if (method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, isi, parent_id } = body;
            
            await turso.execute({
                sql: `INSERT INTO komentar (nama, whatsapp, isi, parent_id, suka, created_at, is_deleted) 
                      VALUES (?, ?, ?, ?, 0, datetime('now'), 0)`,
                args: [nama, whatsapp, isi, parent_id || null]
            });
            
            return new Response(JSON.stringify({ success: true, message: 'Comment added' }), { status: 201, headers });
        }
        else if (method === 'PATCH' && id) {
            const body = await request.json();
            const { action } = body;
            
            if (action === 'like') {
                await turso.execute({
                    sql: `UPDATE komentar SET suka = suka + 1 WHERE id = ?`,
                    args: [parseInt(id)]
                });
                return new Response(JSON.stringify({ success: true, message: 'Liked' }), { headers });
            } else {
                return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
            }
        }
        else if (method === 'DELETE' && id) {
            await turso.execute({
                sql: `UPDATE komentar SET is_deleted = 1, isi = '[Komentar telah dihapus]' WHERE id = ?`,
                args: [parseInt(id)]
            });
            return new Response(JSON.stringify({ success: true, message: 'Comment deleted' }), { headers });
        }
        else {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
        }
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
