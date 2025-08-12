<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-steps :active="step" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="规格参数"></el-step>
                    <el-step title="销售属性"></el-step>
                    <el-step title="SKU信息"></el-step>
                    <el-step title="保存完成"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="24" v-show="step == 0">
                <el-card class="box-card" style="width:100%;margin:20px auto">
                    <el-form ref="baseDataFormRef" :model="spu" label-width="120px" :rules="baseInfoDataRules" style="width: 80%;">
                        <el-form-item label="SPU商品名称" prop="spuName">
                            <el-input v-model="spu.spuName"></el-input>
                        </el-form-item>
                        <el-form-item label="SPU商品描述" prop="description">
                            <el-input v-model="spu.description"></el-input>
                        </el-form-item>
                        <el-form-item label="选择分类" prop="categoryId">
                            <d-category-cascader @select-change="setCategory3Id"></d-category-cascader>
                        </el-form-item>
                        <el-form-item label="选择品牌" prop="brandId">
                            <brand-select @change="setBrandId"></brand-select>
                        </el-form-item>
                        <el-form-item label="商品重量(Kg)" prop="weight">
                            <el-input-number v-model.number="spu.weight" :min="0" :precision="3"
                                :step="0.1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="设置虚拟收益" prop="bounds">
                            <el-col :span="2">金币数</el-col>
                            <el-col :span="6">
                                <el-input-number style="width:130px" v-model="spu.bounds.buyBounds" :min="0" controls-position="right" />
                            </el-col>
                            <el-col :span="2">成长值</el-col>
                            <el-col :span="6">
                                <el-input-number style="width:130px" v-model="spu.bounds.growBounds" :min="0" controls-position="right" />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="商品介绍" prop="describeImages">
                             <d-upload @upload-success="setDescImages"></d-upload>
                        </el-form-item>

                        <el-form-item label="商品图集" prop="images">
                             <d-upload @upload-success="setProductImages"></d-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="18"></el-col>
                            <el-col :span="6">
                                <el-button type="success" @click="gotoStep1(baseDataFormRef)">下一步：设置基本参数</el-button>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { FormInstance, FormRules } from 'element-plus';
import DCategoryCascader from '@/components/product/DCategoryCascader.vue';
import BrandSelect from '@/views/common/BrandSelect.vue';
import DUpload from '@/components/upload/DUpload.vue';
import type {AttrGroupWithAttrList} from '@/types/product/attrGroup'
import {reqGroupWithAttrByCategoryId} from '@/api/product/attr/group'

// 该发布过程中所有请求的响应数据结构
interface ResponseData{
    groupWithAttrList:AttrGroupWithAttrList
}

const step = ref(0)
const baseDataFormRef = ref<FormInstance>()
// 该发布过程中所有请求的响应数据
const responseData = reactive<ResponseData>({
    groupWithAttrList:[]
})

const spu = reactive({
    spuName: "",
    description: "",
    categoryId: 0,
    brandId: 0,
    weight: 0,
    publishStatus: 0,
    describeImages: Array.of<string>(),
    images: Array.of<string>(),
    bounds: {
        buyBounds: 0,
        growBounds: 0
    },
    baseAttrs: Array.of<string>(),
    skus: Array.of<string>()
})



const checkCategory3Id = (rule: any, value: any, callback: any) => {
  value === 0?callback(new Error('请选择所属分类')):callback()
}
const checkBrand = (rule: any, value: any, callback: any) => {
  value === 0?callback(new Error('请选择商品品牌')):callback()
}
const checkWeight = (rule: any, value: any, callback: any) => {
  value > 0?callback():callback(new Error('请填写正确的商品重量'))
}
const baseInfoDataRules = reactive<FormRules<any>>({
    spuName: [
        { required: true, message: "请输入商品名字", trigger: "blur" }
    ],
    description: [
        { required: true, message: "请编写一个简单描述", trigger: "blur" }
    ],
    category3Id: [
        {validator: checkCategory3Id, trigger: "blur" }
    ],
    brandId: [
        { validator:checkBrand, trigger: "blur" }
    ],
    describeImages: [
        { required: true, message: "请上传商品详情图集", trigger: "blur" }
    ],
    images: [
        { required: true, message: "请上传商品图片集", trigger: "blur" }
    ],
    weight: [
        { validator:checkWeight, message: "请填写正确的重量值", trigger: "blur" }
    ]
})

/**
 * 去往第2步
 */
const gotoStep1 = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
        // 去往第二步
        step.value = 1
        getGroupWithAttrByCategoryId()
    } else {
      console.log('填写数据有误，请核对后继续前往下一步')
    }
  })
}

/**
 * 根据categoryId查所有分组以及关联的属性
 */
const getGroupWithAttrByCategoryId= async ()=>{
    await reqGroupWithAttrByCategoryId(spu.categoryId).then((res)=>{

    })
}



/**
 * 子传父：用户选择三级分类级联选择器的结果集
 * @param categoryPath 
 */
const setCategory3Id = (categoryPath: number[]) => {

    spu.categoryId = categoryPath?categoryPath[categoryPath.length - 1]:0
    
}
const setBrandId = (brandId: number) => {
    spu.brandId = brandId
}
const setProductImages = (fileUrl: string) => {
    spu.describeImages.push(fileUrl)
}
const setDescImages = (fileUrl: string) => {
     spu.images.push(fileUrl)
}

</script>