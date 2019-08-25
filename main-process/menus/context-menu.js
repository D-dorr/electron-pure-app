const {Menu, MenuItem, app, shell, BrowserWindow} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const menu = new Menu()
menu.append(new MenuItem({
  label: '重新载入',
  accelerator: 'CmdOrCtrl+R',
  click: (item, focusedWindow) => {
    if (focusedWindow) {
      // 重载之后, 刷新并关闭所有之前打开的次要窗体
      if (focusedWindow.id === 1) {
        BrowserWindow.getAllWindows().forEach(win => {
          if (win.id > 1) win.close()
        })
      }
      focusedWindow.reload()
    }
  }
}))
menu.append(new MenuItem({label: '强制重载', visible: false, accelerator: 'CmdOrCtrl+Shift+R', role: 'forcereload'}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall'}))
menu.append(new MenuItem({label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy'}))
menu.append(new MenuItem({label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut'}))
menu.append(new MenuItem({label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste'}))
menu.append(new MenuItem({
  label: '打印',
  accelerator: 'CmdOrCtrl+P',
  visible: false,
  click: function (item, focusedWindow) {
    if (focusedWindow) {
      const pdfPath = path.join(os.tmpdir(), 'print.pdf')
      // 使用默认打印选项
      focusedWindow.webContents.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(pdfPath, data, function (error) {
          if (error) {
            throw error
          }
          shell.openExternal('file://' + pdfPath)
        })
      })
    }
  }
}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({label: '放大', accelerator: 'CmdOrCtrl+Shift+=', role: 'zoomin'}))
menu.append(new MenuItem({label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomout'}))
menu.append(new MenuItem({label: '重置缩放', accelerator: 'CmdOrCtrl+O', role: 'resetzoom'}))
menu.append(new MenuItem({type: 'separator'}))
menu.append(new MenuItem({
  label: '检查',
  role: 'develop',
  accelerator: (() => {
    if (process.platform === 'darwin') {
      return 'Alt+Command+I'
    } else {
      return 'Ctrl+Shift+I'
    }
  })(),
  click: (item, focusedWindow) => {
    if (focusedWindow) {
      focusedWindow.toggleDevTools()
    }
  }
}))
app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup(win, params.x, params.y)
  })
})
