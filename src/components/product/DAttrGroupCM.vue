<template>
    <el-dialog 
        :title="!rowData.attrGroupId ? '新增分组' : '修改分组'" 
        model-value="disabled"
        @closed="dialogCloseHandler">
        <el-form :model="rowData" 
            :rules="rules" 
            ref="dataFormRef" 
            label-width="120px"
            >
            <el-form-item label="组名" prop="attrGroupName">
                <el-input v-model="rowData.attrGroupName" placeholder="组名"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="rowData.sort" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="descript">
                <el-input v-model="rowData.attrDesc" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="组图标" prop="icon">
                <el-input v-model="rowData.icon" placeholder="组图标"></el-input>
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
                    v-model="rowData.catalogPath" 
                    placeholder="试试搜索：手机" 
                    :options="categorys" 
                    filterable
                    :props="cascaderProps"></el-cascader>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">  
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            </div>
        </template>
    </el-dialog>

</template>



<script setup lang='ts'>
import { ref, reactive,onMounted } from 'vue'
import type { AttrGroupTableData } from '@/api/product/attr/type'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import {reqDataSourceTree} from '@/api/product/categories'
import { CategoryTreeData } from '@/api/product/categories/type';
import {reqModifyAttrGroup,reqCreateAttrGroup } from '@/api/product/attr/group'

onMounted(()=>{
    initCategoryData()
})


const categorys = ref<CategoryTreeData[]>()
const dialogPorps = defineProps<{
    disabled:Boolean
    rowData: AttrGroupTableData
}>()


const emit = defineEmits<{
  (e: 'closeDialog'): void
  (e: 'refleshTableData'): void
  (e: 'clearFrom'): void
//   (e: 'update', value: string): void
}>()
const cascaderProps = {
    label:'name',
    value:'catId',
    children:'children'
}

const dataFormRef = ref<FormInstance>()

// const dataForm = reactive<AttrGroupTableData>({
//     attrGroupId: '',
//     attrGroupName: '',
//     sort: '',
//     attrDesc: '',
//     icon: '',
//     catalogId: '',
//     catalogPath:[]// 级联选择器选择的分类层级ID
// })



// 关闭对话框
const cancel = () => {
    dialogCloseHandler()
}

// 对化工关闭进行一些扫尾的工作
const dialogCloseHandler = () => {
    // 通知父组件关闭对话框
    emit('closeDialog')
    // dialogVisiable.value = false
    emit('clearFrom')
}

// 提交数据
const dataFormSubmit = async ()=>{
    // 拿到级联选择器的最后一级ID
    dialogPorps.rowData.catalogId = dialogPorps.rowData.catalogPath?.pop() as string
    if(dialogPorps.rowData.attrGroupId){
        // 修改数据
        await reqModifyAttrGroup(dialogPorps.rowData).then(()=>{
            dialogCloseHandler()
            ElMessage.success('修改属性分组成功')
            emit('refleshTableData')
        })
    }else{
        // 新增数据
        await reqCreateAttrGroup(dialogPorps.rowData).then(()=>{
            dialogCloseHandler()
            ElMessage.success('新增属性分组成功')
            emit('refleshTableData')
        })
    }
}


// 初始化获取级联选择器的数据
const initCategoryData = async ()=>{
    await reqDataSourceTree().then((res)=>{
        categorys.value = res
    })
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

<script lang='ts'>
export default {
    name: 'DAttrGroupCM'
}
</script>



<style scoped></style>