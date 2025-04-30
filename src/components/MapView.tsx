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
  const [retryCount, setRetryCount] = useState<number>(0);

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
        
        // 创建地图实例，使用简化的配置
        const mapInstance = new AMapInstance.Map(mapContainer.current as any, {
          zoom: 11,
          center: [116.397428, 39.90923],
          viewMode: '2D',
          resizeEnable: true
          // 移除其他可能导致问题的复杂配置
        });
        
        console.log('地图实例创建成功');
        setMap(mapInstance);
        
        // 监听地图加载完成事件
        mapInstance.on('complete', () => {
          console.log('地图渲染完成');
          setLoading(false);
          setMapLoaded(true);
          
          // 地图加载完成后，再添加控件
          setTimeout(() => {
            if (mapInstance) {
              try {
                // 添加地图基础控件
                mapInstance.addControl(new AMapInstance.Scale());
                mapInstance.addControl(new AMapInstance.ToolBar());
                console.log('地图控件添加成功');
              } catch (err) {
                console.error('添加地图控件失败:', err);
                // 控件加载失败不影响地图使用，只记录错误
              }
            }
          }, 1000);
          
          // 优化Canvas元素
          optimizeCanvasForReading();
        });
        
      } catch (err: any) {
        console.error('地图加载失败:', err);
        setLoading(false);
        
        // 如果是网络问题，可以尝试重试
        if (err.message?.includes('network') && retryCount < 3) {
          console.log(`网络错误，${2000}ms后进行第${retryCount + 1}次重试`);
          setRetryCount(prev => prev + 1);
          setTimeout(initMap, 2000);
          return;
        }
        
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
            message: '网络连接失败，请检查网络设置或刷新页面重试',
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
  }, [retryCount]);

  // 添加重试按钮
  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

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
          <button onClick={handleRetry} className="retry-button">
            重试加载
          </button>
        </div>
      )}
      
      {loading && (
        <div className="loading-indicator">地图加载中...</div>
      )}
    </div>
  );
};

export default MapView; 