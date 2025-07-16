<template>
    <el-result icon="error" title="404 Not Found">
        <template #sub-title>
            <h2>调皮！！！怎么会尝试访问一个不真实的请求地址~~~~~</h2>
        </template>
        <template #extra>
            <el-button type="primary" @click="goHome()">返回首页</el-button>
        </template>
    </el-result>
</template>



<script setup lang='ts'>
import { useRouter } from 'vue-router';
const router = useRouter()

const goHome=()=>{
    router.push('/home')
}
</script>

<script lang='ts'>
export default {
    name: '404',
}
</script>

<style scoped></style>