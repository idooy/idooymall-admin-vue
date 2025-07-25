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
    <el-button type="primary" @click="cmDialogVisible = true">新增用户</el-button>
    <el-popconfirm confirm-button-text="是" cancel-button-text="否" width="240" title="确定批量删除用户？"
      @confirm="batchDeleteHandle()">
      <template #reference>
        <el-button type="danger" :disabled="!mulSelection.length">批量删除</el-button> 
      </template>
    </el-popconfirm>

    <!-- ==========================数据列表============Start====================== -->
    <el-table style="margin:10px 0" :data="userListData" :border="true" @selection-change="selectionChange"
      :show-overflow-tooltip="true">

      <el-table-column type="selection" header-align="center" align='center' width="50" />
      <el-table-column type="index" label="#" header-align="center" align='center' width="40" />
      <!-- <el-table-column prop="id" header-align="center" align="center" label="id" hidden></el-table-column> -->
      <el-table-column prop="userAccount" header-align="center" align="center" label="账号" />
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号码" width="120" />
      <el-table-column prop="email" header-align="center" align="center" label="邮箱" width="180" />
      <el-table-column prop="status" header-align="center" align="center" label="用户状态">
        <template #default="scope">
          <el-tag :type="scope.row.userStatus.key == '1' ? 'primary' : 'info'">{{ scope.row.userStatus.text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建者账号" />
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间" width="90" />
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间" width="90" />
      <!-- ==============操作列================== -->
      <el-table-column label="操作" header-align="center" align="left" min-width="265" fixed="right">
        <template #default="scope">
          <!-- <el-tooltip content="修改" placement="top"> -->
          <el-button type="primary" icon="Edit" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
          <!-- <el-button type="primary" icon="Key" @click="handleResetPwd(scope.row)" size="small">重置密码</el-button> -->
          <el-button type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)" size="small">分配角色</el-button>
          <el-popconfirm confirm-button-text="是" cancel-button-text="否" width="240"
            :title='`确定删除用户【${scope.row.userAccount}】？`' @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger" icon="Delete" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="getUserList()" @current-change="getUserList()" v-model:current-page="currentPage"
      v-model:page-size="pageLimit" :page-sizes="[5, 10, 20, 50, 100]" :total="totalCount"
      layout="sizes, prev, pager, next, jumper, ->, total" />
    <!-- ============分页===========End====== -->
  </el-card>

  <!-- 弹窗, 新增 / 修改 -->
  <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
  <!-- 添加或修改用户配置对话框 -->
  <el-dialog :title="modifyForm.userId ? '修改系统用户' : '新增系统用户'" v-model="cmDialogVisible" width="450px"
    @closed="clearModifyForm(ruleFormRef)">
    <el-form label-width="80px" :model="modifyForm" ref="ruleFormRef" :rules="rules">
      <el-form-item label="用户名" prop="userAccount">
        <el-input v-model="modifyForm.userAccount" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="modifyForm.email" type="text" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="modifyForm.mobile" placeholder="请输入用户手机号" />
      </el-form-item>
      <!-- <el-form-item label="用户图像" prop="avatar">
        <el-upload
          v-if="!modifyForm.userId"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"> 上传用户图像</div>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="用户状态" prop="userStatus" v-if="modifyForm.userId">
        <el-switch v-model="modifyForm.userStatus" 
          :active-value="1" 
          :inactive-value="0" 
          inline-prompt active-text="正常"
          inactive-text="停用" 
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitUserHandler(ruleFormRef)">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 分配角色对话框 -->
  <el-dialog title="分配角色" v-model="roleCheckDialogVisiable" width="450px">
    <el-checkbox-group v-model="checkRoleList">
      <el-checkbox v-for="role in allRoleList" :value="role.roleId" :label="role.roleId">
        {{ `${role.roleName}-${role.remark}` }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitUserOfRoles()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { UserTableData, UserCMForm } from '@/api/acl/user/type'
import { reqUserList, reqAddUser, reqModifyUser, reqDeleteUser, reqUserOfRole, reqSubmitUserOfRoles } from "@/api/acl/user";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reqAllRole } from '@/api/acl/role'
import { RoleTableData } from "@/api/acl/role/type";


const userid = ref<string>() // 当前是哪个用户在分配角色
const roleCheckDialogVisiable = ref(false)
const checkRoleList = ref<number[]>()
const allRoleList = ref<RoleTableData[]>([])
const mulSelection = ref<UserTableData[]>([]) // 选中的用户行
const currentPage = ref<number>(1)
const pageLimit = ref<number>(10)
const totalPage = ref<number>(0)
const totalCount = ref<number>(0)
let userListData = ref<UserTableData[]>([])
const cmDialogVisible = ref<boolean>(false)// 控制新增或修改对话框的开关
const ruleFormRef = ref<FormInstance>() // 表单实例

// 监听modifyForm,用户是否修改了表单数据
// let isEdit = ref<boolean>()

const searchForm = reactive({
  username: ''
})
let modifyForm = reactive<UserCMForm>({
  userId: '',
  userAccount: '',
  email: '',
  mobile: '',
  userStatus: 1,
  avatar: '',
})

// 表单数据校验，该rules通过表单的rules属性绑定表单
const rules = reactive<FormRules<UserCMForm>>({
  userAccount: [
    { required: true, message: '请填写用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]{2,12}$/, message: '用户名只能包含字母、数字和下划线,长度2~12', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    { pattern: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/, message: '手机号码不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请填写邮箱地址', trigger: 'blur' },
    { pattern: /[\w]+@[A-Za-z]+(\.[A-Za-z0-9]+){1,2}/, message: '邮箱格式不正确', trigger: 'blur' },
  ],
})
onMounted(() => {
  getUserList()
})


//===========================function=======================================

// 提交角色id
const submitUserOfRoles = () => {
  reqSubmitUserOfRoles(userid.value as string, checkRoleList.value as number[])
    .then(() => {
      roleCheckDialogVisiable.value = false
    })


}


// 分配角色
const handleAuthRole = async (row: UserTableData) => {
  userid.value = row.userId
  // 0、查询系统所有角色
  await reqAllRole().then(roleList => {
    allRoleList.value = roleList
  })
  // 1、查询该用户当前已存在的角色进行回显
  await reqUserOfRole(row.userId).then((existRoleList) => {
    checkRoleList.value = existRoleList
  })

  roleCheckDialogVisiable.value = true

}



// 列表数据
const getUserList = async () => {
  await reqUserList(currentPage.value, pageLimit.value, searchForm.username).then(res => {
    userListData.value = res.list
    totalPage.value = res.totalPage
    currentPage.value = res.currentPage
    totalCount.value = res.totalCount
  })
}
// 提交新增或修改用户表单数据
const submitUserHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (modifyForm.userId) {
        await reqModifyUser(modifyForm).then(() => {
          ElMessage.success('修改用户成功')
          cmDialogVisible.value = false
          getUserList()
        })
      } else {
        // 新增
        await reqAddUser(modifyForm).then(() => {
          ElMessage.success('添加用户成功')
          cmDialogVisible.value = false
          getUserList()
        })
      }
    }
  })
}
// 列表数据点击'编辑'按钮
const handleUpdate = (row: UserTableData) => {
  cmDialogVisible.value = true
  modifyForm.userId= row.userId
  modifyForm.userAccount=row.userAccount
  modifyForm.email=row.email
  modifyForm.mobile=row.mobile
  modifyForm.userStatus=Number(row.userStatus.key)
  // assign(modifyForm,row)
}

// 添加/修改对话框‘取消’
const cancel = () => {
  cmDialogVisible.value = false
  // 还得清空表单内数据，防止编辑之后再新增表单控件都存在数据
}

// 清空修改、新增表单数据以及校验报错在关闭对话框的时候
const clearModifyForm = (formEl: FormInstance | undefined) => {

  modifyForm.userId=''
  modifyForm.userAccount=''
  modifyForm.email=''
  modifyForm.mobile=''
  modifyForm.userStatus=1

  if (formEl) {
    formEl.resetFields()
  }

}
const selectionChange = (val: UserTableData[]) => {
  // console.log(row)
  mulSelection.value = val
}

// ‘删除’确认按钮，数据行单个删除
const handleDelete = async (row: UserTableData) => {
  await reqDeleteUser([row.userId]).then(() => {
    ElMessage.primary('删除用户成功')
    getUserList()
  })
}


// 批量删除
const batchDeleteHandle = async () => {
  const ids = mulSelection.value.map(item => item.userId)
  await reqDeleteUser(ids).then(() => {
    ElMessage.primary('批量删除用户成功')
    getUserList()
  })
}
</script>

<style scoped lang="scss">
.codition-card {
  height: 80px;
  margin-bottom: 5px;

  .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

}
</style>