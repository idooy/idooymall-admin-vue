<template>
  <el-button style="margin-bottom: 15px;" type="primary" @click="dirDialogVisible = true">添加目录</el-button>
  <el-table style="width: 100%" :data="menuList" row-key="menuId" :border="true">
    <el-table-column align='center' prop="name" label="名称" />
    <el-table-column align='center' prop="type" label="类型">
      <template #default="scope">
        <el-tag v-if="scope.row.type == 0" type='primary' disable-transitions>目录</el-tag>
        <el-tag v-else-if="scope.row.type == 1" type='success' disable-transitions>菜单</el-tag>
        <el-tag v-else type='warning' disable-transitions>按钮</el-tag>
      </template>
    </el-table-column>
    <el-table-column align='center' prop="url" label="路径" />
    <el-table-column align='center' label="操作">
      <template #default="scope">
        <el-button v-if="scope.row.type == 0" size="small" type="primary" @click="addMenuHandle()">添加菜单</el-button>
        <el-button v-if="scope.row.type == 1" size="small" type="success" @click="addButtHandle()">添加按钮</el-button>
        <el-button color="#626aef" size="small" @click="edit(scope.row)">编辑</el-button>
        <el-button size="small" type="danger">删除</el-button>
      </template>

    </el-table-column>
  </el-table>

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
  <el-dialog v-model="menuDialogVisible" :title="`添加${titleText}`" width="500" draggable @close="cancel(ruleMenuFormRef)">
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
</template>

<script setup lang="ts">
import { reqAllMenuButtonTree } from '@/api/menu/menu';
import type { MenuListData, MenuForm } from '@/api/menu/type';
import { reactive, ref, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'


onMounted(() => {
  initTableData()
})

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

const menuList = ref<MenuListData[]>([
  {
    menuId: 0,
    parentId: 0,
    name: '',
    url: '',
    type: 0,
    icon: '',
    children: []
  }
])

// ‘编辑’按钮
const edit = (row:MenuListData)=>{
  menuDialogVisible.value = true
  Object.assign(row,ruleMenuForm)
  console.log(row)
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
    console.log(list)
    menuList.value = list
  })
}


</script>

<style></style>
