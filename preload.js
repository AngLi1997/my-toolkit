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
  }
})

console.log('electronAPI has been exposed') 