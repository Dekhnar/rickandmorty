<script setup lang="ts">
import {
  CharacterListScope,
  CurrentCharacterListContext,
} from "@/composables/character-provider";
import { useSearchStore } from "@/stores/search";
import SearchBarHintsPlaceholder from "./SearchBarHintsPlaceholder.vue";

interface SearchTheme {
  width: string | number;
  height?: string | number;
  style: string;
}

const SearchTheme = (options: SearchTheme): SearchTheme => ({
  height: "max-h-52 h-52",
  ...options,
});

const focusedTheme: SearchTheme = SearchTheme({
  width: "w-56",
  style: "bg-white rounded-lg",
});

const unfocusedTheme: SearchTheme = SearchTheme({
  width: "w-4",
  style: "bg-transparent rounded-lg",
});

const searchBarRef = ref();
const modalRef = ref();

const isModalHovered = useElementHover(modalRef);
const { focused } = useFocus(searchBarRef);

const characterListScope = CharacterListScope.search;
const searchStore = useSearchStore();

const canShowHintsPopup = computed(() => focused.value || isModalHovered.value);

const searchTerm = ref("");
const contextKey = CurrentCharacterListContext;

const theme = computed(() => {
  return canShowHintsPopup.value || searchTerm.value
    ? focusedTheme
    : unfocusedTheme;
});

const toggleSearchBarFocus = () => {
  if (canShowHintsPopup.value) {
    if (searchStore.searchTerm) return;
    searchBarRef.value.unfocus();
  } else {
    searchBarRef.value.focus();
  }
};

const search = (searchTerm?: string) => {
  searchStore.searchTerm = searchTerm;
};
const debouncedSearch = useDebounceFn(search, 300);
watch(searchTerm, (searchTerm) => {
  debouncedSearch(searchTerm);
});
</script>
<template>
  <form
    class="transition-[width] flex items-center relative"
    :class="`${theme.width}`"
  >
    <font-awesome-icon
      class="fa-xl text-gray-400 hover:text-gray-500 mr-2"
      icon="fa-search"
      @click="toggleSearchBarFocus"
    />
    <input
      ref="searchBarRef"
      class="bg-transparent p-1 border-[1px] outline-0 border-gray-300 rounded focus:border-gray-500 focus:border-[2px]"
      :class="`${theme.width}`"
      placeholder="Rick, Morty, Jerry, etc"
      v-model="searchTerm"
      aria-labelledby="charactersearch-label"
      id="charactersearch-input"
      type="search"
    />

    <provider :context="characterListScope" :context-key="contextKey">
      <section
        @click.strop.prevent
        v-if="canShowHintsPopup"
        ref="modalRef"
        class="z-[99] mt-2 pl-2 drop-shadow-md transition-opacity duration-300 absolute top-8 bottom-0"
        :class="` 
        ${theme.height} 
        ${theme.width}
        ${theme.style}
        ${searchTerm ? 'opacity-100' : 'opacity-0'}
        `"
        :scrollDirection="'vertical'"
      >
        <CharacterListView
          class="overflow-x-hidden overflow-y-scroll"
          :auto-fetch="false"
        >
          <template #character="{ character }">
            <p :class="`border-b-[1px] border-gray-400 ${theme.width}`">
              {{ character.name }}
            </p>
          </template>
          <template #loading="{ loading }">
            <SearchBarHintsPlaceholder v-if="loading" />
          </template>
          <template #empty>
            <BaseEmptyList
              v-if="searchTerm"
              class="w-full h-full"
              text="No results"
            />
          </template>
        </CharacterListView>
      </section>
    </provider>
  </form>
</template>
