<template>
    <div class="widget compact">
      <div class="widget-header">{{ header }}</div>
      <div class="widget-body">
        <button 
          v-for="(option, index) in options" 
          :key="index" 
          :class="{ active: modelValue === index }" 
          @click="$emit('update:modelValue', index)"
        >
          <span v-html="option" />
        </button>
      </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    props: {
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
    },
});
  </script>
  
  <style scoped>
  .widget {
    padding: 4px 8px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }
  
  .widget-header {
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .widget-body {
    display: flex;
    gap: 4px;
  }
  
  .widget-body button {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ddd;
    font-size: 0.8rem;
  }
  
  .widget-body button.active {
    background-color: #4caf50;
    color: white;
  }
  </style>
  