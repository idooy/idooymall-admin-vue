<template>
    <div class="menu-box" :class="{'width-class':layoutStore.fold}">
        <el-menu popper-effect="light" 
        style="border: 0;" 
        @select="selectHandle" 
        :collapse="layoutStore.fold"
        :collapse-transition="false"

        :default-active="defauleActive"
        >
            <template v-for="(item) in menus" :key="item.path">

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


                <!--首页需要特殊处理-->
                <template v-if="item.path == '/' && item.children?.length == 1">
                    <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" >
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
                    <!--<Menu :menuList="item.children"></Menu> -->
                    <el-menu-item v-for="sub in item.children" :key="sub.path" :index="sub.path">
                        <el-icon>
                            <component :is="sub.meta.icon"></component>
                        </el-icon>
                        <span>{{ sub.meta.title }}</span>
                    </el-menu-item>
                </el-sub-menu>

            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userStore } from '@/store/user';
import { useLayoutStore } from '@/store/layout_setting';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
// 默认选中当前路由
const route = useRoute()

const defauleActive = ref(route.path)
const layoutStore = useLayoutStore()
const user_store = userStore()
const menus = user_store.menuRoutes


let router = useRouter()
// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])


//点击菜单的回调，需要菜单绑定index属性
const selectHandle = (path: string) => {
    router.push(path)
}
</script>

<script lang='ts'>
export default {
    name: 'Menu',
}
</script>

<style scoped lang="scss">

.menu-box {
    width: $menu-max-width;
    top: $tabbar-height;
    bottom: 0;
    left: 0;
    overflow: auto;
    transition: all 0.2s;
    box-shadow: 0px 3px 5px -1px #dedbdb; 
    -ms-overflow-style: none;  /* 对于IE和Edge */
    scrollbar-width: none; /* 隐藏Firefox滚动条 */
    overflow-y: scroll;        /* 启用垂直滚动 */
}

.width-class{
    width: $menu-min-width;
}
</style>