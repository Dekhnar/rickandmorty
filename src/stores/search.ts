import { defineStore } from "pinia";

interface SearchState {
  searchTerm?: string,
}

export const useSearchStore = defineStore({
  id: "search",
  state: (): SearchState => ({ searchTerm: undefined }),
  actions: {
    updateSearchTerm(text: string) {
      this.searchTerm = text;
    },
  },
});
