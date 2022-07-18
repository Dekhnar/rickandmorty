<script setup lang="ts">
defineProps<{ text: string }>();
</script>
<template>
  <figure
    class="flex flex-col text-gray-500 font-bold items-center justify-center"
  >
    <font-awesome-icon
      class="fa-2xl text-gray-300 mr-1"
      icon="fa-location-dot"
    />
    <caption>
      {{
        text
      }}
    </caption>
  </figure>
</template>
