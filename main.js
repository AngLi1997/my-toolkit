/**
 * app 模块，它控制应用程序的事件生命周期。
 * BrowserWindow 模块，它创建和管理应用程序 窗口。
 */
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { readdir, readFile, writeFile, stat, rm, mkdir } = require('fs/promises')

// 获取应用程序的根目录路径
const APP_ROOT = __dirname

// 添加一个createWindow()方法来加载vue项目文件
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(APP_ROOT, 'preload.js'),
      sandbox: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8081')
    win.webContents.openDevTools()
  } else {
    win.loadFile('dist/index.html')
  }
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
 * 可以通过使用 app.whenReady() API来监听此事件。 
 * 在whenReady()成功后调用createWindow()函数来打开窗口。
 */
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC处理程序
ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    const items = await readdir(dirPath)
    const result = []
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stats = await stat(fullPath)
      const isDirectory = stats.isDirectory()
      
      result.push({
        name: item,
        type: isDirectory ? 'category' : 'file',
        path: fullPath,
        isDirectory
      })
    }
    
    return result
  } catch (error) {
    console.error('读取目录失败:', error)
    throw error
  }
})

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('读取文件失败:', error)
    throw error
  }
})

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await writeFile(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('写入文件失败:', error)
    throw error
  }
})

// 删除文件
ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    await rm(filePath)
    return true
  } catch (error) {
    console.error('删除文件失败:', error)
    throw error
  }
})

// 删除目录
ipcMain.handle('delete-directory', async (event, dirPath) => {
  try {
    await rm(dirPath, { recursive: true })
    return true
  } catch (error) {
    console.error('删除目录失败:', error)
    throw error
  }
})

// 创建目录
ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    await mkdir(dirPath)
    return true
  } catch (error) {
    console.error('创建目录失败:', error)
    throw error
  }
})
