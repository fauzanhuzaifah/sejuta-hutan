const { createClient } = require('@libsql/client');

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { data } = req.body;
        
        if (!Array.isArray(data) || data.length === 0) {
            res.status(400).json({ error: 'No data provided' });
            return;
        }

        let inserted = 0;
        for (const item of data) {
            if (!item.nama || !item.whatsapp) continue;
            
            try {
                await turso.execute({
                    sql: `INSERT INTO peserta (nama, whatsapp, email, usia, pekerjaan, alamat, jumlah_pohon, motivasi, created_at) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        item.nama,
                        item.whatsapp,
                        item.email || null,
                        item.usia || null,
                        item.pekerjaan,
                        item.alamat,
                        item.jumlah_pohon || item.jumlah || 1,
                        item.motivasi,
                        item.created_at || new Date().toISOString()
                    ]
                });
                inserted++;
            } catch (e) {
                console.error('Insert error:', e.message);
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Migrated ${inserted} records`,
            total: data.length 
        });
    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ error: error.message });
    }
}
