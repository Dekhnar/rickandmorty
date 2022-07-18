import { defineStore } from "pinia";
import type { Character } from 'rickmortyapi/dist/interfaces';

type Status = Character['status']

interface FilterState {
    status?: Status;
}

export const useFilterStore = defineStore({
    id: "filter",
    state: (): FilterState => ({ status: undefined }),
    actions: {
        updateFilter(status: Status) {
            this.status = status;
        },
    },
});
