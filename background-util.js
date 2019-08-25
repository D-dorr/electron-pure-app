const pathPefix = './main-process'

const requireModule = function () {
  require(`${pathPefix}/menus/application-menu.js`)
  require(`${pathPefix}/menus/context-menu.js`)
}

module.exports = {
  requireModule
}
