import type { Character } from 'rickmortyapi/dist/interfaces';
import { defineStore } from "pinia";
import axios from 'axios';
import type { AxiosError } from 'axios';

interface CharactersState {
    character?: Character,
    isLoading: boolean,
    error?: any,
}

let abortController: undefined | AbortController;

export const useCharacterStore = defineStore({
    id: "character",
    state: (): CharactersState => ({
        isLoading: false,
        character: undefined,
        error: undefined,
    }),
    actions: {
        async fetchCharacterById(id: string) {
            if (abortController) abortController.abort();
            abortController = new AbortController();
            this.isLoading = true;
            try {
                const { VITE_RICK_AND_MORTY_API_BASE_URL } = import.meta.env;
                const { data: character } = await axios.get<Character>(
                    `${VITE_RICK_AND_MORTY_API_BASE_URL}character/${id}`,
                    { signal: abortController.signal, timeout: 2000 }
                );
                this.character = character;
            } catch (error: any | AxiosError) {
                if (!axios.isCancel(error)) {
                    // TODO handle error with retry
                    this.error = error;
                }
            }
            this.isLoading = false;
        },
        dispose() {
            if (abortController) abortController.abort();
            this.$reset();
            this.$dispose();
        }
    },
});
