<template>
  <v-container>
    <v-btn to="/songs" prepend-icon="mdi-arrow-left" class="mb-4">Back to Songs</v-btn>

    <div v-if="song" class="song-details-container">
      <v-card>
        <v-card-text>
          <StickyVideo :youtubeUrl="song.youtubeUrl" />

          <TabContainer :tabs="tabs" v-if="lyrics">
            <template #tab-0>
              <v-row class="widget-container my-4" justify="center">
                <v-col cols="auto">
                  <ToggleWidget header="English Lyrics" :options="['On', 'Off']" v-model="engLyricsIdx" />
                </v-col>
                <v-col cols="auto">
                  <ToggleWidget header="Font Size" :options="['S', 'M', 'L']" v-model="fontSizeIdx" />
                </v-col>
                <v-col cols="auto">
                  <ToggleWidget header="Alignment" :options="alignmentOptions" v-model="textAlignIdx" />
                </v-col>
              </v-row>
              <div
                class="overflow-y-auto pa-4 border rounded"
                style="max-height: calc(100vh - 450px);"
              >
                <div v-if="lyrics">
                  <div v-for="(line, index) in lyrics" :key="index" :class="[fontSizeClass, textAlignClass]">
                    <div v-if="!line.isEmpty()">
                      <div class="line-container">
                        <div class="chinese-line">
                          <template v-for="(segment, idx) in line.getAnnotatedText()" :key="idx">
                            <div class="char-container">
                              <span class="ruby">{{ segment.ruby }}</span>
                              <span class="text">{{ segment.text }}</span>
                            </div>
                          </template>
                        </div>
                        <small v-if="engLyricsIdx == 0">{{ line.EngStr }}</small>
                      </div>
                    </div>
                    <div v-else>&nbsp;</div>
                  </div>
                </div>
              </div>
            </template>
            <template #tab-1>
              <VocabList v-if="vocab" :vocab="vocab" :language="language" />
            </template>
          </TabContainer>
          <LoadingSpinner v-else message="Loading lyrics..." />
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <LoadingSpinner message="Loading song details..." />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchSongById, fetchLyricsById } from '../services/songService';
import { SongInfo } from '../models/SongInfo';
import { SongLyric } from '../models/SongLyric';

import LoadingSpinner from '@/components/widgets/LoadingSpinner.vue';
import StickyVideo from '../components/StickyVideo.vue';
import ToggleWidget from '../components/widgets/ToggleWidget.vue';
import TabContainer from '../components/TabContainer.vue';
import VocabList from '../components/VocabList.vue';

const route = useRoute();
const song = ref<SongInfo | null>(null);
const lyrics = ref<SongLyric[] | null>(null);
const vocab = ref<string[] | null>(null);
const language = ref('');
const engLyricsIdx = ref(0);
const fontSizeIdx = ref(1);
const textAlignIdx = ref(0);

const alignmentOptions = [
  '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h480v80H120Z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M240-240v-80h480v80H240Zm-120-200v-80h720v80H120Zm120-200v-80h480v80H240Zm-120-200v-80h720v80H120Z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm240-200v-80h480v80H360Zm-240-200v-80h720v80H120Zm240-200v-80h480v80H360Z"/></svg>',
];

const tabs = computed(() => {
  const tabList = ['Lyrics'];
  if (vocab.value && vocab.value.length > 0) {
    tabList.push('Vocabulary');
  }
  return tabList;
});

const fontSizeClass = computed(() => ({
  'font-small': fontSizeIdx.value === 0,
  'font-medium': fontSizeIdx.value === 1,
  'font-large': fontSizeIdx.value === 2,
}));

const textAlignClass = computed(() => ({
  'text-left': textAlignIdx.value === 0,
  'text-center': textAlignIdx.value === 1,
  'text-right': textAlignIdx.value === 2,
}));

onMounted(async () => {
  try {
    const songId = route.params.id as string;
    language.value = route.params.language as string;

    const fetchedSong = await fetchSongById(songId);
    if (fetchedSong) {
      song.value = fetchedSong;

      const lyricsAndVocab = await fetchLyricsById(songId, language.value);
      if (lyricsAndVocab) {
        lyrics.value = lyricsAndVocab.lyrics;
        vocab.value = lyricsAndVocab.vocab;
      }
    }
  } catch (error) {
    console.error('Error in fetchData:', error);
  }
});
</script>

<style scoped>
.widget-container {
  width: 100%;
}

.line-container {
  margin: 0.5em 0;
}

.chinese-line {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 0.5em;
}

.char-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1em;
}

.ruby {
  font-size: 0.7em;
  color: #666;
  height: 1.2em;
  text-align: center;
}

.text {
  font-size: 1.2em;
}

.font-small .text {
  font-size: 1em;
}

.font-medium .text {
  font-size: 1.2em;
}

.font-large .text {
  font-size: 1.4em;
}

/* This will align the chinese characters */
.text-left .chinese-line {
  justify-content: flex-start;
}
.text-center .chinese-line {
  justify-content: center;
}
.text-right .chinese-line {
  justify-content: flex-end;
}
</style>