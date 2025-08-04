<template>
    <el-cascader 
        style="width: 100%;"
        v-model="lastCategoryId" 
        placeholder="试试搜索：手机" 
        :options="categorys" 
        filterable
        @change="changeSelected()"
        :props="{label:'name',value:'catId',children:'children',emitPath:false}"></el-cascader>
</template>



<script setup lang='ts'>
import type { CategoryTreeData } from '@/api/product/categories/type'
import {ref,onMounted } from 'vue';
import {reqDataSourceTree} from '@/api/product/categories'

const emit = defineEmits(['selected']);

onMounted(()=>{
    initCategoryData()
})

const categorys = ref<CategoryTreeData[]>()
const lastCategoryId = ref<string>()


// 初始化获取级联选择器的数据
const initCategoryData = async ()=>{
    await reqDataSourceTree().then((res)=>{
        categorys.value = res
    })
}

const changeSelected = ()=>{
    emit('selected',lastCategoryId.value)
}


</script>
<script lang="ts">
export default {
    name: 'DCategoryCascader'
}
</script>


<style scoped>

</style>