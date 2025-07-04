<template>
    <div class="box">
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
.box {
    width: 100%;
    height: $menu-top-box-height;
    color: white;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: $menu-top-box-background-color;
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
