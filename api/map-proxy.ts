import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse
) {
  console.log('API请求已接收: map-proxy')
  
  try {
    const AMAP_KEY = process.env.AMAP_KEY
    console.log('环境变量AMAP_KEY:', AMAP_KEY ? '已设置' : '未设置')

    if (!AMAP_KEY) {
      console.error('未找到AMAP_KEY环境变量')
      return response.status(500).json({ 
        error: 'Missing API key configuration',
        env: Object.keys(process.env).filter(key => !key.includes('TOKEN') && !key.includes('SECRET'))
      })
    }

    console.log('返回AMAP_KEY')
    return response.status(200).json({
      key: AMAP_KEY,
      timestamp: Date.now(),
      success: true
    })
  } catch (error) {
    console.error('API处理错误:', error)
    return response.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
} 