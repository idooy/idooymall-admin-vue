<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataModel.searchForm" @keyup.enter.native="getUserList()">
      <el-form-item>
        <el-input v-model="dataModel.searchForm.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList()">查询</el-button>
        <!-- <el-button v-if="isAuth('member:member:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('member:member:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="userList" border style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="id"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号码"></el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="avatar" header-align="center" align="center" label="头像"></el-table-column>
      <el-table-column prop="createUserId" header-align="center" align="center" label="创建账号"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="用户状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? '启用' : '停用'" disable-transitions >{{ scope.row.status }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">送券</el-button>
          <el-button type="text" size="small">查订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
    @size-change="handleSizeChange"
     @current-change="handleCurrentChange" 
     :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]" 
      :page-size="3" 
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
  </div>
</template>

<script setup lang="ts">
import AddOrUpdate from "./AddOrUpdate.vue";
import { ref, reactive, onMounted } from "vue"
import type { userList } from '@/api/user/type'
import { reqUserList } from "@/api/user/user";



const currentPage = ref<number>(1)
const pageLimit = ref<number>(10)
const totalPage = ref<number>(0)
let userList = ref<userList>()

const dataModel = reactive({
  searchForm: {
    username: ''
  }
})

onMounted(() => {
  getUserList()
})

// 列表数据
const getUserList = async () => {
  await reqUserList(currentPage.value, pageLimit.value).then(res => {
    userList.value = res.page.list
    totalPage.value = res.page.totalPage
  })
}


const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}


</script>