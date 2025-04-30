declare module '@amap/amap-jsapi-loader' {
  interface AMapConfig {
    key: string
    version: string
    plugins?: string[]
  }

  interface MapOptions {
    zoom?: number
    center?: [number, number]
    viewMode?: '2D' | '3D'
    resizeEnable?: boolean
  }

  interface AMapInstance {
    Map: new (container: string, options: MapOptions) => any
    Scale: new () => any
    ToolBar: new () => any
    HawkEye: new () => any
    Geolocation: new (options: any) => any
    Pixel: new (x: number, y: number) => any
  }

  interface AMapLoader {
    load: (config: AMapConfig) => Promise<AMapInstance>
  }

  const loader: AMapLoader
  export default loader
} 