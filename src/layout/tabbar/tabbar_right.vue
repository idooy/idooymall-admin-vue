<template>
  <div class="tabbar-right-button">
    <el-button type="primary" icon="Refresh" circle />
    <el-button type="primary" icon="FullScreen" circle @click="fullScreen" />
    <el-button type="primary" icon="Setting" circle />
  </div>
  <div class="tabbar-right-user">
    <el-avatar :size="32" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        Dropdown Listddddd
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
          <el-dropdown-item divided>Action 5</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
//用户小仓库
import { userModuleStore } from '@/store/user.ts'
let userStore = userModuleStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
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
  console.log(document.fullscreenElement)
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

//退出登录点击回调
const logout = async () => {
  //第一件事情：需要向服务器发请求【退出登录接口】
  //第二件事情：仓库当中关于用户相关数据清空[token,username,avatar]
  //第三件事情：跳转到登录页面
  await userStore.userLogout()
  // alert(123)
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'TabbarRight',
}
</script>

<style scoped lang="scss">
.tabbar-right-button {
  margin-right: 25px;
}

.tabbar-right-user {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;

  .el-dropdown {
    margin-left: 10px;
  }
}
</style>
