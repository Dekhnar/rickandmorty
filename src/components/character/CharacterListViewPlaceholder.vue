<script lang="ts" setup>
defineProps({
  placeholderCount: {
    type: Number,
    default: 5,
  },
});
</script>
<template>
  <div class="flex flex-wrap">
    <li
      v-for="index in placeholderCount"
      :key="`character-list-view-${index}`"
      class="mx-1 mb-1"
    >
      <div>
        <div data-placeholder class="h-32 w-36 rounded bg-gray-400" />
        <div data-placeholder class="w-36 h-5 mt-1 rounded bg-gray-400" />
      </div>
    </li>
  </div>
</template>

<style lang="css" scoped>
div[data-placeholder] {
  position: relative;
}

div[data-placeholder]:after {
  content: " ";
  box-shadow: 0 0 50px 9px rgba(254, 254, 254);
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  animation: load 1s infinite;
}

@keyframes load {
  0% {
    left: -100%;
  }
  100% {
    left: 150%;
  }
}
</style>
