<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppHeader
  }
});
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
}
</style>