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
          {{ option }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      header: {
        type: String,
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
      modelValue: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .widget {
    width: 200px;
    padding: 8px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
  }
  
  .widget-header {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 6px;
  }
  
  .widget-body button {
    width: 25%;
    padding: 6px;
    margin: 0 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ddd;
    font-size: 0.9rem;
  }
  
  .widget-body button.active {
    background-color: #4caf50;
    color: white;
  }
  </style>
  