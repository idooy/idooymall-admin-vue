<template>
  <span>预览文件：出于安全考虑，通过OSS默认 Bucket域名访问文件时，OSS会强制增加下载响应头，导致浏览器强制下载文件。使用自定义域名访问文件不会强制增加下载响应头，从而实现在浏览器中预览文件</span>
  <p>所以列表中展示的仅仅是Logo URL</p>
  <el-card>
    <el-form :data="queryParams" :inline="true">
      <el-form-item label="品牌名称">
        <el-input v-model="queryParams.name" placeholder="请输入品牌名称查询" />
      </el-form-item>
      <el-form-item label="品牌是否显示">
        <el-select v-model="queryParams.showStatus" placeholder="请选择品牌是否展示" clearable style="width: 180px">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBrandList">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 5px;">
    <el-button type="primary" @click="cmDialogVisible = true">新增品牌</el-button>
    <el-table style="margin:15px 0;width: 100%" :data="tableData" :border="true" :show-overflow-tooltip="true">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="name" label="品牌名称" width="120" header-align="center" align="left"/>
      <el-table-column prop="logo" label="品牌logo" width="180" align="center">
        <!-- <template #default="scope">
          <el-image style="width: 100px; height: 36px" :src="scope.row.logo" fit="contain"/>
        </template> -->
      </el-table-column>
      <el-table-column prop="firstLetter" label="检索首字母" width="100" align="center" />
      <el-table-column label="是否显示" width="100" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.showStatus" active-value="1" inactive-value="0"/>
        </template>
      </el-table-column>

      <el-table-column prop="brandDescribe" label="描述" align="center" />
      <!-- <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" /> -->
      <el-table-column label="操作" width="180" align="center" >
        <template #default="scope">
          <el-button link type="primary" @click="relationQuery(scope.row)">分类关联</el-button>
          <el-button link type="success" @click="gotoEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="doDelRoleHandler(scope.row)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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

  <!-- 新增修改 Drawer-->
  <el-dialog v-model="cmDialogVisible" @closed="clearBrandCMForm(cmBrandFormRef)">
    <template #header>
      <h4>{{ brandCMForm.brandId ? '修改品牌信息' : '添加品牌' }}</h4>
    </template>
    <template #default>
      <el-form ref="cmBrandFormRef" :model="brandCMForm" :rules="cmRules" width="800px">
        <el-form-item prop="name" label="品牌名称" label-width="100px">
          <el-input v-model="brandCMForm.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item prop="logo" label="品牌Logo" label-width="100px">
          <!-- <el-input v-model="brandCMForm.logo"/> -->
          <d-upload v-model="brandCMForm.logo" @upload-success="uploadSuccessHandler"></d-upload>  
        </el-form-item>
        <el-form-item prop="firstLetter" label="首字母检索" label-width="100px">
          <el-input v-model="brandCMForm.firstLetter" placeholder="请输入品首字母检索" />
        </el-form-item>
        <el-form-item prop="sort" label="排序" label-width="100px">
          <el-input v-model="brandCMForm.sort" />
        </el-form-item>
        <el-form-item prop="brandDescribe" label="描述" label-width="100px">
          <el-input v-model="brandCMForm.brandDescribe" type="textarea"  />
        </el-form-item>

      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto; margin-bottom: 48px;">
        <el-button @click="cmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doCMHandler(cmBrandFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 关联分类 Drawer-->
  <el-dialog v-model="relDialogVisiable" width="800">
    <template #header>
      <h4>品牌关联分类信息</h4>
    </template>
    <template #default>
      <el-button type="primary" size="small" @click="toAddRel()">添加关联关系</el-button>
      <el-table :data="brandRelData" stripe style="width: 100%;margin: 15px 0;" :border="true">
        <el-table-column type="index" label="序号" />
        <el-table-column prop="brandName" label="品牌名称"/>
        <el-table-column prop="categoryName" label="分类名称"/>
        <el-table-column label="操作">
           <template #default="scope">
                <el-popconfirm title="确认删除?" @confirm="doDelBrandRelHandler(scope.row)">
                  <template #reference>
                    <el-button link type="danger" size="small">移除</el-button>
                  </template>
                </el-popconfirm>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination 
        @size-change="relHandleSizeChange" 
        @current-change="relHandleCurrentChange"
        :current-page="relCurrentPage" 
        :page-size="relPageSize" 
        :page-sizes="[5, 10]"
        :total="relTotalCount" 
        layout="sizes, prev, pager, next, jumper, ->, total"/>
<!-- inner dialog -->
      <el-dialog
        v-model="innerVisible" width="500" title="添加品牌的分类" append-to-body>
          <el-form :inline="true" :model="relationForm" class="demo-form-inline">
              <el-form-item label="请选择分类信息">
                  <d-category-cascader @selected="getSelCategoryId"></d-category-cascader>              
                <!-- <el-input v-model="relationForm.categoryId" placeholder="请选择分类信息" clearable /> -->
            </el-form-item>
          </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="innerVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitRelations"> 添加关联 </el-button>
              </div>
            </template>    
      </el-dialog>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRaw } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {reqBrandTableData,reqSaveBrand,reqModifyBrand,reqDelBrand,reqCategoryByBrandId,reqDelBrandRel,reqSaveBrandRel} from '@/api/product/brand'
import type {BrandCMForm, BrandQueryPageForm,BrandTableData,BrandRelTableData} from '@/api/product/brand/type'
import DUpload from '@/components/upload/DUpload.vue'
import type { CategoryTreeData } from '@/api/product/categories/type'
import DCategoryCascader from '@/components/product/DCategoryCascader.vue'



onMounted(() => { initTableData() })

// const brandId = ref()
const cmBrandFormRef = ref<FormInstance>()
const queryParams = reactive<BrandQueryPageForm>({
    name: '',
    showStatus: '',

})

const relationForm = reactive<BrandRelTableData>({
  brandId:'',
  categoryId:'',
})
const innerVisible = ref(false)
const relDialogVisiable = ref(false)
const totalCount = ref<number>(0)
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const relTotalCount = ref<number>(0)
const relCurrentPage = ref<number>(1)
const relPageSize = ref<number>(10)
const tableData = ref<BrandTableData[]>([])
const cmDialogVisible = ref<boolean>(false)
const brandCMForm = reactive<BrandCMForm>({
  brandId:'',
  name:'',
  logo:'',
  brandDescribe:'',
  firstLetter:'',
  sort:'0',
  showStatus:'1'
})

const cmRules = reactive<FormRules<BrandTableData>>({
    name: [
      { required: true, message: '请填写品牌名称', trigger: 'blur' }
    ],
    logo: [
      { required: true, message: '请填写上传品牌logo', trigger: 'blur' }
    ],
    firstLetter: [
      { required: true, message: '请填写品牌检索首字母', trigger: 'blur' }
    ],
    brandDescribe: [
      { required: true, message: '请填写品牌描述', trigger: 'blur' }
    ],
    sort: [
      { required: true, message: '请填写品牌排序', trigger: 'blur' }
    ]
})
const brandRelData=ref<BrandRelTableData[]>([])
//==================================FUNCTION START==============================

//提交关联数据
const submitRelations=async ()=>{
  console.log(relationForm)

  await reqSaveBrandRel(relationForm).then(()=>{
    ElMessage.success("添加分类成功")
    innerVisible.value = false
    getBrandRelTableData()
  })
}



// 拿到级联选择器选中的分类数据
const getSelCategoryId=(lastCategoryId:string)=>{
  // const lastCategoryId = toRaw(selectedResult)
  // 只要之后一级分类ID
  // console.log(lastCategoryId)
  relationForm.categoryId = lastCategoryId

}



// 打开‘新增关联关系对话框’
const toAddRel=()=>{
  innerVisible.value = true
}

// 删除品牌和分类的关联关系
const doDelBrandRelHandler = async (row:BrandRelTableData)=>{
  const id = [Number(row.id)]
  await reqDelBrandRel(id).then(()=>{
    ElMessage.success("移除品牌与分类关联关系成功")
    getBrandRelTableData()
  })
}

const uploadSuccessHandler=(url:string)=>{
  brandCMForm.logo = url
}

// 初始化查询列表数据
const initTableData = () => {
  getTableData()
}
// 获取列表数据根据queryParams请求参数
const getTableData = async () => {
  await reqBrandTableData(currentPage.value,pageSize.value,queryParams).then((res) => {
    pageSize.value = res.pageSize
    currentPage.value = res.currentPage
    totalCount.value = res.totalCount
    tableData.value = Array.from(res.list)
  })
}

// 点击‘编辑’按钮
const gotoEdit = (row: BrandTableData) => {
  Object.assign(brandCMForm,row)
  cmDialogVisible.value = true
}
// 品牌关联分类数据查询
const relationQuery=async (row:BrandTableData)=>{
  relationForm.brandId = row.brandId
  relDialogVisiable.value = true
  getBrandRelTableData()

  
}
//查询品牌关联分类数据
const getBrandRelTableData = async ()=>{
  const brandId = relationForm.brandId
  await reqCategoryByBrandId(relCurrentPage.value,relPageSize.value,Number(brandId)).then(result=>{
    relCurrentPage.value = result.currentPage
    brandRelData.value = result.list
    relPageSize.value =result.pageSize
    relTotalCount.value =result.totalCount
  })
}


// 新增或者修改的表单提交
const doCMHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (brandCMForm.brandId) {
        // 修改
        await reqModifyBrand(brandCMForm).then(() => {
          // closeDrawer()
          cmDialogVisible.value = false
          getTableData()
          ElMessage.success("修改品牌信息成功")
        })
      } else {
        // 新增
        await reqSaveBrand(brandCMForm).then(() => {
          // closeDrawer()
          cmDialogVisible.value = false
          getTableData()
          ElMessage.success("添加品牌信息成功")
        })
      }

    }
  })
}

// 查找品牌列表数据
const searchBrandList = () => {
  getTableData()
}

// 删除‘品牌’
const doDelRoleHandler = async (row:BrandTableData) => {
  const ids = [Number(row.brandId)]
  await reqDelBrand(ids).then(() => {
    getTableData()
  })

}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTableData()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getTableData()    
}
const relHandleSizeChange = (val: number) => {
  relPageSize.value = val
  getTableData()
}
const relHandleCurrentChange = (val: number) => {
    relCurrentPage.value = val
    getTableData()    
}

// 抽屉关闭的时候清空表单数据
const clearBrandCMForm = (formEl: FormInstance | undefined) => {
  // 表单不但要回到初始状态，还要请空
  if(!formEl) return 
  formEl.resetFields
  Object.assign(brandCMForm,{
      brandId:'',
      name:'',
      logo:'',
      describe:'',
      firstLetter:'',
  })
}


</script>



<style></style>
