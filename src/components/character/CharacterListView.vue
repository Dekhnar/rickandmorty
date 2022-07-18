<script setup lang="ts">
import { vIntersectionObserver, vInfiniteScroll } from "@vueuse/components";
import { useCharactersStore } from "@/stores/characters";
import useCharacterListContext, {
  CharacterListScope,
} from "@/composables/character-provider";
import { storeToRefs } from "pinia";

type Axis = "vertical" | "horizontal";

const props = withDefaults(
  defineProps<{
    scrollDirection?: Axis;
    autoFetch?: boolean;
  }>(),
  {
    scrollDirection: "horizontal",
    autoFetch: true,
  }
);
const characterListScope = useCharacterListContext();
const charactersStore = useCharactersStore(characterListScope)();
const { isLoading, characters } = storeToRefs(charactersStore);

const isUserCanScroll = ref(false);
const isBottomVisible = ref(true);

const onBottomVisible = ([{ isIntersecting }]) => {
  isBottomVisible.value = isIntersecting;
  if (isUserCanScroll.value && isBottomVisible.value) {
    charactersStore.loadNextPage();
  }
};

const loadNextPageUntilUserCanScroll = async (): Promise<void> => {
  if (!props.autoFetch) {
    return;
  }
  if (
    charactersStore.isReady &&
    charactersStore.characterCount &&
    charactersStore.hasMore &&
    !isUserCanScroll.value &&
    isBottomVisible.value
  ) {
    await charactersStore.loadNextPage();
    await loadNextPageUntilUserCanScroll();
  } else {
    isUserCanScroll.value = true;
    return;
  }
};

charactersStore
  .init({
    onUserSearchingOrFiltering: () => {
      if (characterListScope !== CharacterListScope.list) return;
      isUserCanScroll.value = false;
      loadNextPageUntilUserCanScroll();
    },
  })
  .then(() => loadNextPageUntilUserCanScroll());
</script>
<template>
  <ul
    class="flex h-[100%] w-[90%] m-auto pb-2"
    :class="{
      '!flex-col': scrollDirection == 'vertical',
      ' flex-wrap': scrollDirection == 'horizontal',
    }"
    v-infinite-scroll="[charactersStore.loadNextPage, { distance: 0 }]"
  >
    <template v-if="characters.length">
      <li
        v-for="character in characters"
        :key="`character-list-view-${character.id}`"
        class="mx-1 mb-1"
      >
        <router-link :to="`/characters/${character.id}`">
          <slot name="character" :character="character" />
        </router-link>
      </li>
    </template>
    <slot v-else-if="!isLoading" name="empty" />
    <slot name="loading" :loading="isLoading" />
    <div
      class="h-2 w-full bg-transparent mt-4"
      v-intersection-observer="onBottomVisible"
    />
  </ul>
</template>
