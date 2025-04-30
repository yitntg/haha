import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import '../styles/MapView.css';
import { getMapConfig } from '../api/map';

interface MapError {
  title: string;
  message: string;
  details?: string;
}

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [AMap, setAMap] = useState<any>(null);
  const [error, setError] = useState<MapError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('开始初始化地图');
        setLoading(true);

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
            'AMap.ToolBar',
            'AMap.HawkEye',
            'AMap.Geolocation'
          ]
        });
        
        console.log('高德地图加载成功');
        setAMap(AMapInstance);
        
        // 确保容器元素存在
        if (!mapContainer.current) {
          throw new Error('地图容器元素不存在');
        }
        
        // 创建地图实例
        const mapInstance = new AMapInstance.Map(mapContainer.current, {
          zoom: 11,
          center: [116.397428, 39.90923],
          viewMode: '3D',
          resizeEnable: true
        });
        
        console.log('地图实例创建成功');
        setMap(mapInstance);
        
        // 添加地图控件
        mapInstance.addControl(new AMapInstance.Scale());
        mapInstance.addControl(new AMapInstance.ToolBar());
        mapInstance.addControl(new AMapInstance.HawkEye());
        
        console.log('地图控件添加成功');
        setLoading(false);
        
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
      <div id="mapContainer" ref={mapContainer} className="map"></div>
      
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
        <div className="loading-indicator">加载中...</div>
      )}
    </div>
  );
};

export default MapView; 