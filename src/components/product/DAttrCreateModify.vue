<template>
  <!--     :visible.sync="isShow" -->
  <el-dialog :title="attrId !== 0 ? '修改属性' : '新增属性'" :close-on-click-modal="false" v-model="dialogVisiable"
    @closed="dialogClose">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRel" label-width="120px">
      <!--   :model="dataForm"    @keyup.enter.native="dataFormSubmit()" -->
      <el-form-item label="属性名" prop="attrName">
        <el-input v-model="dataForm.attrName" placeholder="属性名"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="attrType">
        <el-select v-model="dataForm.attrType" placeholder="请选择">
          <el-option label="规格参数" :value="1"></el-option>
          <el-option label="销售属性" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="值类型" prop="valueType">
        <el-switch v-model="dataForm.valueType" active-text="允许多值" inactive-text="只能单值" active-color="#13ce66"
          inactive-color="#ff4949" :inactive-value="0" :active-value="1"></el-switch>
      </el-form-item>
      <el-form-item label="可选值" prop="valueSelect">
        <el-input-tag v-model="dataForm.valueSelect" tag-type="primary" :max="dataForm.valueType===0?1:100"  placeholder="请输入属性值"
          aria-label="Please click the Enter key after input" />
        <!--<el-select v-model="dataForm.valueSelect" multiple filterable allow-create placeholder="请输入内容"></el-select> -->
      </el-form-item>
      <!-- <el-form-item label="属性图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="属性图标"></el-input> 
        <el-input v-model="dataForm.icon" placeholder="组图标"></el-input>
        <el-row>
          <el-col :span="24">
            <el-popover ref="iconListPopover" placement="bottom-start" trigger="click"
              popper-class="mod-menu__icon-popover">
        <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }"
                  >
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
        </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称"
              class="icon-list__input"></el-input>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item label="所属分类" prop="catelogId">
        <!-- <category-cascader :catelogPath.sync="catelogPath"></category-cascader> -->
        <d-category-cascader :catelogPath="dataForm.catalogPath" @selectChange="selChange"></d-category-cascader>
      </el-form-item>
      <el-form-item label="所属分组" prop="attrGroupId" v-if="dataForm.attrType == 1">
        <el-select ref="groupSelect" v-model="dataForm.attrGroupId" placeholder="请先选择上面《所属分类》下拉框后再进行选择">
          <el-option v-for="item in attrGroupList" :key="item.attrGroupId" :label="item.attrGroupName"
            :value="item.attrGroupId" />
        </el-select>
      </el-form-item>
      <el-form-item label="可检索" prop="searchType">
        <el-switch v-model="dataForm.searchType" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
          :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="快速展示" prop="showDesc">
        <el-switch v-model="dataForm.showDesc" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
          :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="启用状态" prop="enable">
        <el-switch v-model="dataForm.enable" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
          :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisiable = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="DAttrCreateModify">

import { reactive, ref, onMounted, watch } from 'vue'
import { reqAttrInfoData } from '@/api/product/attr/index.ts'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import type { AttrTableData, AttrTablePageData } from '@/types/product/attr'
import { reqAttrGroupListByCategoryId } from "@/api/product/attr/group";
import { reqModifyAttr, reqCreateAttr } from '@/api/product/attr/index'
import type { AttrGroupOption } from "@/types/product/attrGroup";
import DCategoryCascader from '@/components/product/DCategoryCascader.vue';

// const props = defineProps(['attrId'])
const props = defineProps<{
  visiable: boolean
  attrId: number
}>()
const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'submitSuccess'): void
}>()
console.log('父传过来的值', props.attrId, props.visiable)
const dataFormRel = ref<FormInstance>()
const dialogVisiable = ref(props.visiable)
const dataForm = reactive<AttrTableData>({
  attrId: 0,
  attrName: '',
  searchType: 1,
  icon: '',
  valueSelect: [],
  valueType: 1,
  attrType: 1,
  enable: 1,
  categoryId: 0,
  showDesc: 0,
  catalogName: '',
  attrGroupId: '',
  attrGroupName: '',
  catalogPath: [],
  attrGroupList: []
})
const attrGroupList = ref<AttrGroupOption[]>([])

onMounted(() => {
  if (props.attrId !== 0) {
    getAttrInfo()
  }
})



const rules = reactive<FormRules<AttrTablePageData>>({

})



/**
 * 当级联选择器发生改变子组件就通知，该方法用来处理该通知
 * 从子组件中拿到所选分类的最后一级分类ID,
 * 对表单数据进行赋值修改
 */
const selChange = async (categoryPath: number[]) => {
  // console.log('categoryPath',categoryPath);
  //当然级联选择器也可以清空数据，所以要判断
  if (categoryPath) {
    // 1、拿到子组件选择的最后一级分类ID
    dataForm.catalogPath = categoryPath
    let lastCatId = categoryPath[categoryPath.length - 1]
    dataForm.categoryId = lastCatId
    // 2、获取当前分类下的所有属性分组供’属性分组‘下拉框选择
    await reqAttrGroupListByCategoryId(lastCatId).then(result => {
      attrGroupList.value = result
    })
  } else {
    // 直接将所属分组的数据清空一次
    attrGroupList.value = []
  }

}

/**
 * 查询attr详情，并进行数据回显
 */
const getAttrInfo = async () => {
  await reqAttrInfoData(props.attrId.valueOf()).then(res => {
    console.log('----', res);
    // attr详情回显
    Object.assign(dataForm, res)
    // 这里将初始的属性分组信息进行接受
    attrGroupList.value = res.attrGroupList
  })
}
const dataFormSubmit = async () => {

  console.log('提交的数据====》', dataForm);

  if (props.attrId !== 0) {
    // 修改
    await reqModifyAttr(dataForm).then(() => {
      ElMessage.success('修改属性成功')
      dialogVisiable.value = false
    })
  } else {
    // 新增
    await reqCreateAttr(dataForm).then(() => {
      ElMessage.success('新增属性成功')
      dialogVisiable.value = false
    })
  }
  // 告诉父组件修改或新增提交成功
  emit('submitSuccess')
}

//==============父组件控制dialog开关==========================
const dialogClose = () => {
  emit('close')
}
watch(() => props.visiable, (newVal) => {
  dialogVisiable.value = newVal
})
//==========================================================
</script>
