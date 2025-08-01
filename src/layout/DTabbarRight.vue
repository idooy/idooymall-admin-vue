<template>
  <div class="tabbar-right-button">
    <el-button color="#409eff" icon="Refresh" circle />
    <el-button color="#409eff" icon="FullScreen" circle @click="fullScreen" />
    <el-button color="#409eff" icon="Setting" circle />
  </div>
  <div class="tabbar-right-user">
    <el-avatar :size="32" :src="userStore.avatar" />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{userStore.username}}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="modifyPassword">修改密码</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter} from 'vue-router'
//用户小仓库
import { userModuleStore } from '@/store/user.ts'
let userStore = userModuleStore()
//获取路由器对象
let $router = useRouter()

//获取骨架的小仓库
// import useLayOutSettingStore from '@/store/modules/setting'
// let layoutSettingStore = useLayOutSettingStore()
//刷新按钮点击回调
// const updateRefsh = () => {
//   layoutSettingStore.refsh = !layoutSettingStore.refsh
// }

//全屏按钮点击回调
const fullScreen = () => {
  //DOM的属性：判断是否全屏，true全屏，null就是非全屏
  //不同浏览器有不同，有插件实现
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //实现全屏
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏
    document.exitFullscreen()
  }
}

const modifyPassword = ()=>{
  
}

//退出登录点击回调
const logout =async () => {
  //第一件事情：需要向服务器发请求【退出登录接口】
  //第二件事情：仓库当中关于用户相关数据清空[token,username,avatar]
  //第三件事情：跳转到登录页面
  await userStore.userLogout()
  //跳转到登录页面
  $router.push({ path: '/login'})
}
</script>

<script lang="ts">
export default {
  name: 'DTabbarRight',
}
</script>

<style scoped lang="scss">
.tabbar-right-button {
  margin-right: 30px;
}

.tabbar-right-user {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  margin-right: 10px;

  .el-dropdown {
    margin-left: 10px;
  }
}
</style>
