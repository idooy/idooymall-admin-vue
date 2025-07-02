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
[如果在编辑器中文件路径导入出现红色波浪线，该博客有详细的解决方案](https://blog.csdn.net/snans/article/details/143361702)
1、 安装依赖项，必须安装 @types/node 以解决 path 模块类型声明问题：
`npm install @types/node --save-dev`
2、 vite.config.ts文件中添加如下配置项，这里解决的是vue文件中正确使用别名
```ts
  import path from 'path'
  // 配置别名，如果使用了typescript，需要配置tsconfig.js文件，确保 compilerOptions 字段中存在 baseUrl 和 paths 属性
  resolve: {
    alias: {
      // __dirname 是一个 Node.js 的全局变量，它指向当前执行脚本所在的目录，path.resolve 方法用于将路径或路径段解析为绝对路径。
      '@': path.resolve(__dirname, 'src'),
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
**tsconfig.json原始配置如下：**
```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
    }
  }
}
```
到这里vscode不管在vue还是ts文件中，在使用别名进行import时，会出现红色波浪线。提示
error TS7016: Could not find a declaration file for module 'XXX'.
 'XXX' implicitly has an 'any' type.
 这时还需要修改tsconfig.app.json中为如下内容：
 ```json
{
  "extends": "./tsconfig.json", // 继承自tsconfig.json

  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}

 ```
                        

# 项目集成element-plus
[官方，安装和快速开始](https://cn.element-plus.org/zh-CN/guide/installation.html)

# 环境变量配置
环境变量配置在vite文档中，[官方文档-环境变量](https://cn.vite.dev/guide/env-and-mode.html)

# SVG矢量图
[官方文档](https://gitcode.com/gh_mirrors/vi/vite-plugin-svg-icons/blob/main/README.zh_CN.md?utm_source=csdn_github_accelerator#vite-plugin-svg-icons)
1、 安装SVG依赖的插件
`npm install vite-plugin-svg-icons -D` 和 `npm i fast-glob -D`
2、main.ts文件中引入该插件
```ts
import 'virtual:svg-icons-register';
```
但是vscode会报如下错误
```ts
Cannot find module 'virtual:svg-icons-register' or its corresponding type declarations
```
如果出现该错误可尝试在vite-env.d.ts文件中添加如下配置
```ts
declare module 'virtual:svg-icons-register' {
    const content: any;
    export default content;
}
declare module 'virtual:svg-icons-names' {
    // eslint-disable-next-line
    const iconsNames: string[]
    export default iconsNames
}
```
## 如何在组件使用 
**Vue 方式**

`/src/components/SvgIcon.vue`

```vue
<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  },
})
</script>
```
## 将SvgIcon注册为全局组件
1、 定义自定义插件(inject.component.plugin.ts)
```ts
/**注册自定义全局组件 */
import SvgIcon from '@/components/SvgIcon.vue'
import { App, Component } from 'vue'

// 如果想把自定义组件注册为全局组件，就应该添加为该对象的属性
// 解构语法
const globalComponents: Component= {SvgIcon}


// 暴露自定义插件对象
export default{
    install(app: App){
        Object.keys(globalComponents).forEach((key)=>{
            app.component(key,globalComponents[key])
        })
    }
}
```
2、在入口文件(main.ts)中对插件进行安装
```ts
import globalComponent from '@/components/inject.global.component.plugin.ts'
// 安装自定义插件
app.use(globalComponent)
```
这样就可以在项目任何需要使用SvgIcon组件的地方之间使用组件标签，而不需要繁琐的局部import

# 集成sass
1、 安装`npm install sass -D`

## 配置sass的全局变量
1、 创建src/styles/variable.scss,在里边定义全局变量
2、 vite.config.ts中进行scss全局变量的相关配置
```ts
 //scss全局变量配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/styles/variable.scss";`,
        additionalData: `@use "@/styles/variable.scss" as *;`,
      },
    },
  }

```

# 安装路由
`npm install vue-router`