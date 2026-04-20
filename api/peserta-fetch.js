// API peserta dengan fetch HTTP ke Turso
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
            requests: [{ type: 'execute', stmt: { sql, args } }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Turso HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results[0]?.response?.result?.rows || [];
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const rows = await tursoQuery('SELECT * FROM peserta ORDER BY id DESC');
            res.status(200).json(rows);
        }
        else if (req.method === 'POST') {
            const { nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi } = req.body;
            
            await tursoQuery(
                `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [nama, whatsapp, email || null, usia || null, pekerjaan, alamat, jumlah_pohon || 1, motivasi]
            );
            
            res.status(201).json({ success: true, message: 'Data saved' });
        }
        else if (req.method === 'DELETE') {
            await tursoQuery('DELETE FROM peserta');
            res.status(200).json({ success: true, message: 'All data cleared' });
        }
        else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
