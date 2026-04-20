export const config = { runtime: 'edge' };

const TURSO_URL = process.env.TURSO_URL;
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
            headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
        });
    }

    try {
        if (method === 'GET') {
            const rows = await tursoQuery('SELECT * FROM peserta ORDER BY id DESC');
            return new Response(JSON.stringify(rows), { headers });
        }
        else if (method === 'POST') {
            const body = await request.json();
            const { nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi } = body;
            
            await tursoQuery(
                `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [nama, whatsapp, email || null, usia || null, pekerjaan, alamat, jumlah_pohon || 1, motivasi]
            );
            
            return new Response(JSON.stringify({ success: true, message: 'Data saved' }), { status: 201, headers });
        }
        else if (method === 'DELETE') {
            await tursoQuery('DELETE FROM peserta');
            return new Response(JSON.stringify({ success: true, message: 'All data cleared' }), { headers });
        }
        else {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
        }
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
}
