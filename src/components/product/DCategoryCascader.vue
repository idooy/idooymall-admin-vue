<template>
    <el-cascader 
        style="width: 100%;"
        v-model="categoryPath" 
        placeholder="试试搜索：手机" 
        clearable
        :options="categorys" 
        filterable
        @change="selectChange"
        :props="{label:'name',value:'catId',children:'children'}"></el-cascader>
</template>



<script setup lang='ts' name="DCategoryCascader">
import type { CategoryTreeData } from '@/api/product/categories/type'
import {ref,onMounted,watch } from 'vue';
import {reqDataSourceTree} from '@/api/product/categories'

const props = defineProps<{
    catelogPath?:number[]
}>()
const categoryPath = ref<number[]>()
const emit = defineEmits(['selectChange']);

/**
 * 监听父组件传递的catelogPath，回显的时候需要
 */
watch(()=>props.catelogPath,(newVal)=>{
    categoryPath.value = newVal
})
onMounted(()=>{
    initCategoryData()
})

const categorys = ref<CategoryTreeData[]>()


// 初始化获取级联选择器的数据
const initCategoryData = async ()=>{
    await reqDataSourceTree().then((res)=>{
        categorys.value = res
    })
}
/**
 * 当级联选择器的值被改变，’用户重新进行了选择‘
 * 1、 将选择的节点ID告知给父组件
 */
//
const selectChange = async ()=>{
    emit('selectChange',categoryPath.value)
    // 获取当前分类下的所有属性分组供用户选择
    // const lastCatId = categoryPath.value?.pop()
    // console.log('级联选择器发生了改变,====>',categoryPath.value);
    
}


</script>



<style scoped>

</style>