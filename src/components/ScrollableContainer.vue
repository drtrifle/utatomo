<template>
    <div class="scrollable-container">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    props: {
        maxHeight: {
            type: String as PropType<string>,
            default: '400px', // Default maximum height if not provided
        },
    },
});
</script>

<style scoped>
.scrollable-container {
    overflow-y: auto;
    max-height: var(--max-height, 400px);
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Custom property fallback for maxHeight */
.scrollable-container {
    --max-height: inherit;
}
</style>