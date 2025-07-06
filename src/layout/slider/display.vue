<!-- 系统界面展示区域，可以是项目的名称或者公司的logo等等 -->
<template>
    <div class="display-box">
        <img v-if="!setting.logo.hidden" :src="setting.logo.src" alt="" />
        <span>{{ setting.item_title }}</span>
    </div>
</template>

<script setup lang="ts">
//引入设置标题与Logo这配置文件
import setting from '@/user.setting.ts'
</script>

<script lang="ts">
export default {
    name: 'SliderTop',
}
</script>

<style scoped lang="scss">
.display-box {
    display: flex;
    width: $menu-width;
    height: $menu-top-box-height;
    color: white;
    align-items: center;
    padding: 10px;
    background-color: $menu-text-active-color;
    background: linear-gradient(to right, $menu-text-active-color, #aecdfc);
    // transition: all 0.3s;
    img {
        width: 40px;
        height: 40px;
    }

    span {
        font-size: $menu-top-box-title-fontSize;
        text-align: center;
    }
}
</style>
