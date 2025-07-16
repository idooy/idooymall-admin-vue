<template>
  <el-card class="codition-card">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getUserList()">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入搜索用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList()">搜索</el-button>
        <!-- <el-button type="primary" text bg @click="getUserList()">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button type="primary" @click="dialogVisible=true">新增用户</el-button>
    <el-button type="danger" :disabled="!mulSelection.length" @click="batchDeleteHandle()">批量删除</el-button>
    <el-text class="mx-1" type="danger" style="margin-left: 20px;">删除接口没有进行任何的逻辑处理，直接响应</el-text>
    <!-- ==========================数据列表============Start====================== -->
    <el-table style="margin:10px 0" :data="userListData" :border="true" @selection-change="selectionChange">
      
      <el-table-column type="selection" header-align="center" align='center' width="50"></el-table-column>
      <el-table-column type="index" label="#" header-align="center" align='center' width="40"></el-table-column>
      <!-- <el-table-column prop="id" header-align="center" align="center" label="id" hidden></el-table-column> -->
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="邮箱" width="180"></el-table-column>
      <!-- <el-table-column prop="createUserId" header-align="center" align="center" label="创建账号"></el-table-column> -->
      <!-- <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"width="150"></el-table-column> -->
      <el-table-column prop="status" header-align="center" align="center" label="用户状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'info'">{{ scope.row.status === 1 ? '正常' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <!-- ==============操作列================== -->
      <el-table-column label="操作" header-align="center" align="left" width="280" >
        <template #default="scope">
          <!-- <el-tooltip content="修改" placement="top"> -->
          <el-button type="primary" icon="Edit" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
          <!-- <el-button type="primary" icon="Key" @click="handleResetPwd(scope.row)" size="small">重置密码</el-button> -->
          <el-button type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)" size="small">分配角色</el-button>
          <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            width="240"
            :title='`确定删除用户【${scope.row.username}】？`'
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <!-- ==============操作列================== -->
    </el-table>
    <!-- ==========================数据列表============end====================== -->
    <!-- ============分页===========Start====== -->
    <el-pagination 
      @size-change="getUserList()" 
      @current-change="getUserList()" 
      v-model:current-page="currentPage"
      v-model:page-size="pageLimit"
      :page-sizes="[5, 10, 20, 50, 100]" 
      :total="totalCount"
      layout="sizes, prev, pager, next, jumper, ->, total" />
    <!-- ============分页===========End====== -->
  </el-card>

  <!-- 弹窗, 新增 / 修改 -->
  <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
      <!-- 添加或修改用户配置对话框 -->
  <el-dialog :title="modifyForm.userId ==''?'新增用户':'修改用户'" v-model="dialogVisible" width="650px">
    <el-form label-width="80px" :model="modifyForm" ref="ruleFormRef" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="modifyForm.username" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="modifyForm.email" type="text" placeholder="请输入邮箱地址" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="modifyForm.mobile" placeholder="请输入用户手机号" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="modifyForm.userId !==''">
          <el-form-item label="用户状态" prop="status">
            <el-switch  v-model="modifyForm.status" :active-value="1" :inactive-value="0" inline-prompt active-text="正常" inactive-text="停用"/>
          </el-form-item>
        </el-col>        
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitUserHandler(ruleFormRef)">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </template>
  </el-dialog> 
</template>

<script setup lang="ts">
import { ref, reactive, onMounted} from "vue"
import type { userList } from '@/api/user/type.ts'
import { reqUserList,reqAddUser,reqModifyUser,reqDeleteUser } from "@/api/user/user.ts";
import type { FormInstance, FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import { userData } from "@/api/user/type.ts";


const mulSelection = ref<userData[]>([]) // 选中的用户行
const currentPage = ref<number>(1)
const pageLimit = ref<number>(10)
const totalPage = ref<number>(0)
const totalCount = ref<number>(0)
let userListData = ref<userList>()
// 控制新增或修改对话框的开关
const dialogVisible = ref<boolean>(false)

// 表单校验
const ruleFormRef = ref<FormInstance>()

// 监听modifyForm,用户是否修改了表单数据
// let isEdit = ref<boolean>()

const searchForm = reactive({
    username: ''
})
let modifyForm = reactive<userData>({
  userId: '',
  username: '',
  email: '',
  mobile: '',
  status: 0,
  avatar: '',
  createUserId: '',
  createTime: ''
})

// 表单数据校验，该rules通过表单的rules属性绑定表单
const rules = reactive<FormRules<userData>>({
  username: [
    { required: true, message: '请填写用户名', trigger: 'blur' },
    { pattern:/^[a-zA-Z0-9_]{2,12}$/, message: '用户名只能包含字母、数字和下划线,长度2~12', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    { pattern:/^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/, message: '手机号码不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请填写邮箱地址', trigger: 'blur' },
    { pattern:/[\w]+@[A-Za-z]+(\.[A-Za-z0-9]+){1,2}/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
})
onMounted(() => {
  getUserList()
})
// 列表数据
const getUserList = async () => {
  await reqUserList(currentPage.value, pageLimit.value, searchForm.username).then(res => {
    userListData.value = res.list
    totalPage.value = res.totalPage
    currentPage.value = res.currPage
    totalCount.value = res.totalCount
  })
}
// 提交新增或修改用户表单数据
const submitUserHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if(modifyForm.userId !=''){
        await reqModifyUser(modifyForm).then(()=>{
          ElMessage.primary('修改用户成功')
          clearModifyForm()
          dialogVisible.value=false
          getUserList()
        })
      }else{
        // 新增
        await reqAddUser(modifyForm).then(()=>{
          ElMessage.primary('添加用户成功')
          dialogVisible.value=false
          getUserList()
          // 重置该表单项，将其值重置为初始值，并移除校验结果
          // 新增是可以利用该方法清空表单数据，因为新增的初始化数据本身就不存在
          formEl.resetFields()
        })
      }
    } 
  })
}
// 列表数据点击'编辑'按钮
const handleUpdate = (row:userData)=>{
  dialogVisible.value=true
  Object.assign(modifyForm,row)
}

// 添加/修改对话框‘取消’
const cancel = () => {
  dialogVisible.value= false
  // 还得清空表单内数据，防止编辑之后再新增表单控件都存在数据
  clearModifyForm()
}

// ‘删除’确认按钮
const handleDelete=(row:userData)=>{
  const id = new Array(parseInt(row.userId))
  reqDeleteUser(id).then(()=>{
    ElMessage.primary('删除用户成功')
    getUserList
  })
}
// ‘删除’取消按钮
// const delectCancel = ()=>{

// }

const clearModifyForm = ()=>{
    Object.assign(modifyForm,{
    userId:'',
    username:'',
    email:'',
    mobile:''
  })
}
const selectionChange = (val:userData[])=>{
  // console.log(row)
  mulSelection.value = val
}

// 批量删除
const batchDeleteHandle = ()=>{
  const ids = mulSelection.value.map(item=>item.userId)
  reqDeleteUser(ids).then(()=>{
    ElMessage.primary('批量删除用户成功')
    getUserList
  })
}
</script>

<style scoped lang="scss">
.codition-card {
  height: 80px;
  margin-bottom: 10px;
  .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>