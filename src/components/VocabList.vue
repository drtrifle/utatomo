<template>
  <div class="vocab-list">
    <ScrollableContainer :maxHeight="'calc(100vh - 350px)'">
      <ul>
        <li v-for="(vocab, index) in vocab" :key="index">
          <a :href="jishoLink(vocab)" target="_blank" rel="noopener noreferrer">
            {{ vocab.split('-')[0] }}
          </a>
        </li>
      </ul>
    </ScrollableContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ScrollableContainer = defineAsyncComponent(() =>
  import('../components/ScrollableContainer.vue')
);

export default defineComponent({
  components: {
    ScrollableContainer,
  },
  props: {
    vocab: {
      type: Array as () => string[],
      required: true,
    },
  },
  methods: {
    jishoLink(word: string) {
      const query = word.split('-')[0];
      return `https://jisho.org/search/${query}`;
    },
  },
});
</script>

<style scoped>
.vocab-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.vocab-list li {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.vocab-list li:last-child {
  border-bottom: none;
}

.vocab-list li:hover {
  background-color: #f9f9f9;
}

.vocab-list a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  display: block;
}

.vocab-list a:hover {
  color: #007bff;
}
</style>
