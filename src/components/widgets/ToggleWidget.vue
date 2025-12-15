<template>
  <div class="widget">
    <div class="widget-header">{{ header }}</div>
    <v-btn-toggle
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      density="compact"
      divided
    >
      <v-btn v-for="(option, index) in options" :key="index">
        <span v-html="option" />
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  header: {
    type: String as PropType<string>,
    required: true,
  },
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  modelValue: {
    type: Number as PropType<number>,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.widget {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.widget-header {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>