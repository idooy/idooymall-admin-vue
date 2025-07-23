<template>
  <div class="tabbar">
    <d-head-logo></d-head-logo>
    <div class="tabbar-operation">
      <div class="left">
        <div class="icon_box">
          <el-icon :size="30" @click="changeIcon">
            <component :is="!layoutStore.fold ? 'Fold' : 'Expand'"></component>
          </el-icon>
        </div>
        <div class="bread_box">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="item in $route.matched" :to="item.path" :key="item.path">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="right">
        <d-tabbar-right></d-tabbar-right>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DTabbarRight from '@/layout/DTabbarRight.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import DHeadLogo from './DHeadLogo.vue';


import { useLayoutStore } from '@/store/layout_setting.ts'
// tabbar组件上的某些状态需要被layout的其他组件感知，所以最简单的方式就是store
let layoutStore = useLayoutStore()


//定义响应式数据控制菜单折叠图标切换；控制菜单折叠还是打开的变量
//点击折叠菜单图标的方法，切换需要main组件感知
const changeIcon = () => {
  //每次点击就切换折叠图标的状态
  layoutStore.fold = !layoutStore.fold
}

</script>

<script lang="ts">
export default {
  name: 'DHeader',
}
</script>

<style scoped lang="scss">
.tabbar {
  display: flex;
  width: 100%;
  height: $tabbar-height;
  justify-content: space-between;
  // background: linear-gradient(to right, $menu-text-active-color, #aecdfc);
  background-color: $header-background-color;
  box-shadow: 0px 1px 5px 0px #dedbdb;


  
  .tabbar-operation {
    display: flex;
    width: calc(100% - $menu-max-width);
    height: $tabbar-height;
    // background-color: pink;
    justify-content: space-between;
  }

  .left {
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: $tabbar-height;
    // background-color: red;
    .icon_box{
      color: $sys-main-color;
      cursor: pointer;
      padding-right: 10px;
    }
    .bread_box {
      display: flex;
      align-items: center;
      height: $tabbar-height;
      // background-color: pink;
    }
  }

  .right {
    display: flex;
    align-items: center;
    height: $tabbar-height;
    // background-color: yellowgreen;
  }
}
</style>
