<template>
  <el-card>
    <el-button style="margin-bottom: 15px;" type="primary" @click="dirDialogVisible = true">添加目录</el-button>
    <span style="color: red;">删除菜单权限只能逐级单个删除，目录或菜单的子菜单数量为零才能删除</span>
    <el-table style="width: 100%" :data="menuList" row-key="menuId" :border="true" :expand-row-keys="expandRowKeys">

      <el-table-column align='center' prop="name" label="名称">
        <template #default="scope">
          <el-icon style="vertical-align: middle;" v-if="scope.row.icon">
            <component :is="scope.row.icon" />
          </el-icon>
          <span style="vertical-align: middle;margin-left: 10px;">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="type" label="类型" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.type.key == 0" type='primary'>{{scope.row.type.text}}</el-tag>
          <el-tag v-if="scope.row.type.key == 1" type='success'>{{scope.row.type.text}}</el-tag>
          <el-tag v-if="scope.row.type.key == 2" type='warning'>{{scope.row.type.text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="url" label="路径" />
      <el-table-column align='left' label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.type.key == 0" size="small" type="primary" @click="addMenuHandle()">添加菜单</el-button>
          <el-button v-if="scope.row.type.key == 1" size="small" type="success" @click="addButtHandle()">添加按钮</el-button>
          <el-button color="#626aef" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="doDelMenuHandler(scope.row)">
            <template #reference>
              <el-button size="small" v-if="scope.row.children && scope.row.children.length == 0" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加目录对话框 -->
  <el-dialog v-model="dirDialogVisible" title="添加目录" width="500" draggable @close="destoryAddDirDialog(ruleDirFormRef)">
    <el-form ref="ruleDirFormRef" :model="ruleDirForm" :rules="dirFormRules">
      <el-form-item label="目录名称" prop="name">
        <el-input v-model="ruleDirForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="destoryAddDirDialog(ruleDirFormRef)">取消</el-button>
        <el-button type="primary" @click="doAddDirHandler(ruleDirFormRef)">添加</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加菜单、按钮对话框 -->
  <el-dialog v-model="menuDialogVisible" :title="`添加${titleText}`" width="500" draggable
    @close="cancel(ruleMenuFormRef)">
    <el-form ref="ruleMenuFormRef" :model="ruleMenuForm" :rules="menuFormRules">
      <el-form-item :label="`${titleText}名称`" prop="name">
        <el-input v-model="ruleMenuForm.name" />
      </el-form-item>
      <el-form-item :label="`${titleText}URL`" prop="url">
        <el-input v-model="ruleMenuForm.url" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel(ruleMenuFormRef)">取消</el-button>
        <el-button type="primary" @click="doAddMenuButtHandler(ruleMenuFormRef)">添加</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除对话框，起初打算是支持批量删除的，现在业务只允许逐级一个个删除-->
  <!-- <el-dialog v-model="delConfirmDialogVisible" title="删除菜单权限">
    <div style="margin-bottom: 15px;text-align: center;">
      <el-text class="mx-1" type="danger" size="large">当前操作有风险；请谨慎操作！</el-text>
    </div>
    <el-tree  :data="confirmDelMenuList" :default-expand-all="true"
      :props="{ label: 'name', children: 'children' }" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type='primary' @click="delConfirmDialogVisible = false">取消删除</el-button>
        <el-button type="danger" @click="doDelMenuHandler()"> 确认删除 </el-button>
      </div>
    </template>
  </el-dialog> -->

</template>

<script setup lang="ts">
import { reqAllMenuButtonTree, reqDelMenusById } from '@/api/acl/menu';
import type { MenuListData, MenuForm } from '@/api/acl/menu/type';
import { reactive, ref, onMounted,computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'



onMounted(() => {
  initTableData()
})

const expandRowKeys = ref<number[]>([])
const menuDialogVisible = ref(false)
const ruleDirFormRef = ref<FormInstance>()
const ruleMenuFormRef = ref<FormInstance>()
const dirDialogVisible = ref(false)
const titleText = ref<string>()
const ruleDirForm = reactive<MenuForm>({
  name: ''
})
const dirFormRules = reactive<FormRules<MenuForm>>({
  name: [
    { required: true, message: '名称为空', trigger: 'blur' },
    { min: 3, max: 10, message: '3到8个汉字或单词组成', trigger: 'blur' },
  ]
})
const menuFormRules = reactive<FormRules<MenuForm>>({
  name: [
    { required: true, message: '名称为空', trigger: 'blur' },
    { min: 3, max: 10, message: '3到8个汉字或单词组成', trigger: 'blur' },
  ],
  url: [
    { required: true, message: 'url为空', trigger: 'blur' },
  ],
})
const ruleMenuForm = reactive({
  menuId: 0,
  parentId: 0,
  name: '',
  url: '',
  icon: '',
  type: ''
})

const menuList = ref<MenuListData[]>([])

// const confirmDelMenuList = ref<MenuListData[]>([])
// const delConfirmDialogVisible = ref(false)
// 点击列表‘删除’，打开删除对话框
// const confirmDelDialog = (row: MenuListData) => {
  // 首先将Tree组件的历史数据清空，这样展示的才是本次要删除的准确数据
  // confirmDelMenuList.value.pop()
  // 将本次要删除的数据以tree组件的形式进行展示确认
  // confirmDelMenuList.value.push(row)
  // delConfirmDialogVisible.value = true
// }
// 确认删除，真正进行删除的地方
const doDelMenuHandler = async (row:MenuListData) => {
  // 把要删除的菜单id收集起来
  // const delMenuIdArr= collectDelMenuIds(confirmDelMenuList.value,new Array())
  await reqDelMenusById(row.menuId)
  // 记录当前删除行的parentid，方便删除成功以后直接展示
  expandRowKeys.value.push(row.parentId)
  initTableData()
}

// 递归拿到要删除菜单的id
// const collectDelMenuIds = (menus: MenuListData[], collect: Array<number>) => {
//   menus.forEach(element => {
//     if (element.children && element.children.length > 0) {
//       collectDelMenuIds(element.children, collect)
//     }
//     collect.push(element.menuId)
//   });
//   return collect
// }


// ‘编辑’按钮
const edit = (row: MenuListData) => {
  menuDialogVisible.value = true
  Object.assign(row, ruleMenuForm)
}

// ‘添加目录’对话框‘确认’按钮
const doAddDirHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    }
    dirDialogVisible.value = false
    ruleDirForm.name = ''
    formEl.resetFields()
  })
}
// ‘添加菜单、按钮’对话框‘确认’按钮
const doAddMenuButtHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      menuFormDestory()
      formEl.resetFields()
    }
  })
}

// ‘添加目录’对话框‘取消’按钮
const destoryAddDirDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dirDialogVisible.value = false
  ruleDirForm.name = ''
  formEl.resetFields()
}
// 添加、编辑菜单或按钮的对话框‘取消动作’
const cancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  menuFormDestory()
}
const menuFormDestory = () => {
  menuDialogVisible.value = false
  ruleMenuForm.name = ''
  ruleMenuForm.url = ''
}

// 点击‘添加菜单’
const addMenuHandle = () => {
  menuDialogVisible.value = true
  titleText.value = '菜单'
}
// 点击‘添加按钮’
const addButtHandle = () => {
  menuDialogVisible.value = true
  titleText.value = '按钮'
}

// 系统所有的目录、菜单、按钮
const initTableData = async () => {
  await reqAllMenuButtonTree().then(list => {
    menuList.value = list
  })
}

</script>

<style></style>
