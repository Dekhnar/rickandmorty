<script lang="ts" setup>
defineProps({
  placeholderCount: {
    type: Number,
    default: 9,
  },
});
</script>
<template>
  <div class="flex flex-col">
    <ul class="flex flex-wrap justify-center">
      <li v-for="index in placeholderCount" :key="`search-bar-hints-${index}`">
        <div>
          <div data-placeholder class="w-48 h-3 my-1 bg-gray-400" />
          <div data-placeholder class="w-48 h-[1px] bg-gray-400" />
        </div>
      </li>
    </ul>
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
