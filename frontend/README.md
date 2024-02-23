## 项目特性
项目使用 Monorepos 架构为多平台（web、h5、插件），多服务（登录服务、chat服务、助手管理）尽可能复用代码而搭建

## 环境依赖
+ pnpm
+ React
+ Ant Design
+ Nx

## 开发配置
将根目录下和所有项目下的 .env.xxx.template 文件拷贝并重命名为 .env.xxx (按照本地情况来修改环境变量) 
+ .env 开头文件为本地使用相关环境变量
+ .env 结尾文件为各环境使用的环境变量
+ 相关环境变量文件优先级参考：[https://nx.dev/recipes/tips-n-tricks/define-environment-variables](https://nx.dev/recipes/tips-n-tricks/define-environment-variables)

## 快速开始
0. clone 代码
    ```
    git clone 
    cd frontend
    ```
1. 安装依赖
    ```
    pnpm install
    ```
2. 启动项目(本地开发)
    ```
    // 启动 web 版、插件版、登录
    pnpm start
    ```
3. 打包项目
    ```
    pnpm build
    ```
4. 打包结果
    ```
    |-- frontend
        |-- dist
            |-- apps
                |-- extension // 插件 build 后产物
                |-- extension-watch // 插件 dev 启动后的产物
                |-- doc-chat
                |-- web
                |-- h5
                |-- login // 登录服务 build 后产物
                |-- scripts // 插件远程加载页面
    ```


## 目录结构
```
  |-- frontend
      |-- README.md
      |-- nx.json
      |-- package.json
      |-- pnpm-lock.yaml
      |-- proxyConf.js // 前端开发代理配置
      |-- tsconfig.base.json // 基础 ts config (用于继承使用)
      |-- tsconfig.json // 根目录的 ts config
      |-- .custom // Nx 自定义执行器目录
      |-- apps // 各服务入口
      |   |-- extension // 浏览器插件项目
      |   |-- login // 登录项目
      |   |-- web // web 版项目
      |   |-- playground // 助手管理项目
      |-- common // 全局静态资源目录
      |   |-- assets // 图片静态资源目录
      |   |-- styles // less 全局资源目录
      |-- configs // 配置共享项目
      |-- constants // 静态变量
      |-- context
      |-- hooks // React Hooks
      |-- libs // 组件库(共享代码)
      |   |-- components // 组件(纯组件)
      |   |-- packages // 包装组件
      |   |-- containers // 页面组件
      |-- permission // 权限
      |-- services // 请求
      |-- types // ts 类型
      |-- utils // 通用方法(包含打平平台差异)
      |-- webpack // webpack configs
```