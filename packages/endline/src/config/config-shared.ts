export interface EndlineConfig {
  /**
   * Output directory
   * @default './dist'
   */
  distDir?: string
}

export type EndlineRequiredConfig = Required<EndlineConfig>

export const defaultConfig: EndlineRequiredConfig = {
  distDir: './dist',
}
