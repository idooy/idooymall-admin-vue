<template>
<span style="padding: 5px;color:#409eff">列表展示左边所选分类下的数据，否则默认查询所有分类下的属性分组信息</span>
<el-card>
    <el-row :gutter="20">
        <!-- category-tree-node-click 这个事件名是子组件中自己定义的，向上传递事件 -->
        <el-col :span="6">
            <d-category-tree @category-node-click="handleTreeNodeClick"></d-category-tree>
        </el-col>
        <el-col :span="18">
            <div class="mod-config">
                <el-form :inline="true" :model="queryParams" @keyup.enter.native="getDataList()">
                    <el-form-item>
                        <el-input v-model="queryParams.key" placeholder="支持分组id\分组名模糊查询" clearable style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!-- v-if="isAuth('product:attrgroup:save')" -->
                        <el-button type="success" @click="getDataList()">查询</el-button>
                        <el-button type="primary" @click="toAdd()">新增</el-button>
                        <!-- <el-button v-if="isAuth('product:attrgroup:delete')" type="danger" @click="deleteHandle()"
                            :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
                    </el-form-item>
                </el-form>
                <el-table :data="dataList" border :show-overflow-tooltip="true"
                    style="width: 100%">
                    <el-table-column type="selection" header-align="center" align="center" width="50">
                    </el-table-column>
                    <!-- <el-table-column prop="attrGroupId" header-align="center" align="center" label="分组id"> -->
                    <el-table-column type="index" header-align="center" align="center" label="序号">
                    </el-table-column>
                    <el-table-column prop="attrGroupName" header-align="center" align="center" label="分组名">
                    </el-table-column>
                    <el-table-column prop="sort" width="40" header-align="center" align="center" label="排序">
                    </el-table-column>
                    <el-table-column prop="attrDesc" header-align="center" align="center" label="描述">
                    </el-table-column>
                    <el-table-column prop="icon" header-align="center" align="center" label="组图标">
                    </el-table-column>
                    <el-table-column prop="catalogId" header-align="center" width="80" align="center" label="所属分类id">
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
                            <!-- <el-button type="danger" link size="small" @click="deleteHandle(scope.row)">删除</el-button> -->
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
                <!-- 修改关联关系弹窗
                <relation-update v-if="relationVisible" ref="relationUpdate"
                    @refreshData="getDataList"></relation-update> -->
            </div>
        </el-col>
    </el-row>
</el-card>
<!-- 弹窗, 新增 / 修改-->
<!-- <d-attr-group-c-m 
    :disabled="cmDialogVisiable"
    :rowData="attrRowData"
    @close-dialog="clearFromData"
    @reflesh-table-data="getDataList"
    @clear-from="clearFromData"
>
</d-attr-group-c-m>  -->
    <el-dialog 
        :title="!cmForm.attrGroupId ? '新增分组' : '修改分组'" 
        v-model="cmDialogVisiable"
        @closed="dialogCloseHandler(dataFormRef)">
        <el-form :model="cmForm" 
            :rules="rules" 
            ref="dataFormRef" 
            label-width="120px"
            >
            <el-form-item label="组名" prop="attrGroupName">
                <el-input v-model="cmForm.attrGroupName" placeholder="组名"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="cmForm.sort" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="descript">
                <el-input v-model="cmForm.attrDesc" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="组图标" prop="icon">
                <el-input v-model="cmForm.icon" placeholder="组图标"></el-input>
                <!-- <el-row>
                    <el-col :span="24">
                        <el-popover ref="iconListPopover" placement="bottom-start" trigger="click"
                            popper-class="mod-menu__icon-popover">
                            <div class="mod-menu__icon-inner">
                                <div class="mod-menu__icon-list">
                                    <el-button v-for="(item, index) in iconList" :key="index"
                                        @click="iconActiveHandle(item)"
                                        :class="{ 'is-active': item === dataForm.icon }">
                                        <icon-svg :name="item"></icon-svg>
                                    </el-button>
                                </div>
                            </div>
                        </el-popover>
                        <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true"
                            placeholder="菜单图标名称" class="icon-list__input"></el-input>
                    </el-col>
                </el-row> -->
            </el-form-item>
            <el-form-item label="所属分类" prop="catalogIds">
                <!-- 三级分类下拉框，得到的值是整个路径值，类似于[2,24,255] -->
                <el-cascader 
                    style="width: 100%;"
                    v-model="cmForm.catalogPath" 
                    placeholder="试试搜索：手机" 
                    :options="categorys" 
                    filterable
                    :props="{label:'name',value:'catId',children:'children'}"></el-cascader>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">  
                <el-button @click="cancel(dataFormRef)">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit(dataFormRef)">确定</el-button>
            </div>
        </template>
    </el-dialog>

</template>



<script setup lang='ts'>
import DCategoryTree from '@/components/product/DCategoryTree.vue';
// import DAttrGroupCM from '@/components/product/DAttrGroupCM.vue';
import type { CategoryTreeData } from '@/api/product/categories/type'
import { reactive,ref,onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import type { QueryAttrGroupForm,AttrGroupTableData } from '@/api/product/attr/type';
import { reqAttrGroupTableData,reqBatchDelete,reqModifyAttrGroup,reqCreateAttrGroup  } from '@/api/product/attr/group';
import {reqDataSourceTree} from '@/api/product/categories'


onMounted(()=>{
    getDataList()
})


const cmDialogVisiable = ref<Boolean>(false)
const queryParams = reactive<QueryAttrGroupForm>({
    key:'',
    categoryId:''

})
const dataFormRef = ref<FormInstance>()
const categorys = ref<CategoryTreeData[]>()
const totalCount = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const dataList = ref<AttrGroupTableData[]>([])
// const attrRowData = ref<AttrGroupTableData>()
const cmForm = reactive<AttrGroupTableData>({
    attrGroupId: '',
    attrGroupName: '',
    sort: '',
    attrDesc: '',
    icon: '',
    catalogId: '',
    catalogPath:[]// 级联选择器选择的分类层级ID
})




// 点击编辑
const toEdit = (row:AttrGroupTableData)=>{
    initCategoryData()
    // 将当前行数据传给子组件进行回显
    Object.assign(cmForm,row)
    // 打开新增、修改对话框
    cmDialogVisiable.value = true


}
// 点击编辑
const toAdd = ()=>{
    initCategoryData()
    // 打开新增、修改对话框
    cmDialogVisiable.value = true


}
const dataFormSubmit = async (formEl: FormInstance | undefined)=>{
    if (!formEl) return
    await formEl.validate( async (valid, fields) => {
        if (valid) {
                // 拿到级联选择器的最后一级ID
            cmForm.catalogId = cmForm.catalogPath?.pop() as string
            if(cmForm.attrGroupId){
                // 修改数据
                await reqModifyAttrGroup(cmForm).then(()=>{
                    dialogCloseHandler(formEl)
                    ElMessage.success('修改属性分组成功')
                    getDataList()
                })
            }else{
                // 新增数据
                await reqCreateAttrGroup(cmForm).then(()=>{
                    dialogCloseHandler(formEl)
                    ElMessage.success('新增属性分组成功')
                    getDataList()
                })
            }
        }
        
    })
    
}



// 修改新增取消
const cancel = (formEl: FormInstance | undefined) => {
   dialogCloseHandler(formEl)
   
}
// 对化工关闭进行一些扫尾的工作
const dialogCloseHandler = (formEl: FormInstance | undefined) => {
    cmDialogVisiable.value = false
    clearFromData()
    if (formEl) formEl.resetFields()
}
// 初始化获取级联选择器的数据
const initCategoryData = async ()=>{
    await reqDataSourceTree().then((res)=>{
        categorys.value = res
    })
}

// 删除
const doDelHandler = async (row:AttrGroupTableData)=>{
    const idArr = [row.attrGroupId]
    await reqBatchDelete(idArr).then(()=>{
        getDataList()
    })
}

/**
 * 查询列表数据
 */
const getDataList = async ()=>{
    await reqAttrGroupTableData(currentPage.value,pageSize.value,queryParams).then(res=>{
        dataList.value =Array.from(res.list)
        totalCount.value = res.totalCount
    })
}

/**
 * 感知分类节点点击
 */
const handleTreeNodeClick =(data: CategoryTreeData)=>{
    // console.log(data)
    queryParams.categoryId = data.catId

}

// 请空表单数据
const clearFromData = ()=>{
    Object.assign(cmForm,{
        attrGroupId: '',
        attrGroupName: '',
        sort: '',
        attrDesc: '',
        icon: '',
        catalogId: '',
        catalogPath:[]// 级联选择器选择的分类层级ID
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