<template>
  <slot />
</template>
<script setup lang="ts">
const props = defineProps<{
  contextKey?: Symbol;
  context?: any;
  contextKeys?: Symbol[];
  contexts?: any[];
}>();
if (props.contextKey) provide(props.contextKey, props.context);
props.contextKeys?.forEach((contextKey, index) => {
  if (Array.isArray(props.contexts)) {
    provide(contextKey, props.contexts[index]);
  }
});
</script>
