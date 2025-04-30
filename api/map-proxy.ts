import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse
) {
  const AMAP_KEY = process.env.AMAP_KEY

  if (!AMAP_KEY) {
    return response.status(500).json({ error: 'Missing API key configuration' })
  }

  // 返回加密后的key或token
  return response.status(200).json({
    key: AMAP_KEY,
    timestamp: Date.now(),
    // 可以添加其他安全措施，如签名等
  })
} 