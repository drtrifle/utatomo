<template>
  <div class="loading-spinner">
    <div 
      class="spinner" 
      :style="spinnerStyle"
    ></div>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, CSSProperties } from 'vue';

type SpinnerSize = 'small' | 'medium' | 'large';

export default defineComponent({
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String as PropType<string>,
      default: '',
    },
    size: {
      type: String as PropType<SpinnerSize>,
      default: 'medium', // small, medium, large
    },
    color: {
      type: String as PropType<string>,
      default: '#3498db', // default blue
    },
  },
  computed: {
    spinnerStyle(): CSSProperties {
      const sizeMap: Record<SpinnerSize, string> = {
        small: '30px',
        medium: '50px',
        large: '70px',
      };
      return {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTop: `4px solid ${this.color}`,
        borderRadius: '50%',
        width: sizeMap[this.size],
        height: sizeMap[this.size],
      };
    },
  },
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: spin 1s linear infinite; /* Ensure animation is applied */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.message {
  margin-top: 10px;
  font-size: 1rem;
  color: v-bind(color); /* Vue 3 feature for simple bindings */
}
</style>