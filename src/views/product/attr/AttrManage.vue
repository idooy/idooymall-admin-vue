<template>
    <!-- <span style="padding: 5px;color:red">默认查询所有分类下属性；可选择三级分类，查询指定分类下的属性信息。</span> -->
    <el-card>
        <el-form :inline="true" :model="queryParams" @keyup.enter.native="getDataList()">
            <el-form-item>
                <d-category-cascader @select-change="selectedCategoryId"></d-category-cascader>
            </el-form-item>
            <el-form-item>
                <el-input v-model="queryParams.key" placeholder="支持属性id\属性名模糊查询" clearable
                    style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="getDataList()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="toAddAttr">新增属性</el-button>
        <el-table :data="dataList" border :show-overflow-tooltip="true" style="width: 100%;margin: 15px 0;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="attrId" header-align="center" align="center" label="属性ID" width="55">
            </el-table-column>
            <!-- <el-table-column type="index" header-align="center" align="center" label="序号">
                    </el-table-column> -->
            <el-table-column prop="attrName" header-align="center" align="center" label="属性名" width="120">
            </el-table-column>
            <!-- <el-table-column prop="searchType" header-align="center" align="center" label="搜索类型">
                    </el-table-column> -->
            <!-- <el-table-column prop="icon" header-align="center" align="center" label="图标">
                    </el-table-column> -->
            <!-- <el-table-column prop="valueSelect" width="40" header-align="center" align="center" label="可选值">
                    </el-table-column> -->
            <!-- <el-table-column prop="valueType" header-align="center" align="center" label="值类型">
                    </el-table-column>
                    <el-table-column prop="attrType" header-align="center" align="center" label="属性类型">
                    </el-table-column>
                    <el-table-column prop="enable" header-align="center" align="center" label="是否有效"> -->
            <!-- </el-table-column> -->
            <!-- <el-table-column prop="attrGroupId" header-align="center" align="center" label="分组ID">
                    </el-table-column> -->
            <el-table-column prop="attrGroupName" header-align="center" align="center" label="分组名">
            </el-table-column>
            <!-- <el-table-column prop="categoryId" header-align="center" align="center" label="分类ID">
                    </el-table-column> -->
            <el-table-column prop="catalogName" header-align="center" align="center" label="分类名称">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
                <template #default="scope">
                    <!-- <el-button type="success" link size="small" @click="relationHandle(scope.row)"> 关联 </el-button> -->
                    <el-button type="primary" link size="small" @click="toEdit(scope.row)">修改</el-button>
                    <el-popconfirm title="确认删除?" @confirm="doDelHandler(scope.row)">
                        <template #reference>
                            <el-button link size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-size="pageSize" :page-sizes="[5, 10]" :total="totalCount"
            layout="sizes, prev, pager, next, jumper, ->, total" />
    </el-card>

    <d-attr-create-modify v-if="dialogShow" 
        :visiable="dialogShow"
        @close="closeCMDialog"
    :attr-id="attrId"></d-attr-create-modify>


</template>



<script setup lang='ts'>
import DCategoryCascader from '@/components/product/DCategoryCascader.vue';
import { reactive, ref, onMounted } from 'vue';
import { FormRules } from 'element-plus';
import type { QueryAttrGroupForm, AttrGroupTableData } from '@/types/product/attrGroup';
import { reqAttrTableData ,reqBatchDeleteAttr} from '@/api/product/attr'
import type { AttrTableData } from '@/types/product/attr'
import DAttrCreateModify from '@/components/product/DAttrCreateModify.vue'

onMounted(() => {
    getDataList()
})

const dialogShow = ref(false)
const attrId = ref<number>(0)
const queryParams = reactive<QueryAttrGroupForm>({
    key: '',
    categoryId: ''
})
const totalCount = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const dataList = ref<AttrTableData[]>([])

// =========================================================


/**
 * 子传父
 * 把用户选择分类的最后一级赋值给查询表单
 * @param lastCategoryId 最后一级分类ID
 */
const selectedCategoryId = (lastCategoryId: string) => {
    queryParams.categoryId = lastCategoryId
}


// 点击编辑
const toEdit = (row: AttrTableData) => {
    attrId.value = row.attrId
    dialogShow.value = true
}
// 子组件通知关闭dialog
const closeCMDialog =()=>{
    dialogShow.value = false
}
// 点击'新增属性‘
const toAddAttr = () => {
    // initCategoryData()
    // 打开新增、修改对话框
    dialogShow.value = true
    attrId.value = 0
}
// const dataFormSubmit = async (formEl: FormInstance | undefined)=>{
//     if (!formEl) return
//     await formEl.validate( async (valid, fields) => {
//         if (valid) {
//                 // 拿到级联选择器的最后一级ID
//             cmForm.catalogId = cmForm.catalogPath?.pop() as string
//             if(cmForm.attrGroupId){
//                 // 修改数据
//                 await reqModifyAttrGroup(cmForm).then(()=>{
//                     dialogCloseHandler(formEl)
//                     ElMessage.success('修改属性分组成功')
//                     getDataList()
//                 })
//             }else{
//                 // 新增数据
//                 await reqCreateAttrGroup(cmForm).then(()=>{
//                     dialogCloseHandler(formEl)
//                     ElMessage.success('新增属性分组成功')
//                     getDataList()
//                 })
//             }
//         }

//     })

// }




// 删除
const doDelHandler = async (row: AttrTableData) => {
    const idArr = [row.attrId]
    await reqBatchDeleteAttr(idArr).then(() => {
        getDataList()
    })
}

/**
 * 查询列表数据
 */
const getDataList = async () => {
    await reqAttrTableData(currentPage.value, pageSize.value, queryParams).then(res => {
        dataList.value = Array.from(res.list)
        totalCount.value = res.totalCount
    })
}



const handleSizeChange = (val: number) => {
    pageSize.value = val
    getDataList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getDataList()
}

const rules = reactive<FormRules<AttrGroupTableData>>({
    attrGroupName: [
        { required: true, message: "组名不能为空", trigger: "blur" },
    ],
    sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
    attrDesc: [
        { required: true, message: "描述不能为空", trigger: "blur" },
    ],
    icon: [{ required: true, message: "组图标不能为空", trigger: "blur" }],
    catalogPath: [{ required: true, message: "请选择所属分类", trigger: "blur" }],

})

</script>



<style scoped></style>