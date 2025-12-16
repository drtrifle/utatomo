<!-- components/layout/AppHeader.vue -->
<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center">
      <!-- Logo Section -->
      <router-link to="/" class="mr-6 flex items-center space-x-2">
        <span class="hidden font-bold sm:inline-block">UtaTomo</span>
        <small class="hidden text-muted-foreground sm:inline-block">Learn Through Music</small>
      </router-link>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
        <router-link to="/" class="transition-colors hover:text-foreground/80 text-muted-foreground">Home</router-link>
        <router-link to="/songs" class="transition-colors hover:text-foreground/80 text-muted-foreground">Songs</router-link>
        <router-link to="/about" class="transition-colors hover:text-foreground/80 text-muted-foreground">About</router-link>
      </nav>

      <div class="flex flex-1 items-center justify-end">
        <!-- Mobile Menu Toggle -->
        <Button
          variant="ghost"
          class="md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span class="sr-only">Toggle Menu</span>
        </Button>
      </div>
    </div>

    <!-- Mobile Menu (Dropdown) -->
    <transition name="slide-down">
        <nav v-if="isMobileMenuOpen" class="md:hidden flex flex-col space-y-2 p-4 bg-background border-t">
          <router-link to="/" class="py-2" @click="isMobileMenuOpen = false">Home</router-link>
          <router-link to="/songs" class="py-2" @click="isMobileMenuOpen = false">Songs</router-link>
          <router-link to="/about" class="py-2" @click="isMobileMenuOpen = false">About</router-link>
        </nav>
    </transition>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Button } from '@/components/ui/button';

export default defineComponent({
  name: 'AppHeader',
  components: {
    Button,
  },
  data() {
    return {
      isMobileMenuOpen: false as boolean
    };
  },
  watch: {
    // Close mobile menu when route changes
    $route() {
      this.isMobileMenuOpen = false;
    }
  }
});
</script>

<style scoped>
nav a.router-link-exact-active {
  @apply text-foreground;
}

/* Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease-in-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
