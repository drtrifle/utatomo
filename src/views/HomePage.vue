<template>
  <v-container class="home-page d-flex flex-column justify-center align-center text-center fill-height">
    <h1 class="text-h2 font-weight-bold mb-4">Welcome to UtaTomo</h1>
    <p class="text-h5 mb-4">Learn languages through songs!</p>
    <LinkButton 
      to="/songs" 
      text="View Song List"
      color="primary"
    />
  </v-container>
</template>

<script setup lang="ts">
import LinkButton from '../components/widgets/LinkButton.vue';
</script>