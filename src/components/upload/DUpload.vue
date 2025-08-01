<template> 
  <div>
    <el-upload 
      action="https://idooy-mall.oss-cn-chengdu.aliyuncs.com"
      :data="uploadParam"
      list-type="picture"
      :multiple="multiple"
      :limit="fileLimit"
      :on-exceed="handleExceed"
      :file-list="fileList" 
      :show-file-list="showFileList"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess" 
      :on-error="handleError"
      :accept="accept"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { policy } from '@/components/upload/policy'
import { ref, reactive } from 'vue'
import { PolicyData, type UploadParam } from '@/components/upload/type'
import { uuid } from 'vue3-uuid';
import { ElMessage, type UploadProps, type UploadUserFile,type UploadRequestOptions } from 'element-plus'
import axios from 'axios';


// 父组件调用时传入的参数
const props = defineProps({
    // 限制文件数量
    fileLimit: {
        type: Number,
        default: 1
    },
    // 显示文件列表
    showFileList: {
        type: Boolean,
        default: true
    },
    // 允许多文件上传
    multiple: {
        type: Boolean,
        default: false
    },
    // 接受上传文件的类型，为空表示所有文件类型都可以
    accept: {
        type: String,
        default: ''
    },
    // 文件容量超出时的文本提示
    tipText: {
        type: String,
        default: '请上传文件，大小不超过50MB'
    }
});
// 定义父组件中的触发函数（触发父组件中的回调函数）
const emit = defineEmits(['upload-success', 'upload-error']);


const fileList = ref<UploadUserFile[]>([])
const dialogVisible = ref<Boolean>(false)
const policyData = ref<PolicyData>()
const uploadParam = reactive<UploadParam>({
    success_action_status:'200',
    policy: '',
    'x-oss-signature': '',
    'x-oss-signature-version':'OSS4-HMAC-SHA256',
    'x-oss-credential': '',
    'x-oss-date': '',
    key:'',// 文件名；dir+fileName
    'x-oss-security-token': ''
})
// const props = defineProps(['value'])
// const emit = defineEmits(['input'])

/**
 * 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
 * 这里可以对文件的大小，文件的格式，进行业务判断
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) =>{
  // console.log("1111111",rawFile)
  // 拿到上传文件的原始文件名
  const fileName = rawFile.name
  return new Promise(async (resolve,reject) => {
    // 这里采用了STS验签的Web直传的方式，所以在上传之前要到服务器拿到STS临时凭证
    await policy().then(response => {
    
      uploadParam.policy = response.policy;
      uploadParam['x-oss-signature'] = response.signature;
      uploadParam['x-oss-credential'] = response.x_oss_credential;
      uploadParam['x-oss-security-token'] = response.security_token
      uploadParam['x-oss-date'] = response.x_oss_date;
      uploadParam['x-oss-signature-version'] = response.version;
      uploadParam.key = `${response.dir}/${uuid.v4()}${fileName}`;
      // if(response){
      //   policyData.value = response
      // }
      resolve(true)
    }).catch(err=>{
      console.log(err)
      reject(false)
    })
  })
}


// 超出文件数量限制时的处理
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

// 手动设置上传参数;对应http-request,目前使用的是data属性来传递额外的参数
const uploadOtherParam = async (options: UploadRequestOptions) => {
      const {file} = options
      const formData = new FormData();
      const data = policyData.value as PolicyData
      formData.append('success_action_status','200')
      formData.append('policy',data.policy)
      formData.append('x-oss-signature', data.signature)
      formData.append('x-oss-signature-version', data.version)
      formData.append('x-oss-credential', data.x_oss_credential)
      formData.append('x-oss-date', data.x_oss_date)   
      formData.append('key', `${data.dir}/${uuid.v4()}${file.name}`)
      formData.append('x-oss-security-token', data.security_token) 
      formData.append("file", file);
      await axios.post(options.action,formData,{headers: { 'Content-Type': 'multipart/form-data' }}).then((res)=>{
        console.log(res)
      })

}
 
// 上传成功回调
const handleUploadSuccess: UploadProps['onSuccess'] = (files, uploadFiles) => {
    console.log("上传成功22===>>>", files);
    console.log("上传成功22======>>>", uploadFiles);
    
    // // 构造图片回显
    // reShowPictureUrl.value =  `${signatureParam.value.host}/${signatureParam.value.dir}${uniqueName.value}`;
    // reshowFlag.value = true;
    // ElMessage.success('上传成功');
 
    
    // // 通知父组件执行下一步处理
    // emit('upload-success', {
    //     name: uniqueName.value,
    //     url: reShowPictureUrl.value
    // });
};
 
// 上传失败回调
const handleError: UploadProps['onError'] = (files, uploadFiles)=> {
    ElMessage.error('上传失败，请稍后重试');
    console.log(files,uploadFiles)
    emit('upload-error',files,uploadFiles)
};
 

</script>
<script lang="ts">
  export default {
    name: 'DUpload',
}
</script>
<style></style>
