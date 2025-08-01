<template>
  <el-row class='container'>
    <el-col :span="12"></el-col>
    <el-col :span="12" class="right-col">
      <el-card style="width: 380px;" shadow="always">
        <template #header >
          <div class="card-header" style="display: flex; justify-content: center;">
            <span style="font-size: 24px; font-weight:700;margin:auto">idooymall管理系统</span>
          </div>
        </template>
        <el-form :model="loginForm" :rules="validator" ref="loginRuleFormRef">
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" type="primary" @click="submitLoginForm(loginRuleFormRef)"> 登录 </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { reqLogin } from '@/api/acl/user/login'
import type { FormInstance, FormRules } from 'element-plus'
import { userModuleStore } from '@/store/user.ts'
import { useRouter } from 'vue-router'
import { encryption } from '@/utils/encrypt'

let router = useRouter()
let userStore = userModuleStore()
const loginRuleFormRef = ref<FormInstance>()
//表单数据
let loginForm = reactive({ username: 'idooy_admin', password: 'idooy_admin@123456' })

const validator = reactive<FormRules<typeof loginForm>>({
  username: [{
    validator: (rule: any, value: any, callback: any) => {
      // if(/^\d{5,10}$/.test(value)){
      if (value.length >= 5) {
        callback()
      } else {
        callback(new Error('帐号长度至少5位'))
      }
    },
    trigger: 'change'
  }],
  password: [{
    validator: (rule: any, value: any, callback: any) => {
      if (value.length >= 5) {
        callback()
      } else {
        callback(new Error('密码长度至少5位'))
      }
    },
    trigger: 'change'
  }],
})
// 登录
const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 对密码进行加密后再发送登录请求
      const cryptPwd:string = await encryption(loginForm.password)
      reqLogin({"username": loginForm.username, "password": cryptPwd}).then(token=>{
        userStore.registryToken(token)
        router.push({ path: '/' })
      })
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  overflow: auto;

  .right-col {
    // background-color: red;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
