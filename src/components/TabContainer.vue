<template>
  <div class="tab-container">
    <div class="tab-header">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <slot :name="`tab-${activeTab}`"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    tabs: {
      type: Array as () => string[],
      required: true,
    },
  },
  data() {
    return {
      activeTab: 0,
    };
  },
});
</script>

<style scoped>
.tab-header {
  display: flex;
  border-bottom: 2px solid #ccc;
}
.tab-header button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 16px;
  position: relative;
  color: #555;
}
.tab-header button.active {
  color: #000;
  font-weight: bold;
}
.tab-header button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007bff;
}
.tab-content {
  padding-top: 20px;
}
</style>
