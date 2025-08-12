<template>
  <div>
    <el-select placeholder="请选择品牌" v-model="brandId" filterable clearable @change="noticeChange">
      <el-option
        v-for="item in brands"
        :key="item.brandId"
        :label="item.brandName"
        :value="item.brandId"
      ></el-option>
    </el-select>
  </div>
</template>


<script setup lang="ts" name="BrandSelect">
import {ref,onMounted} from 'vue'
import {reqBrandOptionList} from '@/api/product/brand'
import {BrandOptionData} from '@/api/product/brand/type'

onMounted(()=>{
    getBrandOptions()
})



/**
 * 自定义属性，用来接受父组件的传值
 */
// const props = defineProps<{
//   brandId: number
// }>()
/**
 * 自定义事件，通知父组件
 */
const emit = defineEmits<{
  (e: 'change',brandId:number): void
}>()

const brandId = ref<number>()
const brands = ref<BrandOptionData[]>([])
/**
 * 总是把父组件实时传递的brandId积极的赋值给brandId响应式属性
 */
// watch(()=>props.brandId,(newVal)=>{
//     brandId.value = newVal
// })
/**
 * 把下拉框的最新值通知给父组件
 */
const noticeChange=()=>{
    emit('change',brandId.value as number)
}
/**
 * 初始化下拉框选项值
 */
const getBrandOptions=async()=>{
    await reqBrandOptionList().then(res=>{
        brands.value =  res
    })
}
</script>