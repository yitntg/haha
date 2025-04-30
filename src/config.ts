export const getMapKey = async () => {
  const response = await fetch('/api/map-proxy')
  const data = await response.json()
  if (!data.key) {
    throw new Error('Failed to get map key')
  }
  return data.key
} 