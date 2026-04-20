import { createClient } from '@libsql/client/web';

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

export default async function handler(req, res) {
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
        const { nama, whatsapp } = req.body;
        
        if (!nama || !whatsapp) {
            res.status(400).json({ error: 'Nama dan WhatsApp wajib diisi' });
            return;
        }

        const result = await turso.execute({
            sql: `SELECT id, nama, whatsapp FROM peserta 
                  WHERE nama = ? AND whatsapp = ?
                  LIMIT 1`,
            args: [nama.trim(), whatsapp.trim()]
        });
        
        if (result.rows.length > 0) {
            res.status(200).json({ 
                success: true, 
                user: result.rows[0] 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Data tidak ditemukan. Pastikan nama dan nomor WhatsApp sudah terdaftar sebagai peserta.' 
            });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        res.status(500).json({ error: error.message });
    }
}
