<template>
  <div class="map-container">
    <div id="mapContainer" class="map"></div>
    <div v-if="error" class="error-message">
      <h3>{{ error.title }}</h3>
      <p>{{ error.message }}</p>
      <pre v-if="errorDetails" class="error-details">{{ errorDetails }}</pre>
    </div>
    <div class="loading-indicator" v-if="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getMapKey } from '../config'

interface MapError {
  title: string
  message: string
}

const map = ref<any>(null)
const AMap = ref<any>(null)
const error = ref<MapError | null>(null)
const loading = ref(true)
const errorDetails = ref('')

onMounted(async () => {
  console.log('MapView组件已挂载')
  try {
    loading.value = true
    console.log('开始获取地图API密钥')
    
    let key
    try {
      key = await getMapKey()
      console.log('成功获取API密钥:', key ? '密钥有效' : '密钥为空')
    } catch (apiError: any) {
      console.error('获取API密钥失败:', apiError)
      errorDetails.value = `API密钥获取错误: ${JSON.stringify(apiError, null, 2)}`
      throw new Error('API_KEY_FETCH_ERROR')
    }
    
    if (!key) {
      console.error('API密钥为空')
      throw new Error('MISSING_KEY')
    }

    console.log('开始加载高德地图')
    const AMapInstance = await AMapLoader.load({
      key,
      version: "2.0",
      plugins: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.HawkEye',
        'AMap.Geolocation'
      ]
    })
    
    console.log('高德地图加载成功')
    AMap.value = AMapInstance
    map.value = new AMapInstance.Map('mapContainer', {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: '3D',
      resizeEnable: true
    })

    console.log('地图实例创建成功')
    // 添加地图控件
    map.value.addControl(new AMapInstance.Scale())
    map.value.addControl(new AMapInstance.ToolBar())
    map.value.addControl(new AMapInstance.HawkEye())
    
    console.log('地图控件添加成功')
    loading.value = false

  } catch (err: any) {
    loading.value = false
    console.error('地图加载失败:', err)
    errorDetails.value = `错误详情: ${err.message || JSON.stringify(err)}`
    
    if (err.message === 'API_KEY_FETCH_ERROR') {
      error.value = {
        title: 'API请求错误',
        message: '无法从服务器获取地图API密钥，请检查网络连接'
      }
    } else if (err.message === 'MISSING_KEY') {
      error.value = {
        title: '配置错误',
        message: '未找到高德地图API密钥，请检查服务器配置'
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

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 999;
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
  max-width: 80%;
}

.error-message h3 {
  margin: 0 0 10px 0;
}

.error-message p {
  margin: 0 0 10px 0;
}

.error-details {
  text-align: left;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}
</style> 