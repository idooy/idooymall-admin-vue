<template>
  <div class="login_container">
    <div class="form_container">
      <el-row>
        <!-- <el-col :span="12" :xs="0"></el-col> -->
        <el-col :span="24" :xs="24">
          <el-form class="login_form" :model="loginForm" :rules="validator" ref="loginRuleFormRef">
            <h1>idooy-admin</h1>
            <h2>idooymall管理系统</h2>
            <el-form-item prop="username">
              <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" type="primary" size="default" @click="submitLoginForm(loginRuleFormRef)">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<!-- ==========================================TS TOP=============================================== -->
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { login } from '@/api/sys/login.ts'
import type { FormInstance, FormRules } from 'element-plus'
import {userModuleStore} from '@/store/user.ts'
import {useRouter} from 'vue-router'

let $router = useRouter()
// 拿到user module的小仓库配置


const loginRuleFormRef = ref<FormInstance>()

//表单数据
let loginForm = reactive({ username: 'admin', password: '123456' })

//定义表单校验对象，:rules="validator"与表单进行绑定
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

// 提交登录表单数据，并在提交前进行数据校验
// https://cn.element-plus.org/zh-CN/component/form.html
const submitLoginForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 校验通过，发送登录请求
      login(loginForm).then((res) => {
        const userToken = res.data.token
        // 将token持久化存储
        userModuleStore().registryToken(userToken)
        // 路由
        $router.push('/layout')
      })
    }
  })
}



</script>
<!-- ==========================================TS BOTTOM=============================================== -->
<style scoped lang="scss">
.login_container {
  width: 1280px;
  height: 607px;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  overflow: auto;

  .form_container {
    position: absolute;
    width: 380px;
    height: 310px;
    top: 20%;
    right: 10%;
    border-radius: 20px;
    // background: url('@/assets/images/login_form.png') no-repeat;
    background-color: #4e5ede;
    padding: 40px;
  }

  .login_form {
    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
