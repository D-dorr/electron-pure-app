const {app, BrowserWindow} = require('electron')
const electron = require('electron')
const {requireModule} = require('./background-util')
requireModule()
let win
let electronScreen
function createWindow () {
  let size = electronScreen.getPrimaryDisplay().workAreaSize
  let width = parseInt(size.width * 1)
  let height = parseInt(size.height * 1)
  win = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    minWidth: 1250,
    minHeight: 600,
    backgroundColor: '#f0eff4',
    webPreferences: {
      webSecurity: false,
      defaultFontFamily: {
        standard: 'Microsoft YaHei'
      },
      defaultEncoding: 'utf-8',
      // https://electronjs.org/docs/faq
      nodeIntegration: false
    }
  })

  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
  // demo这里是要跳的前端地址s
  // win.loadURL('http://192.168.1.151:9000/login')
  // 内管
  win.loadURL('http://manager-app:9001')
  // 是否显示控制台
  // win.webContents.openDevTools()
  // 关闭当前窗口后触发
  win.on('closed', () => {
    win = null
  })
}
// app.on('ready', createWindow)
app.on('ready', () => {
  electronScreen = electron.screen
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

// 单实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  // 创建 myWindow, 加载应用的其余部分, etc...
  app.on('ready', async () => {
    createWindow()
  })
}