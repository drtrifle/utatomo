<!-- components/layout/AppHeader.vue -->
<template>
    <header class="app-header">
      <div class="header-content">
        <!-- Logo Section -->
        <router-link to="/" class="logo">
          <span class="brand">UtaTomo</span>
          <small>Learn Through Music</small>
        </router-link>
  
        <!-- Navigation Links -->
        <nav class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/songs">Songs</router-link>
          <router-link to="/about">About</router-link>
        </nav>
  
        <!-- Mobile Menu Toggle -->
        <button 
          class="menu-toggle"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>
  
      <!-- Mobile Menu (Dropdown) -->
      <transition name="slide-down">
        <nav v-if="isMobileMenuOpen" class="mobile-nav">
          <router-link to="/" @click="isMobileMenuOpen = false">Home</router-link>
          <router-link to="/songs" @click="isMobileMenuOpen = false">Songs</router-link>
          <router-link to="/about" @click="isMobileMenuOpen = false">About</router-link>
        </nav>
      </transition>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppHeader',
    data() {
      return {
        isMobileMenuOpen: false
      };
    },
    watch: {
      // Close mobile menu when route changes
      $route() {
        this.isMobileMenuOpen = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .app-header {
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo {
    text-decoration: none;
    color: #2c3e50;
  }
  .brand {
    font-size: 1.5rem;
    font-weight: 600;
    display: block;
  }
  .brand small {
    font-size: 0.8rem;
    font-weight: 400;
    color: #7f8c8d;
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  .nav-links a {
    text-decoration: none;
    color: #34495e;
    font-weight: 500;
    transition: color 0.3s;
  }
  .nav-links a:hover,
  .nav-links a.router-link-exact-active {
    color: #007bff;
  }
  
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .mobile-nav {
    display: none;
    flex-direction: column;
    background: white;
    padding: 1rem;
    border-top: 1px solid #eee;
  }
  .mobile-nav a {
    padding: 0.5rem 0;
    text-decoration: none;
    color: #34495e;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    .menu-toggle {
      display: block;
    }
    .mobile-nav {
      display: flex;
    }
  }
  
  /* Animation */
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>