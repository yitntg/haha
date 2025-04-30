import { getMapKey } from '../config'

export const getMapConfig = async () => {
  try {
    const key = await getMapKey()
    return { key, success: true }
  } catch (error) {
    console.error('获取地图配置失败:', error)
    throw error
  }
} 