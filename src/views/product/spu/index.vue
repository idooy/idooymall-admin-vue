<template>
    <!-- 场景一；展示spu商品列表数据 -->
    <el-card v-show="scene==0">
        <el-form :inline="true">
            <el-form-item>
                <d-category-cascader></d-category-cascader>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary"><el-icon><Plus/></el-icon>添加SPU商品</el-button>
        <el-table :data="tableData" style="margin: 15px 0;">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="spuName" label="SPU名称"></el-table-column>
            <el-table-column prop="spuDescription" label="SPU描述" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作"  width="230">
                <template #default="scope">
                    <el-button type="primary" size="small" icon="Plus" title=""></el-button>
                    <el-button type="success" size="small" icon="Edit" title="" @click="scene=1"></el-button>
                    <el-button type="primary" size="small" icon="View" title=""></el-button>
                    <el-button type="danger" size="small" icon="DeleteFilled" title=""></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange"
            :current-page="currentPage" 
            :page-size="pageSize" 
            :page-sizes="[5, 10]"
            :total="totalCount" 
            layout="sizes, prev, pager, next, jumper, ->, total"/>
    </el-card>
    <!-- 场景二：修改和新增spu商品数据 -->
    <el-card v-show="scene==1">
        <spu-c-m></spu-c-m>
    </el-card>
    <!-- 场景三：给spu添加对应的sku -->
    <el-card v-show="scene==2">
        <sku-form></sku-form>
    </el-card>
</template>



<script setup lang='ts' name="SPU">
import DCategoryCascader from '@/components/product/DCategoryCascader.vue';
import { SpuTableData, SpuTableDataList, type SpuQueryParam } from '@/types/product/spu';
import {ref,reactive,onMounted} from 'vue'
import {reqTableList} from '@/api/product/spu'
import SpuCM from './SpuCM.vue';
import SkuForm from './SkuForm.vue';

onMounted(()=>{
    getTableList()
})

let scene = ref<number>(0)// 0:spu列表数据；1：修改、新增spu；2、添加sku
const queryParam = reactive<SpuQueryParam>({
    categoryId:'',
    key:''
})
const totalCount = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const tableData = ref<SpuTableDataList>()

/**
 * 获取分页列表数据
 */
const getTableList= async ()=>{
    await reqTableList(currentPage.value,pageSize.value,queryParam).then(res=>{
        currentPage.value = res.currentPage
        pageSize.value = res.pageSize
        totalCount.value = res.totalCount
        tableData.value = res.list   
    })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getTableList()    
}
</script>
