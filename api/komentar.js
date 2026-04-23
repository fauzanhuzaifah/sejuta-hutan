export const config = { runtime: 'edge' };

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
                    args: args.map(a => a === null ? { type: 'null' } : { type: 'text', value: String(a) })
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
            const rows = await tursoQuery('SELECT * FROM komentar ORDER BY created_at DESC');
            return new Response(JSON.stringify(rows), { status: 200, headers });
        }

        if (request.method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, isi, parent_id } = body;
            
            // Look up participant to get peserta_id
            let pesertaId = null;
            const normalizedWa = whatsapp.startsWith('0') ? whatsapp.substring(1) : whatsapp;
            const participants = await tursoQuery(
                'SELECT id FROM peserta WHERE nama = ? AND (whatsapp = ? OR whatsapp = ?)',
                [nama, normalizedWa, whatsapp]
            );
            
            if (participants.length === 0) {
                return new Response(JSON.stringify({ success: false, message: 'Nama dan nomor WhatsApp tidak terdaftar.' }), { status: 403, headers });
            }

            const pesertaId = participants[0].id;
            
            await tursoQuery(
                `INSERT INTO komentar (nama, whatsapp, isi, parent_id, peserta_id, suka, created_at) 
                 VALUES (?, ?, ?, ?, ?, 0, datetime('now'))`,
                [nama, whatsapp, isi, parent_id || null, pesertaId]
            );
            
            return new Response(JSON.stringify({ success: true, message: 'Komentar berhasil dikirim' }), { status: 200, headers });
        }

        if (request.method === 'PATCH') {
            const body = await request.json();
            const { id, suka } = body;
            
            await tursoQuery('UPDATE komentar SET suka = ? WHERE id = ?', [suka, id]);
            return new Response(JSON.stringify({ success: true }), { status: 200, headers });
        }

        if (request.method === 'DELETE') {
            const url = new URL(request.url);
            const id = url.searchParams.get('id');
            
            if (!id) {
                return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers });
            }

            await tursoQuery('DELETE FROM komentar WHERE id = ?', [id]);
            return new Response(JSON.stringify({ success: true, message: 'Komentar berhasil dihapus' }), { status: 200, headers });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    } catch (error) {
        console.error('Comments API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}