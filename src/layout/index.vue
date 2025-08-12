<template>
  <div class="layout_container">
    <el-container>
      <!-- 需要和$header-height的值保持一样 -->
      <el-header height="42" style="--el-header-padding: 0px;">
        <d-tabbar></d-tabbar>
      </el-header>
      <!-- 高度需要减去header的高度 -->
      <el-container>
        <!-- ========================el-aside==================== -->
        <el-aside class="layout_slider" :class="{ 'width-class': layoutStore.fold }">
          <!-- <div > -->
          <el-menu class="menu-box" popper-effect="light" @select="selectHandle" :collapse="layoutStore.fold"
            :collapse-transition="false">
            <d-slider-menu :menuList="menuRoutes"></d-slider-menu>
          </el-menu>
          <!-- </div> -->

        </el-aside>
        <!-- ========================el-aside==================== -->
        <el-main>
          <div class="layout_main" :class="{ fold: layoutStore.fold }">
            <d-main></d-main>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">


//引入菜单组件
import DSliderMenu from '@/layout/DSliderMenu.vue'
//右侧内容的展示区域
import DMain from '@/layout/DMain.vue'
//引入顶部tabbar组件
import DTabbar from '@/layout/DHeader.vue'
//获取layout配置仓库
import { useLayoutStore } from '@/store/layout_setting.ts'
import { userModuleStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const router = useRouter()
const layoutStore = useLayoutStore()
const userStore = userModuleStore()
// const menuList = userStore.menuRoutes
// 尝试使用解构语法
const {menuRoutes} = storeToRefs(userStore)



//点击菜单的回调，需要菜单绑定index属性
const selectHandle = (path: string) => {
  router.push(path)
}




</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {

  .layout_slider {
      width: $menu-max-width;
      box-shadow: 0px 3px 5px -1px #dedbdb;

      &.width-class {
        width: $menu-min-width;
      }

      .menu-box {
        height: calc(100vh - $header-height);
        border: none;
        bottom: 0;
        left: 0;
        overflow: auto;
        transition: all 0.2s;
        -ms-overflow-style: none;
        /* 对于IE和Edge */
        scrollbar-width: none;
        /* 隐藏Firefox滚动条 */
        overflow-y: scroll;
        /* 启用垂直滚动 */
        background-color: $menu-background-color;
      }
  }

  .layout_main{
    // 滚轮向下会带动header并隐藏了header
    height: calc(100vh - $header-height - 80px);
  }
}
</style>
