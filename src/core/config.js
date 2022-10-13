/**
 * 网站配置文件
 */

const config = {
  appName: 'flipadmin-管理端',
  appLogo: 'https://www.gin-vue-admin.com/img/logo.png',
  showViteLogo: false,
  hostname:""
}

export const viteLogo = (env) => {
  if (config.showViteLogo) {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用Gin-Vue-Admin，开源地址：https://github.com/flipped-aurora/gin-vue-admin`
      )
    )
    console.log(
      chalk.green(
        `> 当前版本:v2.5.1 beta`
      )
    )
    console.log('\n')
  }
}

export default config
