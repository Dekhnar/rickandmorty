<script setup lang="ts">
import {
  CharacterListScope,
  CurrentCharacterListContext,
} from "@/composables/character-provider";
import { useCharactersStore } from "@/stores/characters";
import { useSearchStore } from "@/stores/search";
import FilterDropdown from "../../components/FilterDropdown.vue";
import BaseEmptyList from "../../components/BaseEmptyList.vue";

const characterListScope = CharacterListScope.list;
const contextKey = CurrentCharacterListContext;
const charactersStore = useCharactersStore(characterListScope)();

const searchStore = useSearchStore();
onUnmounted(() => {
  searchStore.$reset();
  charactersStore.dispose();
});
</script>
<template>
  <header
    class="p-4 z-50 fixed flex w-full bg-white justify-between h-12 items-center shadow-sm"
  >
    <FilterDropdown />
    <SearchBar />
  </header>
  <provider :context="characterListScope" :context-key="contextKey">
    <section id="characters" class="mx-auto bg-gray-100">
      <CharacterListView class="pt-14 justify-center">
        <template #character="{ character }">
          <CharacterListItem :character="character" />
        </template>
        <template #loading="{ loading }">
          <CharacterListViewPlaceholder v-if="loading" />
        </template>
        <template #empty>
          <BaseEmptyList class="w-full h-full" text="No characters" />
        </template>
      </CharacterListView>
    </section>
  </provider>
</template>
