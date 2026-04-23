export const config = { runtime: 'edge' };

// Like/unlike endpoint for comments
export default async function handler(request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({
            error: 'Method not allowed'
        }), { status: 405, headers });
    }

    try {
        const body = await request.json();
        const { commentId, action, userWhatsapp } = body;

        if (!commentId || !action || !userWhatsapp) {
            return new Response(JSON.stringify({
                error: 'Missing required fields'
            }), { status: 400, headers });
        }

        // In production, you would update the database here
        // For now, just return success
        return new Response(JSON.stringify({
            success: true,
            message: action === 'like' ? 'Komentar disukai' : 'Like dibatalkan',
            data: {
                commentId,
                action,
                userWhatsapp,
                likes: action === 'like' ? 1 : 0 // Simulate like count
            }
        }), { status: 200, headers });

    } catch (error) {
        console.error('Like API Error:', error);
        
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }), { status: 500, headers });
    }
}