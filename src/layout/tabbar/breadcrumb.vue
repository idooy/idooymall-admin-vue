<template>
  <div class="breadcrumb-box">
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <!-- 面包屑需要动态展示路由名称与标题 -->
      <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
        <!-- 图标 -->
        <el-icon style="vertical-align: middle">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 名称 -->
        <span style="vertical-align: middle;padding-left: 2px;">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<script setup lang="ts">

</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>


<style lang="scss">
.breadcrumb-box{
  margin-left: 8px;
}
</style>
