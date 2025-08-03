<template>
        <el-tree 
            :data="dataSource" 
            node-key="catId" 
            :highlight-current="true"
            :props ="{label:'name',children:'children'}"
            :expand-on-click-node="false"
            @node-click="nodeClickHandler"
        >
         <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ data.name }}</span>
                </div>
            </template>
        </el-tree>
</template>



<script setup lang='ts'>
import { reqDataSourceTree} from '@/api/product/categories'
import type { CategoryTreeData } from '@/api/product/categories/type'
import {ref, onMounted} from 'vue';

const dataSource = ref<CategoryTreeData[]>([])
const emit = defineEmits(['categoryNodeClick'])


onMounted(() => {
    getDataSource()
})
// 获取tree类型的分类数据
const getDataSource = async () => {
    await reqDataSourceTree().then(res => {
        dataSource.value = res
    })
}



// node 点击事件
const nodeClickHandler = (data: CategoryTreeData)=>{
    emit('categoryNodeClick',data)
}

</script>
<script lang="ts">
export default {
    name: 'DCategoryTree'
}
</script>


<style scoped>

</style>