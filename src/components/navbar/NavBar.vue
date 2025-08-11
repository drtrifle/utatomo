<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/songs">Songs</router-link> |
    <router-link to="/about">About</router-link>
    <router-link v-if="isDev" to="/devtool">Dev</router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isDev: import.meta.env.DEV as boolean
    }
  }
});
</script>