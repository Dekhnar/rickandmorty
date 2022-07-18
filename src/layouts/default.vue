<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <header class="z-50 bg-black p-4 fixed w-full top-0 overflow-hidden">
    <TheNavBar />
  </header>
  <main class="pt-16 bg-gray-100 h-screen">
    <router-view :key="route.path" v-bind="$attrs" />
  </main>
</template>

<style scoped></style>
