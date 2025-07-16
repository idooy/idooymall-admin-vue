<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <FoldExpand></FoldExpand>
      <Braadcrumb></Braadcrumb>
    </div>
    <div class="tabbar_right">
      <TabbarRight></TabbarRight>
    </div>
  </div>
</template>

<script setup lang="ts">
import Braadcrumb from './Breadcrumb.vue'
import TabbarRight from './TabbarRight.vue'
import FoldExpand from './FoldExpand.vue';
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  justify-content: space-between;
  background-color: $menu-background-color;

  .tabbar_left {
    display: flex;
    // background-color: cyan;
    align-items: center; //居中
    margin-left: 10px;
  }

  .tabbar_right {
    display: flex;
    // background: skyblue;
    align-items: center;
    margin-right:20px;
  }
}
</style>
