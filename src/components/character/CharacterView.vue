<script setup lang="ts">
import { useCharacterStore } from "@/stores/character";
import { storeToRefs } from "pinia";

const { characterId } = defineProps<{ characterId: string }>();
const characterStore = useCharacterStore();
characterStore.fetchCharacterById(characterId);
const { isLoading, error, character } = storeToRefs(characterStore);

onUnmounted(() => {
  characterStore.dispose();
});
</script>
<template>
  <p v-if="isLoading">Loading...</p>
  <p v-else-if="error">Error</p>
  <article
    v-else-if="character"
    class="mt-4 bg-white border-[1px] border-gray-200 rounded p-4 flex flex-col items-stretch sm:flex-row"
  >
    <figure class="m-auto sm:mr-4">
      <img
        class="h-auto w-auto rounded"
        :src="character.image"
        :alt="character.name"
      />
    </figure>
    <caption
      class="mt-4 sm:mt-0 sm:grow flex flex-col items-stretch text-start"
    >
      <h1 class="text-3xl font-bold">{{ character.name }}</h1>
      <span class="text-gray-500 font-bold">
        <font-awesome-icon class="text-gray-300 mr-1" icon="fa-location-dot" />
        {{ character.location.name }}
      </span>
      <ul
        class="flex flex-wrap border-t-[1px] border-gray-200 justify-between mt-2"
      >
        <li
          v-for="(prop, index) in ['species', 'status', 'gender']"
          :key="prop"
          class="text-center grow mt-2"
          :class="{ 'border-r-[1px] border-gray-200': index != 2 }"
        >
          <p class="font-bold">
            {{ character[prop] }}
          </p>
          <p class="text-gray-500 uppercase font-bold">{{ prop }}</p>
        </li>
      </ul>
    </caption>
  </article>
</template>
