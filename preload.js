const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script is running')

contextBridge.exposeInMainWorld('electronAPI', {
  readDirectory: (dirPath) => {
    console.log('Calling readDirectory with path:', dirPath)
    return ipcRenderer.invoke('read-directory', dirPath)
  },
  readFile: (filePath) => {
    console.log('Calling readFile with path:', filePath)
    return ipcRenderer.invoke('read-file', filePath)
  },
  writeFile: (filePath, content) => {
    console.log('Calling writeFile with path:', filePath)
    return ipcRenderer.invoke('write-file', filePath, content)
  },
  deleteFile: (filePath) => {
    console.log('Calling deleteFile with path:', filePath)
    return ipcRenderer.invoke('delete-file', filePath)
  },
  deleteDirectory: (dirPath) => {
    console.log('Calling deleteDirectory with path:', dirPath)
    return ipcRenderer.invoke('delete-directory', dirPath)
  },
  createDirectory: (dirPath) => {
    console.log('Calling createDirectory with path:', dirPath)
    return ipcRenderer.invoke('create-directory', dirPath)
  }
})

console.log('electronAPI has been exposed') 