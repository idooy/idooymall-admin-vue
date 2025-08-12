<template>
    <el-card>
        <el-form :inline="true" :model="queryForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="queryForm.key" placeholder="支持[会员等级名称]查询" clearable style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button type="primary" @click="add()">新增</el-button>
                <!-- <el-button v-if="isAuth('member:memberlevel:delete')" type="danger" @click="deleteHandle()"
                    :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
            <el-table-column prop="id" header-align="center" align="center" label="id"></el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="等级名称"></el-table-column>
            <el-table-column prop="growthPoint" header-align="center" align="center" label="所需成长值"></el-table-column>
            <el-table-column prop="defaultStatus" header-align="center" align="center" label="默认等级">
                <template #default="scope">
                    <i class="el-icon-success" v-if="scope.row.defaultStatus == 1"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
            </el-table-column>
            <el-table-column prop="freeFreightPoint" header-align="center" align="center"
                label="免运费标准"></el-table-column>
            <el-table-column prop="commentGrowthPoint" header-align="center" align="center"
                label="每次评价获取的成长值"></el-table-column>
            <el-table-column label="特权">
                <el-table-column prop="priviledgeFreeFreight" header-align="center" align="center" label="免邮特权">
                    <template #default="scope">
                        <i class="el-icon-success" v-if="scope.row.priviledgeFreeFreight == 1"></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column prop="priviledgeMemberPrice" header-align="center" align="center" label="会员价格特权">
                    <template #default="scope">
                        <i class="el-icon-success" v-if="scope.row.priviledgeMemberPrice == 1"></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column prop="priviledgeBirthday" header-align="center" align="center" label="生日特权">
                    <template #default="scope">
                        <i class="el-icon-success" v-if="scope.row.priviledgeBirthday == 1"></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="note" header-align="center" align="center" label="备注"></el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                    <template #default="scope">
                        <el-button type="text" size="small" @click="edit(scope.row.id)">修改</el-button>
                        <el-popconfirm title="确认删除?" @confirm="del(scope.row)">
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
         <level-c-m v-if="cmVisible" :visible="cmVisible" :level-id="levelId" @submit-success="getDataList" @close="cmVisible=false"/>
    </el-card>
</template>




<script setup lang='ts'>
import { ref, reactive } from 'vue'
import LevelCM from '@/views/member/level/LevelCM.vue'

const levelId = ref(0)
const cmVisible = ref(false)
const dataListLoading = ref(false)
const dataList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const queryForm = reactive({
    key: ''
})



/**
 * 新增
 */
const add = () => {
    cmVisible.value = true
}
/**
 * 编辑
 */
const edit = (row: any) => {

}
/**
 * 删除等级
 */
const del = (row: any) => {

}
/**
 * 列表数据查询
 */
const getDataList = () => {

}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    getDataList()
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getDataList()
}
</script>



<style scoped></style>