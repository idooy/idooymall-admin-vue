<template>
  <el-dialog :title="levelId>0 ? '修改会员等级' : '新增会员等级'" :close-on-click-modal="false" v-model="dialogVisiable"
    @close="closeHandler">
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="180px">
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入会员等级名称"></el-input>
      </el-form-item>
      <el-form-item label="所需成长值" prop="growthPoint">
        <el-input-number v-model="dataForm.growthPoint" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="默认会员等级" prop="defaultStatus">
        <el-switch v-model="dataForm.defaultStatus" inline-prompt :active-icon="Check" :inactive-icon="Close" />
      </el-form-item>
      <el-form-item label="免运费标准" prop="freeFreightPoint">
        <el-input-number :min="0" v-model="dataForm.freeFreightPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="每次评价获取的成长值" prop="commentGrowthPoint">
        <el-input-number :min="0" v-model="dataForm.commentGrowthPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="是否有免邮特权" prop="priviledgeFreeFreight">
        <el-switch v-model="dataForm.priviledgeFreeFreight" inline-prompt :active-icon="Check" :inactive-icon="Close" />
      </el-form-item>
      <el-form-item label="是否有会员价格特权" prop="priviledgeMemberPrice">
        <el-switch v-model="dataForm.priviledgeMemberPrice" inline-prompt :active-icon="Check" :inactive-icon="Close" />
      </el-form-item>
      <el-form-item label="是否有生日特权" prop="priviledgeBirthday">
        <el-switch v-model="dataForm.priviledgeBirthday" inline-prompt :active-icon="Check" :inactive-icon="Close" />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="dataForm.note" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts' name="LevelCM">
import { ref, watch, reactive } from 'vue'
import { FormInstance, FormRules } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue'


const props = defineProps<{
  visible: boolean
  levelId: number
}>()
console.log('子组件visiable===>', props.visible);

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'submit-success'): void,
}>()
const dataRule = reactive<FormRules<any>>({
  name: [
    { required: true, message: '等级名称不能为空', trigger: 'blur' }
  ],
  growthPoint: [
    { required: true, message: '等级需要的成长值不能为空', trigger: 'blur' }
  ],
  defaultStatus: [
    { required: true, message: '是否为默认等级[0->不是；1->是]不能为空', trigger: 'blur' }
  ],
  freeFreightPoint: [
    { required: true, message: '免运费标准不能为空', trigger: 'blur' }
  ],
  commentGrowthPoint: [
    { required: true, message: '每次评价获取的成长值不能为空', trigger: 'blur' }
  ],
  priviledgeFreeFreight: [
    { required: true, message: '是否有免邮特权不能为空', trigger: 'blur' }
  ],
  priviledgeMemberPrice: [
    { required: true, message: '是否有会员价格特权不能为空', trigger: 'blur' }
  ],
  priviledgeBirthday: [
    { required: true, message: '是否有生日特权不能为空', trigger: 'blur' }
  ],
  note: [
    { required: true, message: '备注不能为空', trigger: 'blur' }
  ]

})
const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
  id: 0,
  name: '',
  growthPoint: 0,
  defaultStatus: 0,
  freeFreightPoint: 0,
  commentGrowthPoint: 0,
  priviledgeFreeFreight: 0,
  priviledgeMemberPrice: 0,
  priviledgeBirthday: 0,
  note: ""
})
const dialogVisiable = ref(props.visible)
console.log('dialogVisiable', dialogVisiable.value);

watch(() => props.visible, (newVal) => {
  dialogVisiable.value = newVal
})

/**
 * 提交表单数据
 */
const submit = () => {

  emit('submit-success')
}
/**
 * 关闭对话框
 */
const closeHandler = () => {
  emit('close')
}





</script>