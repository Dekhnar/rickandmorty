<script setup lang="ts">
import type { Character } from "rickmortyapi/dist/interfaces";
defineProps<{ character: Character }>();
</script>
<template>
  <article
    class="rounded border-[1px] border-gray-200 hover:shadow p-2 bg-white"
  >
    <figure>
      <img
        class="h-auto max-h-32 max-w-32 rounded"
        :src="character.image"
        :alt="character.name"
      />
    </figure>
    <caption>
      <p
        class="w-32 max-w-32 center block whitespace-nowrap text-ellipsis overflow-hidden"
      >
        {{ character.name }}
      </p>
    </caption>
  </article>
</template>
