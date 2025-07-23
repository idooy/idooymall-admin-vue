<template>
  <el-card>
    <el-form :data="queryParams.queryForm" :inline="true">
      <el-form-item label="角色标识">
        <el-input v-model="queryParams.queryForm.roleName" placeholder="请输入角色标识查询" />
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="queryParams.queryForm.remark" placeholder="请输入角色名称查询" />
      </el-form-item>
      <el-form-item label="角色状态">
        <el-select v-model="queryParams.queryForm.status" placeholder="请选择角色状态" clearable style="width: 160px">
          <el-option label="有效" value="1" />
          <el-option label="无效" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchRole">查找角色</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 5px;">
    <el-button type="success" @click="visible = true">新增角色</el-button>
    <el-table style="margin:15px 0;width: 100%" :data="tableData" :border="true" :show-overflow-tooltip="true">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="roleName" label="角色标识" width="180" header-align="center" align="left" />
      <el-table-column prop="remark" label="角色名称" width="100" align="center" />
      <el-table-column label="状态" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status.key === '1' ? 'primary' : 'info'" disable-transitions>
            {{ scope.row.status.text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人账号" width="100" align="center" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="220px">
        <template #default="scope">
          <el-button type="primary" size="small" @click="gotoPermission(scope.row)">分配权限</el-button>
          <el-button type="success" size="small" @click="gotoEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="doDelRoleHandler(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="getTableData()" @current-change="getTableData()"
      v-model:current-page="queryParams.currentPage" v-model:page-size="queryParams.pageSize" :page-sizes="[5, 10, 20]"
      :total="totalCount" layout="sizes, prev, pager, next, jumper, ->, total" />
  </el-card>

  <!-- 新增修改 Drawer-->
  <el-drawer v-model="visible" @closed="clearRoleCMForm(cmRuleFormRef)">
    <template #header>
      <h4>{{ roleCMForm.roleId ? '修改角色' : '添加角色' }}</h4>
    </template>
    <template #default>
      <el-form ref="cmRuleFormRef" :model="roleCMForm" :rules="cmRules">
        <el-form-item prop="roleName" label="角色标识">
          <el-input v-model="roleCMForm.roleName" placeholder="请输入角色标识，英文大写" />
        </el-form-item>
        <el-form-item prop="remark" label="角色名称">
          <el-input v-model="roleCMForm.remark" placeholder="请输入角色名称，中文名称" />
        </el-form-item>
        <el-form-item prop="status" label="角色状态">
          <el-switch v-model="roleCMForm.status" :active-value="'1'" :inactive-value="'0'" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto; margin-bottom: 48px;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="doCMHandler(cmRuleFormRef)">确定</el-button>
      </div>
    </template>
  </el-drawer>


  <!-- 分配权限 Drawer-->
  <el-drawer v-model="treeDrawerVisible">
    <template #header>
      <h4>{{`角色分配权限`}}</h4>
    </template>
    <template #default>
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :props="{children: 'children',label:'name'}"
          :data="treeData"
          :show-checkbox="true"
          default-expand-all
          node-key="menuId"
          :default-checked-keys="roleExistedChecked"
        />
    </template>
    <template #footer>
      <div style="flex: auto; margin-bottom: 48px;">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="doPermission()">确定</el-button>
      </div>
    </template>
  </el-drawer>


</template>

<script setup lang="ts">
import { RoleQueryPage, RoleTableData, RoleCMForm } from '@/api/acl/role/type';
import { reactive, ref, onMounted } from 'vue';
import type { FormInstance, FormRules,TreeInstance } from 'element-plus'
import { reqDelRole, reqTableData, reqSaveRole, reqModifyRole,reqRoleOfPermissionId,reqRefreshRoleOfPermission } from '@/api/acl/role'
import {reqAllMenuButtonTree} from '@/api/acl/menu/'
import type { MenuListData } from '@/api/acl/menu/type';


onMounted(() => { initTableData() })


const treeRef = ref<TreeInstance>()
const currentRoleId = ref<number>() 
const roleExistedChecked = ref<number[]>([])//角色已经存在的权限
const treeData = ref<MenuListData[]>([])
const visible = ref(false)//新增修改Drawer
const treeDrawerVisible = ref(false)//分配权限Drawer
const totalCount = ref<number>(0)//pagination组件的total属性值
const tableData = ref<RoleTableData[]>([])//列表数据
const queryParams = reactive<RoleQueryPage>({
  currentPage: 1,
  pageSize: 10,
  queryForm: {
    roleName: '',
    remark: '',
    status: ''
  }
})
const cmRuleFormRef = ref<FormInstance>()
const roleCMForm = reactive<RoleCMForm>({
  roleId: '',
  roleName: '',
  remark: '',
  status: '1',
})

const cmRules = reactive<FormRules<RoleCMForm>>({
  roleName: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
})
//==================================FUNCTION START==============================

// 请求后台进行‘权限分配’
const doPermission = async ()=>{
  const checkedKeys = treeRef.value?.getCheckedKeys(true)
  // console.log('collectCheckedKeys',checkedKeys)
  const roleId  = currentRoleId.value
  await reqRefreshRoleOfPermission(roleId as number,checkedKeys as number[]).then(()=>{
    treeDrawerVisible.value=false
  })
}


// 点击“分配权限”
const gotoPermission = async (row:RoleTableData)=>{
  // 另存一份roleId,最终请求后台的时候要用
  currentRoleId.value = Number(row.roleId)
  treeDrawerVisible.value = true
  // 0、拿到所有的权限
  await reqAllMenuButtonTree().then((res)=>{
    treeData.value = res
  })

  // 1、查询角色当前权限，并进行渲染
  await reqRoleOfPermissionId(row.roleId).then(permissIdList =>{
    roleExistedChecked.value = permissIdList
  })

}


// 点击‘编辑’按钮
const gotoEdit = (row: RoleTableData) => {
  roleCMForm.roleId = row.roleId
  roleCMForm.status = row.status.key
  roleCMForm.roleName = row.roleName
  roleCMForm.remark = row.remark
  visible.value = true
  // 表单提交在 doCMHandler()
}


// 关闭新增和修改Drawer
// const closeDrawer = () => {
//   visible.value = false
  // if (!formEl) return
  // formEl.resetFields()
// }

// 新增或者修改的表单提交
const doCMHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (roleCMForm.roleId) {
        // 修改
        await reqModifyRole(roleCMForm).then(() => {
          // closeDrawer()
          visible.value = false
          getTableData()
        })
      } else {
        // 新增
        await reqSaveRole(roleCMForm).then(() => {
          // closeDrawer()
          visible.value = false
          getTableData()
        })
      }

    }
  })
}

// 查找角色
const searchRole = () => {
  getTableData()
}

// 删除‘角色’
const doDelRoleHandler = async (row: RoleTableData) => {
  // const ids = [row.roleId]
  await reqDelRole(row.roleId).then(() => {
    getTableData()
  })

}

// 初始化查询列表数据
const initTableData = () => {
  getTableData()
}
// 获取列表数据根据queryParams请求参数
const getTableData = async () => {
  await reqTableData(queryParams).then((res) => {
    totalCount.value = res.totalCount
    queryParams.pageSize = res.pageSize
    queryParams.currentPage = res.currentPage
    tableData.value = Array.from(res.list)
  })
}

// 抽屉关闭的时候清空表单数据
const clearRoleCMForm = (formEl: FormInstance | undefined) => {
  // 表单不但要回到初始状态，还要请空
  if (!formEl) return
  formEl.resetFields()
  roleCMForm.remark = ''
  roleCMForm.roleId = ''
  roleCMForm.roleName = ''
  roleCMForm.status = '1'
}


</script>



<style></style>
