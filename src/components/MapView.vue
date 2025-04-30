<template>
  <div class="map-container">
    <div id="mapContainer" class="map"></div>
    <div v-if="error" class="error-message">
      <h3>{{ error.title }}</h3>
      <p>{{ error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getMapConfig } from '../api/map'

interface MapError {
  title: string
  message: string
}

const map = ref<any>(null)
const AMap = ref<any>(null)
const error = ref<MapError | null>(null)

onMounted(async () => {
  try {
    const { key } = await getMapConfig()
    
    if (!key) {
      throw new Error('MISSING_KEY')
    }

    const AMapInstance = await AMapLoader.load({
      key,
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

  } catch (err: any) {
    console.error('地图加载失败:', err)
    
    if (err.message === 'MISSING_KEY') {
      error.value = {
        title: '配置错误',
        message: '未找到高德地图API密钥，请检查环境变量配置'
      }
    } else if (err.message?.includes('invalid key')) {
      error.value = {
        title: 'API密钥无效',
        message: '高德地图API密钥无效，请检查配置'
      }
    } else if (err.message?.includes('network')) {
      error.value = {
        title: '网络错误',
        message: '网络连接失败，请检查网络设置'
      }
    } else {
      error.value = {
        title: '加载失败',
        message: '地图加载失败，请刷新页面重试'
      }
    }
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
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
  text-align: center;
}

.error-message h3 {
  margin: 0 0 10px 0;
}

.error-message p {
  margin: 0;
}
</style> 