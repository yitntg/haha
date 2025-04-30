<template>
  <div id="mapContainer" class="map-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      AMap: null,
      error: null
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {
        // 请使用高德地图Web端Key
        // 获取方式：
        // 1. 访问 https://lbs.amap.com/
        // 2. 进入控制台
        // 3. 创建新应用
        // 4. 在"Key管理"中获取Web端Key（这种Key是专门用于前端的，可以安全使用）
        const AMap = await AMapLoader.load({
          key: process.env.VUE_APP_AMAP_KEY,
          version: "2.0",
          plugins: [
            'AMap.Scale',
            'AMap.ToolBar',
            'AMap.HawkEye',
            'AMap.Geolocation', // 添加定位插件
            'AMap.MarkerClusterer' // 添加点聚合插件
          ]
        });
        
        this.AMap = AMap;
        this.map = new AMap.Map('mapContainer', {
          zoom: 11,
          center: [116.397428, 39.90923], // 北京市中心
          viewMode: '3D',
          resizeEnable: true
        });

        // 添加地图控件
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.ToolBar());
        this.map.addControl(new AMap.HawkEye());
        
        // 添加定位控件
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          buttonPosition: 'RB',
          buttonOffset: new AMap.Pixel(10, 20),
          zoomToAccuracy: true
        });
        this.map.addControl(geolocation);

      } catch (error) {
        console.error('地图加载失败:', error);
        this.error = '地图加载失败，请检查网络连接和API配置';
      }
    }
  }
}
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