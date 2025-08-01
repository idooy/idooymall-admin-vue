<!-- 
vite-plugin-svg-icons：用于生成 svg 雪碧图.
 
vite-plugin-svg-icons官方文档地址：https://gitcode.com/gh_mirrors/vi/vite-plugin-svg-icons/blob/main/README.zh_CN.md?utm_source=csdn_github_accelerator#vite-plugin-svg-icons

该文件中的代码片段均来自官方文档
-->
<template>
  <svg aria-hidden="true" :style="{width: width+'px',height:height+'px'}">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>


<script>
import { defineComponent, computed } from 'vue'

/**
 * 如何在组件中使用呢？
 * 官方给出了答案，但是在此项目中使用icon.svg的组件众多，考虑将其注册为全局组件
 * // TODO 使用vue的plugin的方式注册为全局组件，详情在plugin/registry_component.ts
 */
export const svgIcon =  defineComponent({
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
    width: {
        type: String,
        default: 16
    },
    height: {
        type: String,
        default: 16
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  },
})
</script>