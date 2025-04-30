export const getMapKey = async (): Promise<string> => {
  console.log('开始请求API密钥')
  try {
    console.log('发起API请求: /api/map-proxy')
    const response = await fetch('/api/map-proxy')
    console.log('API响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('API响应数据:', data)
    
    if (!data.key) {
      throw new Error('API响应中没有key字段')
    }
    
    return data.key
  } catch (error) {
    console.error('获取地图密钥失败:', error)
    throw error
  }
} 