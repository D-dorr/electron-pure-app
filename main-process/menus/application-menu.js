const {Menu, app, shell} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

let template = [
  {
    label: '编辑',
    visible: false,
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'CmdOrCtrl+Y',
        role: 'redo'
      },
      {type: 'separator'},
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '删除',
        accelerator: 'Delete',
        role: 'delete'
      },
      // { type: 'separator' },
      {
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
      }
    ]
  },
  {
    label: '查看',
    submenu: [
      {
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
      },
      {
        label: '强制重载',
        visible: false,
        role: 'forcereload'
      },
      {type: 'separator'},
      {
        label: '放大',
        role: 'zoomin'
      },
      {
        label: '缩小',
        role: 'zoomout'
      },
      {
        label: '重置缩放',
        role: 'resetzoom'
      },
      {type: 'separator'},
      {
        label: '全屏',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        }
      }
    ]
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '全屏',
        visible: false,
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        }
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '帮助',
        click: () => {
          shell.openExternal('https://electronjs.org/')
        }
      }
    ]
  }
]

function addUpdateMenuItems (items, position) {
  if (process.mas) return

  const version = app.getVersion()
  let updateItems = [
    {
      label: `版本 ${version}`,
      enabled: false
    }, {
      label: '检查更新',
      visible: false,
      key: 'checkForUpdate',
      click: () => {
        require('electron-updater').autoUpdater.checkForUpdatesAndNotify()
      }
    }
  ]
  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(item => {
    if (item.submenu) {
      item.submenu.items.forEach(item => {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: `关于 ${name}`,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: '服务',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: `隐藏 ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: '显示全部',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: '退出',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  })
  template.push({
    label: '编辑',
    visible: false,
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'CmdOrCtrl+Y',
        role: 'redo'
      },
      {type: 'separator'},
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '删除',
        accelerator: 'Delete',
        role: 'delete'
      }
    ]
  })
  // 窗口菜单.
  template[2].submenu.push({
    type: 'separator'
  }, {
    label: '前置所有',
    role: 'front'
  })
} else {
  const helpMenu = template[template.length - 1].submenu
  helpMenu.push({type: 'separator'})
  helpMenu.push({
    label: 'ELECTRON官网',
    role: 'about',
    click: () => {
      shell.openExternal('https://electronjs.org/')
    }
  })
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}

template.push({
  label: '开发',
  role: 'develop',
  submenu: [
    {
      label: '切换开发者工具',
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
    }
  ]
})

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', () => {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', () => {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true
})
