import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const AMAP_KEY = process.env.AMAP_KEY;
  
  if (!AMAP_KEY) {
    return response.status(500).json({ error: 'Missing API key configuration' });
  }

  return response.status(200).json({ key: AMAP_KEY });
} 