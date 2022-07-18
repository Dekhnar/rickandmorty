import type { Character, Info } from 'rickmortyapi/dist/interfaces';
import { defineStore } from "pinia";
import { useFilterStore } from "./filter";
import { useSearchStore } from "./search";
import axios from 'axios';
import type { AxiosError } from 'axios';
import { CharacterListScope } from '@/composables/character-provider';

interface CharactersState {
    pageIndex: number,
    characters: Character[],
    info?: Info<Character>["info"],
    isLoading: boolean,
    isReady: boolean,
    error?: any,
}
let abortControllers: Record<string, AbortController> = {};
let subscriptions: Record<string, Array<() => void>> = {};

export const useCharactersStore = (characterListScope: CharacterListScope) => {
    const isSearchScope = characterListScope == CharacterListScope.search;
    const isListScope = characterListScope == CharacterListScope.list;
    return defineStore({
        id: 'characters' + characterListScope,
        state: (): CharactersState => {
            return {
                pageIndex: 0,
                characters: [],
                info: undefined,
                isLoading: false,
                isReady: false,
                error: undefined,
            };
        },
        getters: {
            characterCount: (state) => state?.characters?.length ?? 0,
            hasMore: (state) => !!state.info?.next,
            canLoadData: (_) => {
                return (isSearchScope && useSearchStore().searchTerm) || isListScope;
            }
        },
        actions: {
            async init(options: { onUserSearchingOrFiltering?: () => void } = {}) {
                this.listenSearchingAndFilteringOfUsers(options);
                await this.refresh();
            },
            listenSearchingAndFilteringOfUsers(options: { onUserSearchingOrFiltering?: () => void } = {}) {
                const { onUserSearchingOrFiltering } = options;
                const _onUserSearchingOrFiltering = onUserSearchingOrFiltering ?? (() => { });
                subscriptions[characterListScope] = [];
                subscriptions[characterListScope].push(useSearchStore().$subscribe((_, { searchTerm }) => {
                    if (isSearchScope) {
                        if (searchTerm) {
                            this.refresh().then(_onUserSearchingOrFiltering);
                        } else {
                            if (abortControllers[characterListScope]) abortControllers[characterListScope].abort();
                            this.pageIndex = 0;
                            this.characters = [];
                            this.info = undefined;
                            this.isLoading = false;
                            this.isReady = false;
                            this.error = undefined;
                        }
                    } else {
                        this.refresh().then(_onUserSearchingOrFiltering);
                    }
                }))
                subscriptions[characterListScope].push(useFilterStore().$subscribe(this.refresh))
            },
            async refresh() {
                if (!this.canLoadData) return;
                this.isReady = false;
                if (abortControllers[characterListScope]) abortControllers[characterListScope].abort();
                this.pageIndex = 0;
                await this.fetchPage();
            },
            async loadNextPage() {
                console.log("loadNextPage")
                if (!this.canLoadData || this.isLoading) return;
                this.pageIndex++;
                await this.fetchPage();

            },
            async fetchPage() {
                if (this.pageIndex > 1 && !this.hasMore) return;

                const { searchTerm: name } = useSearchStore();
                const { status } = useFilterStore();

                if (abortControllers[characterListScope]) abortControllers[characterListScope].abort();
                abortControllers[characterListScope] = new AbortController();
                this.isLoading = true;
                try {
                    const { VITE_RICK_AND_MORTY_API_BASE_URL } = import.meta.env;
                    const { data: { info, results } } = await axios.get<Info<Character[]>>(
                        VITE_RICK_AND_MORTY_API_BASE_URL + 'character',
                        { params: { status, name, page: this.pageIndex + 1 }, timeout: 2000 }
                    );
                    this.info = info;
                    this.characters = [
                        ...(this.pageIndex > 0 ? this.characters ?? [] : []),
                        ...(results || [])
                    ];
                    this.isReady = true;
                } catch (error: any | AxiosError) {
                    if (!axios.isCancel(error)) {
                        // TODO handle error with retry
                        this.error = error;
                    }
                } finally {
                    this.isLoading = false;
                }
            },
            dispose() {
                if (abortControllers[characterListScope]) abortControllers[characterListScope].abort();
                if (subscriptions[characterListScope]) {
                    subscriptions[characterListScope].forEach((unsubscription) => unsubscription());
                }
                this.$reset();
                this.$dispose();
            }
        },
    });

}