<script setup lang="ts">
import { useFilterStore } from "@/stores/filter";
const filterStore = useFilterStore();
const options = ["All", "Dead", "Alive", "unknown"];
</script>
<template>
  <select
    v-model="filterStore.status"
    class="border-gray-400 border-[1px] rounded"
  >
    <option
      v-for="(option, index) in options"
      :value="index === 0 ? undefined : option"
    >
      {{ option }}
    </option>
  </select>
</template>
