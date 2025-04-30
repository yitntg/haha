import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    if (request.method !== 'GET') {
      return response.status(405).json({ error: 'Method not allowed' });
    }

    const API_KEY = process.env.AMAP_KEY;
    if (!API_KEY) {
      console.error('AMAP_KEY is not set');
      return response.status(500).json({ error: 'API key configuration error' });
    }

    // 返回API Key给前端
    return response.status(200).json({ key: API_KEY });
  } catch (error) {
    console.error('Unexpected error:', error);
    return response.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 