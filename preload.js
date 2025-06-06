const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script is running')

contextBridge.exposeInMainWorld('electronAPI', {
  // 获取用户名
  getUsername: () => ipcRenderer.invoke('get-username'),
  
  // 获取平台
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // 选择目录
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // 读取目录
  readDirectory: (dirPath) => {
    console.log('Calling readDirectory with path:', dirPath)
    return ipcRenderer.invoke('read-directory', dirPath)
  },
  
  // 读取文件
  readFile: (filePath) => {
    console.log('Calling readFile with path:', filePath)
    return ipcRenderer.invoke('read-file', filePath)
  },
  
  // 写入文件
  writeFile: (filePath, content) => {
    console.log('Calling writeFile with path:', filePath)
    return ipcRenderer.invoke('write-file', filePath, content)
  },
  
  // 删除文件
  deleteFile: (filePath) => {
    console.log('Calling deleteFile with path:', filePath)
    return ipcRenderer.invoke('delete-file', filePath)
  },
  
  // 删除目录
  deleteDirectory: (dirPath) => {
    console.log('Calling deleteDirectory with path:', dirPath)
    return ipcRenderer.invoke('delete-directory', dirPath)
  },
  
  // 创建目录
  createDirectory: (dirPath) => {
    console.log('Calling createDirectory with path:', dirPath)
    return ipcRenderer.invoke('create-directory', dirPath)
  },
  
  // 路径验证相关 API
  pathExists: (path) => ipcRenderer.invoke('path-exists', path),
  isDirectory: (path) => ipcRenderer.invoke('is-directory', path),
  hasWriteAccess: (path) => ipcRenderer.invoke('has-write-access', path)
})

console.log('electronAPI has been exposed') 