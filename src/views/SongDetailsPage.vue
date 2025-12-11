<template>
  <div class="song-details-page">
    <button @click="$router.push('/songs')" class="back-button">← Back to Songs</button>

    <div v-if="song" class="song-details-container">
      <div class="container-padding">
        <!-- Sticky Video -->
        <StickyVideo :youtubeUrl="song.youtubeUrl" />

        <!-- Widget Container -->
        <div class="widget-container">
          <div class="widget-wrap">
            <ToggleWidget header="English Lyrics" :options="['On', 'Off']" v-model="engLyricsIdx" />
            <ToggleWidget header="Font Size" :options="['S', 'M', 'L']" v-model="fontSizeIdx" />
            <ToggleWidget header="Alignment" :options="alignmentOptions" v-model="textAlignIdx" />
          </div>
        </div>

        <!-- Tabs for Lyrics and Vocab -->
        <TabContainer :tabs="tabs" v-if="lyrics">
          <template #tab-0>
            <ScrollableContainer :maxHeight="'calc(100vh - 350px)'">
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
            </ScrollableContainer>
          </template>
          <template #tab-1>
            <VocabList :vocab="vocab" />
          </template>
        </TabContainer>
        <p v-else class="loading">Loading lyrics...</p>
      </div>
    </div>
    <div v-else>
      <!-- LoadingSpinner -->
      <LoadingSpinner message="Loading song details..."/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { fetchSongById, fetchLyricsById } from '../services/songService';
import { SongInfo } from '../models/SongInfo';
import { SongLyric } from '../models/SongLyric';

import LoadingSpinner from '@/components/widgets/LoadingSpinner.vue';
const StickyVideo = defineAsyncComponent(() =>
  import('../components/StickyVideo.vue')
);
const ScrollableContainer = defineAsyncComponent(() =>
  import('../components/ScrollableContainer.vue')
);
const ToggleWidget = defineAsyncComponent(() =>
  import('../components/widgets/ToggleWidget.vue')
);
const TabContainer = defineAsyncComponent(() =>
  import('../components/TabContainer.vue')
);
const VocabList = defineAsyncComponent(() =>
  import('../components/VocabList.vue')
);

export default defineComponent({
  components: {
    StickyVideo,
    ScrollableContainer,
    ToggleWidget,
    LoadingSpinner,
    TabContainer,
    VocabList,
  },
  data() {
    return {
      song: null as SongInfo | null,
      lyrics: null as SongLyric[] | null,
      vocab: null as string[] | null,
      engLyricsIdx: 0,
      fontSizeIdx: 1,
      textAlignIdx: 0,
      alignmentOptions: [
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h480v80H120Z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M240-240v-80h480v80H240Zm-120-200v-80h720v80H120Zm120-200v-80h480v80H240Zm-120-200v-80h720v80H120Z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm240-200v-80h480v80H360Zm-240-200v-80h720v80H120Zm240-200v-80h480v80H360Z"/></svg>',
      ]
    };
  },
  computed: {
    tabs() {
      const tabList = ['Lyrics'];
      if (this.vocab && this.vocab.length > 0) {
        tabList.push('Vocabulary');
      }
      return tabList;
    },
    fontSizeClass(): Record<string, boolean> {
      return {
        fontSmall: this.fontSizeIdx == 0,
        fontMedium: this.fontSizeIdx == 1,
        fontLarge: this.fontSizeIdx == 2,
      };
    },
    textAlignClass(): Record<string, boolean> {
      return {
        'align-left': this.textAlignIdx === 0,
        'align-center': this.textAlignIdx === 1,
        'align-right': this.textAlignIdx === 2,
      };
    },
  },
  methods: {
    async fetchData() {
      try {
        const songId = this.$route.params.id as string;
        const language = this.$route.params.language as string;
        console.log(`Fetching data for songId: ${songId}, language: ${language}`);

        const fetchedSong = await fetchSongById(songId);
        if (fetchedSong) {
          this.song = fetchedSong;
          console.log('Successfully fetched song info:', this.song);

          const lyricsAndVocab = await fetchLyricsById(songId, language);
          console.log('Fetched lyrics and vocab data:', lyricsAndVocab);

          if (lyricsAndVocab) {
            this.lyrics = lyricsAndVocab.lyrics;
            this.vocab = lyricsAndVocab.vocab;
            console.log('Lyrics data set:', this.lyrics);
            console.log('Vocab data set:', this.vocab);
          } else {
            console.log('lyricsAndVocab is null or undefined');
          }
        } else {
            console.log('fetchedSong is null or undefined');
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    },
  },
  created() {
    this.fetchData();
  },
});
</script>

<style scoped>
.song-details-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.song-details-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.container-padding {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  /* Adjust the value to control space */
  font-size: 16px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-button:active {
  background-color: #d0d0d0;
}

.widget-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.widget-wrap {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}

h2 {
  margin-bottom: 16px;
  font-size: 1.5rem;
  color: #333;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fontSmall {
  font-size: 0.8rem;
  line-height: 1.2;
}

.fontMedium {
  font-size: 1rem;
  line-height: 1.3;
}

.fontLarge {
  font-size: 1.2rem;
  line-height: 1.4;
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

.fontSmall .text {
  font-size: 1em;
}

.fontMedium .text {
  font-size: 1.2em;
}

.fontLarge .text {
  font-size: 1.4em;
}

.align-left {
  text-align: left;
}
.align-center {
  text-align: center;
}
.align-right {
  text-align: right;
}

/* This will align the chinese characters */
.align-left .chinese-line {
  justify-content: flex-start;
}
.align-center .chinese-line {
  justify-content: center;
}
.align-right .chinese-line {
  justify-content: flex-end;
}
</style>
