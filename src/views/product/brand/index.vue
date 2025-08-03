<template>
  <el-card>
    <el-form :data="queryParams.queryForm" :inline="true">
      <el-form-item label="品牌名称">
        <el-input v-model="queryParams.queryForm.name" placeholder="请输入品牌名称查询" />
      </el-form-item>
      <el-form-item label="品牌是否显示">
        <el-select v-model="queryParams.queryForm.showStatus" placeholder="请选择品牌是否展示" clearable style="width: 180px">
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
      <el-table-column prop="name" label="品牌名称" width="180" header-align="center" align="left"/>
      <el-table-column prop="logo" label="品牌logo" width="120" align="center">
        <template #default="scope">
          <el-image style="width: 100px; height: 36px" :src="scope.row.logo" fit="contain"/>
        </template>
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
          <el-button type="success" size="large" @click="gotoEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="doDelRoleHandler(scope.row)">
            <template #reference>
              <el-button size="large" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      @size-change="getTableData()" 
      @current-change="getTableData()"
      :current-page="queryParams.currentPage" 
      :page-size="queryParams.pageSize" 
      :page-sizes="[5, 10]"
      :total="totalCount" 
      layout="sizes, prev, pager, next, jumper, ->, total" />
  </el-card>

  <!-- 新增修改 Drawer-->
  <el-dialog v-model="cmDialogVisible" @closed="clearRoleCMForm(cmBrandFormRef)">
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

</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type { FormInstance, FormRules ,UploadUserFile} from 'element-plus'
import {reqBrandTableData,reqSaveBrand,reqModifyBrand} from '@/api/product/brand'
import type {BrandCMForm, BrandQueryPageForm,BrandTableData} from '@/api/product/brand/type'
import DUpload from '@/components/upload/DUpload.vue'





onMounted(() => { initTableData() })


const cmBrandFormRef = ref<FormInstance>()
const queryParams = reactive<BrandQueryPageForm>({
    pageSize: 10,
    currentPage: 1,
    queryForm: {
        name: '',
        showStatus: '',
    }
})
const totalCount = ref<number>(0)
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
//==================================FUNCTION START==============================

const uploadSuccessHandler=(url:string)=>{
  brandCMForm.logo = url
}

// 初始化查询列表数据
const initTableData = () => {
  getTableData()
}
// 获取列表数据根据queryParams请求参数
const getTableData = async () => {
  await reqBrandTableData(queryParams).then((res) => {
    queryParams.pageSize = res.pageSize
    queryParams.currentPage = res.currentPage
    totalCount.value = res.totalCount
    tableData.value = Array.from(res.list)
  })
}

// 点击‘编辑’按钮
const gotoEdit = (row: BrandTableData) => {
  Object.assign(brandCMForm,row)
  cmDialogVisible.value = true
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
        })
      } else {
        // 新增
        await reqSaveBrand(brandCMForm).then(() => {
          // closeDrawer()
          cmDialogVisible.value = false
          getTableData()
        })
      }

    }
  })
}

// 查找角色
const searchBrandList = () => {
  getTableData()
}

// 删除‘品牌’
const doDelRoleHandler = async (row:BrandTableData) => {
  // const ids = [row.roleId]
  // await reqDelRole(row.roleId).then(() => {
  //   getTableData()
  // })

}



// 抽屉关闭的时候清空表单数据
const clearRoleCMForm = (formEl: FormInstance | undefined) => {
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
