<template>
  <header class="p-4 z-50 bg-white h-12 shadow-sm">
    <TheBreadcrumb />
  </header>
  <CharacterView class="mx-4" :characterId="selectedCharacterId" />
</template>
<script lang="ts" setup>
const selectedCharacterId = useRoute().params.id as string;
</script>
