<template>

  <router-view v-slot="{ Component }">
    <Transition name="fade">
      <Component :is="Component" />
    </Transition>
  </router-view>

</template>



<script setup lang='ts'>

</script>

<script lang='ts'>
export default {
  name: 'Main',
}
</script>

<style scoped></style>