<script setup lang="ts">

</script>

<template>
  <div>
   <el-button type="primary">init</el-button>
   <div class="demo-pagination-block">

    
    <div class="demonstration">All combined</div>
    <el-pagination

      :page-sizes="[100, 200, 300, 400]"
  
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    />
  </div>
  </div>

</template>

<style scoped>

</style>
