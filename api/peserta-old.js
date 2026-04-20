const { createClient } = require('@libsql/client');

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

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
            const result = await turso.execute('SELECT * FROM peserta ORDER BY id DESC');
            res.status(200).json(result.rows);
        }
        else if (req.method === 'POST') {
            const { nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi } = req.body;
            
            await turso.execute({
                sql: `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                args: [nama, whatsapp, email || null, usia || null, pekerjaan, alamat, jumlah_pohon || 1, motivasi]
            });
            
            res.status(201).json({ success: true, message: 'Data saved' });
        }
        else if (req.method === 'DELETE') {
            await turso.execute('DELETE FROM peserta');
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
