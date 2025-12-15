<template>
  <div class="tab-container">
    <v-tabs v-model="activeTab" grow>
      <v-tab v-for="(tab, index) in tabs" :key="index" :value="index">
        {{ tab }}
      </v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item
        v-for="(_, index) in tabs"
        :key="index"
        :value="index"
      >
        <div class="tab-content">
          <slot :name="`tab-${index}`"></slot>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';

defineProps({
  tabs: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const activeTab = ref(0);
</script>

<style scoped>
.tab-content {
  padding-top: 20px;
}
</style>