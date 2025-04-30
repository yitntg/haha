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
    
    // 在开发环境中，使用备用密钥以便调试
    if (process.env.NODE_ENV === 'development') {
      console.warn('API请求失败，使用备用开发密钥')
      return { 
        key: '您的测试API密钥', // 请替换为您的实际开发密钥
        success: true 
      }
    }
    
    throw error
  }
} 