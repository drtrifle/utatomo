<template>
    <router-link 
      :to="to" 
      class="link-button"
      :style="{ 
        backgroundColor: color,
        '--hover-color': hoverColor
      }"
    >
      {{ text }}
    </router-link>
  </template>
  
  <script>
  export default {
    name: 'LinkButton',
    props: {
      to: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#007bff' // Default blue
      },
      hoverColor: {
        type: String,
        default: '#0056b3' // Darker blue
      }
    }
  };
  </script>
  
  <style scoped>
  .link-button {
    display: inline-block;
    font-size: 1.2rem;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  
  .link-button:hover {
    background-color: var(--hover-color) !important;
  }
  </style>