export const config = { runtime: 'edge' };

// Convert libsql:// to https:// for HTTP API
const rawUrl = process.env.TURSO_URL || '';
const TURSO_URL = rawUrl.replace(/^libsql:\/\//, 'https://');
const TURSO_TOKEN = process.env.TURSO_TOKEN;

async function tursoQuery(sql, args = []) {
    const response = await fetch(`${TURSO_URL}/v2/pipeline`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TURSO_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requests: [{ 
                type: 'execute', 
                stmt: { 
                    sql, 
                    args: args.map(a => a === null ? { type: 'null' } : 
                             typeof a === 'number' ? { type: 'integer', value: a } : 
                             { type: 'text', value: String(a) })
                } 
            }]
        })
    });
    
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Turso HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    const result = data.results?.[0]?.response?.result;
    
    if (!result || !result.cols) return [];
    
    return (result.rows || []).map(row => {
        const obj = {};
        result.cols.forEach((col, i) => {
            const val = row[i];
            obj[col.name] = val?.value ?? null;
        });
        return obj;
    });
}

export default async function handler(request) {
    const url = new URL(request.url);
    const method = request.method;
    const id = url.searchParams.get('id');
    
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
            const rows = await tursoQuery(`
                SELECT k.*, p.id as peserta_id 
                FROM komentar k
                LEFT JOIN peserta p ON k.whatsapp = p.whatsapp
                WHERE k.is_deleted = 0
                ORDER BY k.created_at ASC
            `);
            return new Response(JSON.stringify(rows), { headers });
        }
        else if (method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, isi, parent_id } = body;
            
            await tursoQuery(
                `INSERT INTO komentar (nama, whatsapp, isi, parent_id, suka, created_at, is_deleted) 
                 VALUES (?, ?, ?, ?, 0, datetime('now'), 0)`,
                [nama, whatsapp, isi, parent_id || null]
            );
            
            return new Response(JSON.stringify({ success: true, message: 'Comment added' }), { status: 201, headers });
        }
        else if (method === 'PATCH' && id) {
            const body = await request.json();
            const { action } = body;
            
            if (action === 'like') {
                await tursoQuery(`UPDATE komentar SET suka = suka + 1 WHERE id = ?`, [parseInt(id)]);
                return new Response(JSON.stringify({ success: true, message: 'Liked' }), { headers });
            } else {
                return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
            }
        }
        else if (method === 'DELETE' && id) {
            await tursoQuery(
                `UPDATE komentar SET is_deleted = 1, isi = '[Komentar telah dihapus]' WHERE id = ?`, 
                [parseInt(id)]
            );
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
