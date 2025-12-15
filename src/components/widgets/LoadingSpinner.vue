<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-progress-circular
      :size="sizeMap[size]"
      :color="color"
      indeterminate
    ></v-progress-circular>
    <p v-if="message" class="mt-2" :style="{ color: color }">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type SpinnerSize = 'small' | 'medium' | 'large';

defineProps({
  message: {
    type: String as PropType<string>,
    default: '',
  },
  size: {
    type: String as PropType<SpinnerSize>,
    default: 'medium',
  },
  color: {
    type: String as PropType<string>,
    default: 'primary',
  },
});

const sizeMap: Record<SpinnerSize, number> = {
  small: 30,
  medium: 50,
  large: 70,
};
</script>