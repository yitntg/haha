import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import '../styles/MapView.css';
import { getMapConfig } from '../api/map';

interface MapError {
  title: string;
  message: string;
  details?: string;
}

// 高德地图类型声明
interface AMapType {
  Map: any;
  Scale: any;
  ToolBar: any;
}

// 为Canvas元素添加willReadFrequently属性的辅助函数
const optimizeCanvasForReading = () => {
  // 等待高德地图创建完Canvas元素
  setTimeout(() => {
    // 找到地图容器中的所有Canvas元素
    const canvases = document.querySelectorAll('#mapContainer canvas') as NodeListOf<HTMLCanvasElement>;
    canvases.forEach(canvas => {
      // 获取Canvas上下文并设置willReadFrequently属性
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      // 如果需要，还可以重新绘制Canvas以应用优化
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
      }
    });
    console.log('已优化地图Canvas性能');
  }, 2000); // 延迟2秒执行，确保Canvas已创建
};

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [AMap, setAMap] = useState<AMapType | null>(null);
  const [error, setError] = useState<MapError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('开始初始化地图');
        setLoading(true);

        // 确保容器元素存在并设置尺寸
        if (!mapContainer.current) {
          throw new Error('地图容器元素不存在');
        }
        
        // 获取API Key，使用api/map.ts中的方法
        const mapConfig = await getMapConfig();
        if (!mapConfig.key) {
          throw new Error('API响应中没有key字段');
        }
        
        console.log('成功获取API密钥');
        const key = mapConfig.key;

        // 加载高德地图
        const AMapInstance = await AMapLoader.load({
          key,
          version: '2.0',
          plugins: [
            'AMap.Scale',
            'AMap.ToolBar'
          ]
        });
        
        console.log('高德地图加载成功');
        setAMap(AMapInstance);
        
        // 创建地图实例，优化性能配置
        const mapInstance = new AMapInstance.Map(mapContainer.current, {
          zoom: 11,
          center: [116.397428, 39.90923],
          viewMode: '2D', // 改为2D模式，性能更好
          resizeEnable: true,
          jogEnable: false, // 禁用地图缓动效果
          pitchEnable: false, // 禁用俯仰角度
          buildingAnimation: false, // 禁用建筑物动画效果
          mapStyle: 'amap://styles/normal', // 使用标准样式
          features: ['bg', 'road', 'building', 'point'], // 仅加载基本要素
          // 减少Canvas读取操作的配置项
          cacheSize: 1000, // 增加缓存大小
          renderOptions: {
            fps: 30, // 降低帧率，减少重绘次数
            drawCustom: false, // 禁用自定义绘制
            drawTraffic: false, // 禁用交通流量图层
            alwaysRender: false // 禁用持续渲染
          }
        });
        
        // 延迟添加地图控件，避免同时加载导致的性能问题
        setTimeout(() => {
          if (mapInstance) {
            // 添加地图基础控件
            mapInstance.addControl(new AMapInstance.Scale());
            mapInstance.addControl(new AMapInstance.ToolBar({
              position: 'RB' // 放在右下方
            }));
            
            console.log('地图控件添加成功');
          }
        }, 1000);
        
        console.log('地图实例创建成功');
        setMap(mapInstance);
        
        // 监听地图加载完成事件
        mapInstance.on('complete', () => {
          console.log('地图渲染完成');
          setLoading(false);
          setMapLoaded(true);
          
          // 优化Canvas元素
          optimizeCanvasForReading();
        });
        
      } catch (err: any) {
        console.error('地图加载失败:', err);
        setLoading(false);
        
        if (err.message?.includes('API请求失败')) {
          setError({
            title: 'API请求错误',
            message: '无法从服务器获取地图API密钥',
            details: err.message
          });
        } else if (err.message?.includes('没有key字段')) {
          setError({
            title: '配置错误',
            message: '未找到高德地图API密钥，请检查服务器配置',
            details: err.message
          });
        } else if (err.message?.includes('invalid key')) {
          setError({
            title: 'API密钥无效',
            message: '高德地图API密钥无效，请检查配置',
            details: err.message
          });
        } else if (err.message?.includes('network')) {
          setError({
            title: '网络错误',
            message: '网络连接失败，请检查网络设置',
            details: err.message
          });
        } else {
          setError({
            title: '加载失败',
            message: '地图加载失败，请刷新页面重试',
            details: err.message || JSON.stringify(err)
          });
        }
      }
    };
    
    initMap();
    
    // 清理函数
    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return (
    <div className="map-container">
      <div 
        id="mapContainer" 
        ref={mapContainer} 
        className={`map ${mapLoaded ? 'loaded' : ''}`}
      ></div>
      
      {error && (
        <div className="error-message">
          <h3>{error.title}</h3>
          <p>{error.message}</p>
          {error.details && (
            <pre className="error-details">{error.details}</pre>
          )}
        </div>
      )}
      
      {loading && (
        <div className="loading-indicator">地图加载中...</div>
      )}
    </div>
  );
};

export default MapView; 