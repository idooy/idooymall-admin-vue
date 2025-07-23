<template>
    <template v-for="(item) in menuList" :key="item.path">

        <!-- 没有子路由 筛选‘数据大屏’这样的路由         :unique-opened="true"-->
        <template v-if="!item.children || item.children.length == 0">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <!--首页需要特殊处理,因为首页是Layout的子路由，但又想作为一级菜单显示再main区域-->
        <template v-if="item.path == '/' && item.children?.length == 1">
            <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <!-- 有子路由且个数大于一个 -->
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <!-- 递归-->
            <d-slider-menu :menuList="item.children"></d-slider-menu>
        </el-sub-menu>
    </template>

</template>

<script setup lang="ts">

    defineProps(['menuList'])

</script>

<script lang='ts'>
export default {
    name: 'DSliderMenu',
}
</script>

<style scoped lang="scss">

</style>