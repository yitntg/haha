import { VercelRequest, VercelResponse } from '@vercel/node';
import { AMAP_KEY } from '../src/config';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  return response.status(200).json({ key: AMAP_KEY });
} 