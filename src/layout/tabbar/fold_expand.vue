<!-- 菜单折叠 -->
<template>
    <div class="icon_box">
        <!-- 顶部左侧 -->
        <el-icon :size="32" @click="changeIcon">
            <component :is="!fold ? 'Fold' : 'Expand'"></component>
        </el-icon>
    </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { layoutSttingStore } from '@/store/layout_setting.ts'
// tabbar组件上的某些状态需要被layout的其他组件感知，所以最简单的方式就是store
let layoutStore = layoutSttingStore()

const fold = ref(false)

//定义响应式数据控制菜单折叠图标切换；控制菜单折叠还是打开的变量
//点击折叠菜单图标的方法，切换需要main组件感知
const changeIcon = () => {
    //每次点击就切换折叠图标的状态
    fold.value = !fold.value
    layoutStore.fold = !layoutStore.fold

    // alert(`${fold.value} ----- ${layoutStore.fold}`)
    // 之后；tabbar和main区域的宽度要变化
}
</script>
<script lang="ts">
export default {
    name: 'FoldExpand',
}
</script>


<style scoped lang="scss">
.icon_box{
    // background-color: red;
    color:$menu-text-active-color;
    cursor:pointer;
}
</style>