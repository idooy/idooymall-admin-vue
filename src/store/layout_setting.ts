//小仓库：关于layout组件相关配置仓库
import { defineStore } from 'pinia'

export const layoutSttingStore = defineStore('layout_setting_store', {
  state: () => {
    return {
      //控制菜单折叠效果
      fold: false, 
      // 控制tabbar的刷新效果
      refsh: false,
    }
  },
})

