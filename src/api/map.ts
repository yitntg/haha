export const getMapConfig = async () => {
  try {
    console.log('发起API请求获取地图配置')
    const response = await fetch('/api/map-proxy')
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.key) {
      throw new Error('API响应中没有key字段')
    }
    
    return { key: data.key, success: true }
  } catch (error) {
    console.error('获取地图配置失败:', error)
    throw error
  }
} 