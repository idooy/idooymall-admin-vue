<template> 
    <el-upload 
      :action="host" 
      :data="uploadParam" 
      :auto-upload="autoUpload" 
      :list-type="listType" 
      :multiple="multiple"
      :file-list="fileList" 
      :show-file-list="showFileList"
      :before-upload="beforeUpload" 
      :on-success="handleUploadSuccess" 
      :on-error="handleError"
    >
      <el-icon> <Plus /> </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>
<script setup lang="ts" name="DUpload">
import { policy } from '@/components/upload/policy'
import { ref, reactive, computed } from 'vue'
import { PolicyData, type UploadParam } from '@/components/upload/type'
import { uuid } from 'vue3-uuid';
import type {UploadProps, UploadUserFile, UploadRequestOptions, UploadFile } from 'element-plus'
import {ElMessage} from 'element-plus'
import axios from 'axios';
import { Delete, Plus } from '@element-plus/icons-vue'






// 父组件调用时传入的参数
const props = withDefaults(defineProps<{
  // 限制文件数量
  fileLimit?: number,
  // 显示文件列表
  showFileList?: boolean,
  // 允许多文件上传
  multiple?: boolean,
  // 接受上传文件的类型，为空表示所有文件类型都可以
  tipText?: string
  // 文件列表的类型
  listType?: string
  // 是否自动上传文件
  autoUpload?: boolean
}>(), {
  fileLimit: 20,
  showFileList: true,
  multiple: true,
  listType: 'picture-card',
  autoUpload: true
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 定义父组件中的触发函数（触发父组件中的回调函数）
const emit = defineEmits(['upload-success', 'upload-error']);
const host = ref<string>()
const fileName = ref<string>()
const fileList = ref<UploadUserFile[]>([])
const policyData = ref<PolicyData>()
const uploadParam = reactive<UploadParam>({
  success_action_status: '200',
  policy: '',
  'x-oss-signature': '',
  'x-oss-signature-version': 'OSS4-HMAC-SHA256',
  'x-oss-credential': '',
  'x-oss-date': '',
  key: '',// 文件名；dir+fileName
  'x-oss-security-token': ''
})
const fileUrl = computed<string>(() => {
  return `${host.value}${uploadParam.key}`
})



/**
 * 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
 * 这里可以对文件的大小，文件的格式，进行业务判断
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // console.log("1111111",rawFile)
  // 拿到上传文件的原始文件名
  fileName.value = rawFile.name
  return new Promise(async (resolve, reject) => {
    // 这里采用了STS验签的Web直传的方式，所以在上传之前要到服务器拿到STS临时凭证
    await policy().then(response => {
      uploadParam.policy = response.policy;
      uploadParam['x-oss-signature'] = response.signature;
      uploadParam['x-oss-credential'] = response.x_oss_credential;
      uploadParam['x-oss-security-token'] = response.security_token
      uploadParam['x-oss-date'] = response.x_oss_date;
      uploadParam['x-oss-signature-version'] = response.version;
      uploadParam.key = `${response.dir}/${uuid.v4()}${rawFile.name}`;
      host.value = response.host
      resolve(true)
    }).catch(err => { 
      console.log('===',err);
      reject(false) 
    })
  })
}
// 上传成功回调
const handleUploadSuccess: UploadProps['onSuccess'] = (files, uploadFiles) => {
  console.log("上传成功22===>>>", files,uploadFiles);
  // console.log("上传成功22======>>>", uploadFiles);
  ElMessage.success('上传成功');
  fileList.value.push({
    name: fileName.value as string,
    url: fileUrl.value
  })
  // 通知父组件执行下一步处理
  emit('upload-success', fileUrl.value);
};

// 上传失败回调
const handleError: UploadProps['onError'] = (files, uploadFiles) => {
  ElMessage.error('上传失败，请联系管理员');
  console.log(files, uploadFiles)
  emit('upload-error', files, uploadFiles)
};


/**
 *  文件删除
 * @param file 
 */
// const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
//   console.log(uploadFile, uploadFiles)
// }
// 超出文件数量限制时的处理
// const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
//   ElMessage.warning(
//     `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
//     } totally`
//   )
// }

/**
 * 
 * 手动设置上传参数;对应http-request,目前使用的是data属性来传递额外的参数
 */
const uploadOtherParam = async (options: UploadRequestOptions) => {
  const { file } = options
  const formData = new FormData();
  const data = policyData.value as PolicyData
  formData.append('success_action_status', '200')
  formData.append('policy', data.policy)
  formData.append('x-oss-signature', data.signature)
  formData.append('x-oss-signature-version', data.version)
  formData.append('x-oss-credential', data.x_oss_credential)
  formData.append('x-oss-date', data.x_oss_date)
  formData.append('key', `${data.dir}/${uuid.v4()}${file.name}`)
  formData.append('x-oss-security-token', data.security_token)
  formData.append("file", file);
  await axios.post(options.action, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
    console.log(res)
  })

}

</script>

<style></style>
