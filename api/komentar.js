const { createClient } = require('@libsql/client');

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
});

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { id } = req.query;

        if (req.method === 'GET') {
            const result = await turso.execute(`
                SELECT k.*, p.id as peserta_id 
                FROM komentar k
                LEFT JOIN peserta p ON k.whatsapp = p.whatsapp
                WHERE k.is_deleted = false
                ORDER BY k.created_at ASC
            `);
            res.status(200).json(result.rows);
        }
        else if (req.method === 'POST') {
            const { nama, whatsapp, isi, parent_id } = req.body;
            
            await turso.execute({
                sql: `INSERT INTO komentar (nama, whatsapp, isi, parent_id, suka, created_at, is_deleted) 
                      VALUES (?, ?, ?, ?, 0, datetime('now'), 0)`,
                args: [nama, whatsapp, isi, parent_id || null]
            });
            
            res.status(201).json({ success: true, message: 'Comment added' });
        }
        else if (req.method === 'PATCH' && id) {
            // Toggle like
            const { action } = req.body;
            
            if (action === 'like') {
                await turso.execute({
                    sql: `UPDATE komentar SET suka = suka + 1 WHERE id = ?`,
                    args: [id]
                });
                res.status(200).json({ success: true, message: 'Liked' });
            } else {
                res.status(400).json({ error: 'Invalid action' });
            }
        }
        else if (req.method === 'DELETE' && id) {
            // Soft delete
            await turso.execute({
                sql: `UPDATE komentar SET is_deleted = 1, isi = '[Komentar telah dihapus]' WHERE id = ?`,
                args: [id]
            });
            res.status(200).json({ success: true, message: 'Comment deleted' });
        }
        else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
