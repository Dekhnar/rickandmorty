<script lang="ts" setup>
const selectedCharacterId = useRoute().params.id as string;
</script>
<template>
  <div class="flex items-center text-gray-500">
    <router-link to="/characters" class="hover:text-gray-700">
      Characters
    </router-link>
    <span class="mx-2">/</span>
    <span>
      {{ selectedCharacterId }}
    </span>
  </div>
</template>
