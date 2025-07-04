<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <slider-top></slider-top>
      <!-- 菜单栏添加滚动条 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 :collapse="LayOutSettingStore.fold ? true : false"-->
        <el-menu :default-active="$route.path"
         background-color="#001529" 
         text-color="white" 
         active-text-color="yellow">
          <!-- 根据路由动态生成菜单 :menuList="userStore.menuRoutes"-->
          <Menu></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 :class="{ fold: LayOutSettingStore.fold ? true : false }"-->
    <div class="layout_tabbar">
      <!-- layout组件顶部组件tabbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 :class="{ fold: LayOutSettingStore.fold ? true : false }"-->
    <div class="layout_main">
      <!-- 点击菜单展示 -->
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router'

//引入左侧菜单顶部子组件
import SliderTop from '@/views/layout/slider_top.vue'

//引入菜单组件
// import Menu from './menu/index.vue'
//右侧内容的展示区域
// import Main from './main/index.vue'
//引入顶部tabbar组件
// import Tabbar from './tabbar/index.vue'

//获取用户相关的小仓库
// import useUserStore from '../store/modules/user'
// let userStore = useUserStore()

//获取layout配置仓库
// import useLayOutSettingStore from '@/store/modules/setting'
// let LayOutSettingStore = useLayOutSettingStore()

//获取路由对象
let $route = useRoute()
console.log($route.path) //当前路由地址
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  // background-color: red;
  .layout_slider {
    color: white;
    width: $menu-width; //全局变量
    height: 100vh;
    background-color: $menu-background-color;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      // 高度需要限制，它的高度=(左侧菜单栏的高度)-(顶部logo的高度)
      height: calc(100vh - $menu-top-box-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $menu-width); //减去左侧菜单宽度
    height: $tabbar-height; //导航高度
    top: 0px;
    left: $menu-width; //左侧菜单宽度
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $menu-min-width);
      left: $menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $menu-width);
    height: calc(100vh - $tabbar-height);
    // background-color: yellowgreen;
    left: $menu-width; //左侧菜单宽度
    top: $tabbar-height;
    padding: 20px; //内容向里面挤挤
    overflow: auto; //滚动条
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $menu-min-width);
      left: $menu-min-width;
    }
  }
}
</style>
