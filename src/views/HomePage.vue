<template>
  <div class="home-page">
    <h1>Welcome to UtaTomo</h1>
    <p>Learn languages through songs!</p>
    <router-link to="/songs" class="view-songs-link">View Song List</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
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

.view-songs-link {
  font-size: 1.2rem;
  color: white;
  background-color: #007bff;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.view-songs-link:hover {
  background-color: #0056b3;
}
</style>
