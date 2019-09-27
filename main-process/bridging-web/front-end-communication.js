const { ipcMain, app, BrowserWindow } = require('electron')
const electron = require('electron')
let newwin
let electronScreen
// 当前端有交易需要撤销时的通讯
ipcMain.on('open-new-win', (event, command) => {
  let size = electronScreen.getPrimaryDisplay().workAreaSize
  let width = parseInt(size.width * 0.9)
  let height = parseInt(size.height * 0.9)
  newwin = new BrowserWindow({
    show: true,
    width: width,
    height: height,
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
  newwin.loadURL(command.params.path)
  newwin.on('closed',()=>{newwin = null})
})

app.on('ready', () => {
  electronScreen = electron.screen
})
