<!-- 系统界面展示区域，可以是项目的名称或者公司的logo等等 -->
<template>
    <div class="display-box">
        <!-- <img v-if="!setting.logo.hidden" :src="setting.logo.src" alt="" /> -->
        <el-icon color="#409eff" size="40"><Eleme /></el-icon>
        <!-- <span>{{ setting.item_title }}</span> -->
         <img src="../assets/images/display_title.png">
    </div>
</template>

<script setup lang="ts">
//引入设置标题与Logo这配置文件
import setting from '@/user.setting.ts'
</script>

<script lang="ts">
export default {
    name: 'DHeader',
}
</script>

<style scoped lang="scss">
.display-box {
    display: flex;
    width: $menu-max-width;
    height: $header-height;
    align-items: center;
    // justify-items: center;
    justify-content: center;
    padding: 10px;
    img {
        height: $header-height;
    }
}
</style>
