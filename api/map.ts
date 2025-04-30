import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 这里应该从环境变量中获取API Key
  const key = process.env.AMAP_KEY || 'your-amap-key';
  
  res.status(200).json({ key });
} 