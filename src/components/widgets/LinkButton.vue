<template>
  <v-btn :to="to" :color="color" class="link-button">
    {{ text }}
  </v-btn>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  to: {
    type: String as PropType<string>,
    required: true,
  },
  text: {
    type: String as PropType<string>,
    required: true,
  },
  color: {
    type: String as PropType<string>,
    default: 'primary',
  },
});
</script>

<style scoped>
.link-button {
  font-size: 1.2rem;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}
</style>