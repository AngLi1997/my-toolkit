import localforage from 'localforage'

// 初始化 localforage
localforage.config({
  name: 'CodeSnippetManager',
  storeName: 'settings'
})

// 默认设置
const defaultSettings = {
  storagePath: '',
  editorTheme: 'chrome'
}

// 设置键名
const SETTINGS_KEY = 'user_settings'

/**
 * 设置管理器
 */
class SettingsManager {
  /**
   * 初始化设置
   * @returns {Promise<Object>} 设置对象
   */
  static async initialize() {
    try {
      // 获取用户名和平台信息
      const username = await window.electronAPI.getUsername()
      const platform = await window.electronAPI.getPlatform()
      
      // 设置默认存储路径
      const defaultPath = platform === 'darwin'
        ? `/Users/${username}/ToolKits/CodeSnippets`
        : 'D:/ToolKits/CodeSnippets'
      
      defaultSettings.storagePath = defaultPath
      
      // 读取保存的设置
      const savedSettings = await this.readSettings()
      return savedSettings
    } catch (error) {
      console.error('初始化设置失败:', error)
      return defaultSettings
    }
  }
  
  /**
   * 读取设置
   * @returns {Promise<Object>} 设置对象
   */
  static async readSettings() {
    try {
      const settings = await localforage.getItem(SETTINGS_KEY)
      return settings || defaultSettings
    } catch (error) {
      console.error('读取设置失败:', error)
      return defaultSettings
    }
  }
  
  /**
   * 保存设置
   * @param {Object} settings 设置对象
   * @returns {Promise<void>}
   */
  static async saveSettings(settings) {
    try {
      await localforage.setItem(SETTINGS_KEY, {
        ...defaultSettings,
        ...settings
      })
    } catch (error) {
      console.error('保存设置失败:', error)
      throw error
    }
  }
}

export default SettingsManager 