<template>
  <div class="home-page">
    <h1>Welcome to UtaTomo</h1>
    <p>Learn languages through songs!</p>
    <LinkButton 
      to="/songs" 
      text="View Song List"
      color="#007bff"
      hover-color="#0056b3"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LinkButton from '../components/widgets/LinkButton.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    LinkButton
  }
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh; /* Full viewport height */
  background-color: #f9f9f9; /* Subtle background */
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #555;
}
</style>
