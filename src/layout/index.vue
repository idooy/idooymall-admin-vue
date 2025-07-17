<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Display></Display>
      <!-- 菜单栏添加滚动条 -->
      <div class="layout_slider_menu" >
        <!-- <el-scrollbar :noresize="true" class="scrollbar"> -->
          <!-- 菜单组件 -->
            <Menu></Menu>
        <!-- </el-scrollbar> -->
      </div>

    </div>
    <!-- 顶部导航 "-->
    <!-- <div class="layout_tabbar" :class="{ fold: layoutStore.fold ? true : false }"> -->
    <div class="layout_tabbar">
      <!-- layout组件顶部组件tabbar -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold:layoutStore.fold }">
      <!-- 点击菜单展示 -->
      <Main></Main>
    </div>

  </div>
</template>

<script setup lang="ts">

//引入左侧菜单顶部子组件
import Display from '@/layout/slider/Display.vue'
//引入菜单组件
import Menu from '@/layout/slider/Menu.vue'
//右侧内容的展示区域
import Main from '@/layout/main/Main.vue'
//引入顶部tabbar组件
import Tabbar from '@/layout/tabbar/index.vue'
//获取layout配置仓库
import { useLayoutStore } from '@/store/layout_setting.ts'

let layoutStore = useLayoutStore()


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

  // background-color: red;
  .layout_slider {
    .layout_slider_menu {
      display: flex;
      top: $menu-top-box-height;
      left: 0;
      bottom: 0;
      width: $menu-max-width;
      height: calc(100vh - $menu-top-box-height);
      // background-color: $menu-background-color;
      // background-color: pink;
    }

  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $menu-max-width); //减去左侧菜单宽度
    height: $tabbar-height; //导航高度
    top: 0px;
    left: $menu-max-width; //左侧菜单宽度
    transition: all 0.3s;

    // &.fold {
    //   width: calc(100% - $menu-min-width);
    //   left: $menu-min-width;
    // }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $menu-max-width);
    height: calc(100vh - $tabbar-height);
    left: $menu-max-width; //左侧菜单宽度
    top: $tabbar-height;
    padding: 20px;
    overflow: auto; //滚动条
    transition: all 0.3s;


    &.fold {
      width: calc(100% - $menu-min-width);
      left: calc($menu-min-width + 6px);
    }
  }
}
</style>
