<template>
  <div class="vocab-list">
    <div class="overflow-y-auto pa-4 border rounded" style="max-height: calc(100vh - 350px);">
      <v-list density="compact">
        <v-list-item v-for="(word, index) in vocab" :key="index">
          <a :href="dictionaryLink(word)" target="_blank" rel="noopener noreferrer">
            {{ word.split('-')[0] }}
          </a>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  vocab: {
    type: Array as PropType<string[]>,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const dictionaryLink = (word: string) => {
  const query = word.split('-')[0];
  if (props.language === 'chinese') {
    return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${query}`;
  }
  return `https://jisho.org/search/${query}`;
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  display: block;
}

a:hover {
  color: #007bff;
}
</style>