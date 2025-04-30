<template>
  <div class="map-container">
    <div id="mapContainer"></div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const map = ref(null)
const AMap = ref(null)
const error = ref('')

onMounted(async () => {
  try {
    const AMapInstance = await AMapLoader.load({
      key: import.meta.env.AMAP_KEY,
      version: "2.0",
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.HawkEye',
        'AMap.Geolocation',
        'AMap.MarkerClusterer'
      ]
    })
    
    AMap.value = AMapInstance
    map.value = new AMapInstance.Map('mapContainer', {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: '3D',
      resizeEnable: true
    })

    // 添加地图控件
    map.value.addControl(new AMapInstance.Scale())
    map.value.addControl(new AMapInstance.ToolBar())
    map.value.addControl(new AMapInstance.HawkEye())
    
    // 添加定位控件
    const geolocation = new AMapInstance.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'RB',
      buttonOffset: new AMapInstance.Pixel(10, 20),
      zoomToAccuracy: true
    })
    map.value.addControl(geolocation)

  } catch (err) {
    console.error('地图加载失败:', err)
    error.value = '地图加载失败，请检查网络连接和API配置'
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 1000;
}
</style> 