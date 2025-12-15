<!-- components/layout/AppHeader.vue -->
<template>
  <v-app-bar>
    <v-toolbar-title>
      <router-link to="/" class="logo-link">
        <span class="brand">UtaTomo</span>
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex">
      <v-btn variant="text" to="/">Home</v-btn>
      <v-btn variant="text" to="/songs">Songs</v-btn>
      <v-btn variant="text" to="/about">About</v-btn>
    </div>

    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>

    <!-- Mobile Navigation Toggle -->
    <v-app-bar-nav-icon class="d-md-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>
  
  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <v-list-item to="/" @click="drawer = false">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/songs" @click="drawer = false">
        <v-list-item-title>Songs</v-list-item-title>
      </v-list-item>
      <v-list-item to="/about" @click="drawer = false">
        <v-list-item-title>About</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTheme } from 'vuetify';

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const theme = useTheme();
    return { theme };
  },
  data() {
    return {
      drawer: false as boolean
    };
  },
  computed: {
    isDark(): boolean {
      return this.$vuetify.theme.global.current.dark;
    }
  },
  methods: {
    toggleTheme() {
      const newTheme = this.$vuetify.theme.global.current.dark ? 'light' : 'dark';
      this.theme.change(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  },
  watch: {
    $route() {
      this.drawer = false;
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme.change(savedTheme);
    }
  }
});
</script>

<style scoped>
.logo-link {
  text-decoration: none;
  color: inherit;
}
.brand {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>