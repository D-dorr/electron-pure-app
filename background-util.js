const pathPefix = './main-process'

const requireModule = function () {
  require(`${pathPefix}/menus/application-menu.js`)
  require(`${pathPefix}/menus/context-menu.js`)
  require(`${pathPefix}/bridging-web/front-end-communication.js`)
}

module.exports = {
  requireModule
}
