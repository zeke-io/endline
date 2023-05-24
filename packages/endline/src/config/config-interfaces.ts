export interface RouterConfig {
  /**
   * Routes directory
   * @default './src/routes'
   */
  routesDirectory?: string
}

export interface EndlineConfig {
  /**
   * Output directory
   * @default './dist'
   */
  distDir?: string
  /**
   * Router configuration
   */
  router?: RouterConfig
}

export type EndlineRequiredConfig = Required<EndlineConfig> & {
  router: Required<RouterConfig>
}
