export const getMapKey = async (): Promise<string> => {
  try {
    const response = await fetch('/api/map-proxy')
    const data = await response.json()
    if (!data.key) {
      throw new Error('Failed to get map key')
    }
    return data.key
  } catch (error) {
    console.error('Failed to fetch map key:', error)
    throw error
  }
} 