# 父组件控制子组件Dialog开关
1、父组件定义一个boolean类型响应式数据`dialogShow`
```ts
const dialogShow = ref(false)
```
2、将`dialogShow`传递给子组件

```ts
// 1、父组件这样传递
<d-attr-create-modify v-if="dialogShow" :visiable="dialogShow"/>
// 2、子组件定义属性visiable接受
const props = defineProps<{
  visiable: boolean
  // attrId: number
}>()

```
3、因为visiable属性值在子组件中仅可读，所以将其赋值给子组件自定义的ref响应式数据,
```ts
const dialogVisiable = ref(props.visiable)
// 这样子组件中就可以通过dialogVisiable来实现响应式
```
4、监听props.visiable，实现它与dialogVidiable强绑定实现实时更新数据
```ts
watch(() => props.visiable, (newVal) => {
  dialogVisiable.value = newVal
})
```
5、如果子组件关闭了dialog，还需要通知父组件来改变开关值
```ts
const emit = defineEmits<{
  (e: 'close'): void
}>()
const dialogClose = ()=>{
  emit('close')
}
```
6、父组件关闭
```ts
<d-attr-create-modify v-if="dialogShow" 
        :visiable="dialogShow"
        @close="closeCMDialog"
    :attr-id="attrId"></d-attr-create-modify>

const closeCMDialog =()=>{
    dialogShow.value = false
}

```
7、总结
7.1、父组件代码片段
```ts
<d-attr-create-modify v-if="dialogShow" :visiable="dialogShow" @close="closeCMDialog"/>

const dialogShow = ref(false)

const closeCMDialog =()=>{
    dialogShow.value = false
}

```
7.2、子组件代码片段
```ts
  <el-dialog 
    v-model="dialogVisiable"
    @closed="dialogClose"
  >
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisiable = false">取消</el-button>
    </span>
  </el-dialog>


const props = defineProps<{
  visiable: boolean
  attrId: number
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()
const dialogVisiable = ref(props.visiable)
const dialogClose = ()=>{
  emit('close')
}
watch(() => props.visiable, (newVal) => {
  dialogVisiable.value = newVal
})

```



# 常用代码片段

## 分页
```html

      <el-pagination 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange"
          :current-page="currentPage" 
          :page-size="pageSize" 
          :page-sizes="[5, 10]"
          :total="totalCount" 
          layout="sizes, prev, pager, next, jumper, ->, total"/>

```


```ts
const totalCount = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)


/**
 * 查询列表数据
 */
const getDataList = async ()=>{
    await reqAttrGroupTableData(currentPage.value,pageSize.value,queryParams).then(res=>{
        dataList.value =Array.from(res.list)
        totalCount.value = res.totalCount
    })
}


const handleSizeChange = (val: number) => {
  pageSize.value = val
  getDataList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getDataList()    
}

```
## 删除气泡确认
```html
      <el-table-column label="操作" width="180" align="center" >
        <template #default="scope">
          <!-- <el-button type="success" size="large" @click="gotoEdit(scope.row)">编辑</el-button> -->
          <el-popconfirm title="确认删除?" @confirm="doDelRoleHandler(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>


```



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
## 项目中如何清除默认样式
方式一、借助normalize.css，下载安装并在main.ts文件中引入；
1、 `npm install normalize.css`
2、 `import 'normalize.css'`
方式二、借助src/styles/reset.scss(自定义内容)，这样可以更彻底的进行样式重置。
当前项目使用的就是此方式。记得在main.ts中进行引入`import '@/styles/index.scss'`

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

# Mock
[官网文档](https://www.npmjs.com/package/vite_mock_plugin)
1、安装依赖
`npm i mockjs vite-plugin-mock --save-dev`
2、 vite.config.ts添加如下配置
```ts
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command }) => {
  
  return {
    plugins: [
      vue(),
      ...
      // mock配置
      viteMockServe({
        mockPath: 'mock', // mock文件夹路径
        enable: command === 'serve' // 只有开发环境才开启mock
      })
    ]
  }
})  
```
3、在项目的根路径下添加mock文件夹存放mock文件

# axios二次封装
1、 安装`npm install axios`
**为什么需要二次封装，主要为了使用请求和响应拦截器**
src/utils/request.ts
```ts
// 基础配置模板
//进行axios二次封装，使用请求和响应拦截器
import axios from 'axios'

//1 利用axios对象的create方法，创建axios实例：配置基础路径，超时时间
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
  timeout: 5000, //超时时间
})
//2 request 实例添加请求与响应拦截器
request.interceptors.request.use((config) => {

  //config配置对象，headers属性请求头，经常给服务器端携带公共参数
  //返回配置对象
  return config
})
//3 响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
  },
  (error) => {
    //失败的回调，处理http网络错误的
    //变量存储网络错误信息
    return Promise.reject(error)
  },
)
```


# 安装路由
`npm install vue-router`




# pinia的使用
实现任意组件之间的通信，
核心概念：state\actions\getters

1、 安装pinia`npm install pinia`
2、 创建一个 pinia 实例 (根 store) 并将其传递给应用：
```ts
// amin.ts
import { createPinia } from 'pinia'
// 创建一个pinia实例
const pinia = createPinia()
app.use(pinia)
```
**之后在项目中该如何使用呢**
1、在src下创建store目录，之后可以在此目录下根据业务需求以文件的形式创建每一块业务模块的小仓库。
```ts
import { defineStore } from "pinia";

// 创建一个名为 user_store 的仓库，返回的是一个函数
export const  userModuleStore = defineStore('user_store', {

    // 为了完整类型推理，推荐使用箭头函数
    state: () => {
        return {
            // 所有这些属性都将自动推断出它们的类型
            // 初始化是登录成功后直接给的，之后的每次都从本地存储中获取
            token: localStorage.getItem('user_token')
        }
    },
    // actions 属性它们也是定义业务逻辑的完美选择，相当于组件中的 method
    actions: {
        registryToken(token:string){
            this.token = token
            localStorage.setItem("user_token",token)
        }
    }
})


```


