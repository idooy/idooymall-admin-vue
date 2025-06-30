# 开发环境以及如何创建vite项目
 node.js 
基于vite创建和初始化项目，运行的命令如下:`npm create vite@latest`(此时latest=7.0.0);按照步骤操作就会创建一个vite项目。其实`npm create vite`安装的是`create-vite`,`create-vite `就是vite的脚手架。create-vite和vite的关系是什么？create-vite内置了vite（类似vue-cli和webpack的关系）


官方给出了兼容性相关提示：
```text
兼容性注意

Vite 需要 Node.js 版本 20.19+, 22.12+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本
```
因此开发环境的node选择 v22.17.0
# NPM镜像源
`npm get registry`可获得当前镜像源
更新镜像源为taobao,`npm config set registry https://registry.npmmirror.com/`

# 一个很清爽的vite项目
1. 删除 Helloworld.vue和style.css文件，当然相关的Helloworld.vue组件引入也要从App.vue中删除。
2. 在main.ts文件中找到`import './style.css'`并删除
3. 清空App.vue中script、template、style标签体内容
4. 删除assets中的vue.svg
这样就可以得到一个干净的项目目录结构。在此基础上进行开发。

# vscode导入异常
使用import进行导入导入时，报如下类似错误
`Cannot find module 'vue' or its corresponding type declarations.ts(2307)`
**解决方法：**
1、 对vscode进行如下配置：vue>server:hybrid Mode配置项为true
2、 搜索输入：>select typescript version,选择Use Workspace Version...

# 项目启动浏览器自动打开
使用脚本`vite --open`,在package.json中配置


# vite配置别名
1、 安装依赖项，必须安装 @types/node 以解决 path 模块类型声明问题：
`npm install @types/node --save-dev`
2、 配置vite.config.ts
```ts
  import path from 'path'
  // 配置别名，如果使用了typescript，需要配置tsconfig.js文件，确保 compilerOptions 字段中存在 baseUrl 和 paths 属性
  resolve: {
    alias: {
      // __dirname 是一个 Node.js 的全局变量，它指向当前执行脚本所在的目录，path.resolve 方法用于将路径或路径段解析为绝对路径。
      '@': path.resolve(__dirname, './src'),
      // 扩展别名示例
      'utils': path.resolve(__dirname, 'src/utils') 
    }
  }
```
3、 如果使用了ts,则还需要配置tsconfig.json,以确保 TypeScript 编译器能够正确地解析这些别名
```ts
// ts支持vite别名配置
  "compilerOptions": {
    // baseUrl 指定了用于解析非相对模块名的基目录
    // 设置基路径为 tsconfig.json 所在目录 
    "baseUrl": ".",
    //  paths 则定义了路径映射
    "paths": {
      "@/*": [
        "src/*"
      ],
      "utils/*": [
        "src/utils/*"
      ]
    }
  } 
```
# 安装路由
`npm install vue-router`