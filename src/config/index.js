/**
 * 环境配置文件
 * 在企业级项目中有三个环境
 * 开发环境
 * 测试环境
 * 线上环境
 */

//当前环境
const env = import.meta.env.MOOE || 'prod'

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: ''
  }
}

export default {
  env,
  mock: true,
  ...EnvConfig[env]
}