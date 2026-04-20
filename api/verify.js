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
        const { nama, whatsapp } = body;
        
        if (!nama || !whatsapp) {
            return new Response(JSON.stringify({ error: 'Nama dan WhatsApp wajib diisi' }), { status: 400, headers });
        }

        // Normalize WhatsApp (strip leading 0)
        const normalizedWa = whatsapp.trim().startsWith('0') ? whatsapp.trim().substring(1) : whatsapp.trim();
        
        const result = await tursoQuery(
            `SELECT id, nama, whatsapp FROM peserta 
             WHERE nama = ? AND (whatsapp = ? OR whatsapp = ?)
             LIMIT 1`,
            [nama.trim(), normalizedWa, whatsapp.trim()]
        );
        
        if (result.length > 0) {
            return new Response(JSON.stringify({ success: true, user: result[0] }), { headers });
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
