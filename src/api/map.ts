export const getMapConfig = async () => {
  try {
    console.log('发起API请求获取地图配置')
    // 使用完整URL格式，确保在所有环境中正确解析
    const apiUrl = '/api/map-proxy'
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('API响应数据:', data)
    
    if (!data.key) {
      throw new Error('API响应中没有key字段')
    }
    
    return { key: data.key, success: true }
  } catch (error) {
    console.error('获取地图配置失败:', error)
    throw error
  }
} 