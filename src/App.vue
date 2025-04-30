<template>
  <div class="app-container">
    <MapView class="map-view" />
    <div class="content-overlay">
      <!-- 其他内容可以放在这里 -->
    </div>
  </div>
</template>

<script>
import MapView from './components/MapView.vue'

export default {
  name: 'App',
  components: {
    MapView
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.map-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 2;
  /* 添加半透明背景 */
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
}
</style> 