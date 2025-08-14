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
          </div>
        </div>

        <!-- Scrollable Lyrics -->
        <ScrollableContainer :maxHeight="'calc(100vh - 300px)'">
          <h2 v-once>Lyrics</h2>
          <div v-if="lyrics">
            <div v-for="(line, index) in lyrics" :key="index" :class="fontSizeClass">
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
              <br />
            </div>
          </div>
          <p v-else class="loading">Loading lyrics...</p>
        </ScrollableContainer>
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

export default defineComponent({
  components: {
    StickyVideo,
    ScrollableContainer,
    ToggleWidget,
    LoadingSpinner,
  },
  data() {
    return {
      song: null as SongInfo | null,
      lyrics: null as SongLyric[] | null,
      engLyricsIdx: 0,
      fontSizeIdx: 1,
    };
  },
  computed: {
    fontSizeClass(): Record<string, boolean> {
      return {
        fontSmall: this.fontSizeIdx == 0,
        fontMedium: this.fontSizeIdx == 1,
        fontLarge: this.fontSizeIdx == 2,
      };
    },
  },
  methods: {
    async fetchData() {
      try {
        const songId = this.$route.params.id as string;
        const language = this.$route.params.language as string;
        const fetchedSong = await fetchSongById(songId);
        if (fetchedSong) {
          this.song = fetchedSong;
          this.lyrics = await fetchLyricsById(songId, language);
        }
      } catch (error) {
        console.error('Error loading song details:', error);
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
  margin-bottom: 20px;
}

.widget-wrap {
  display: flex;
  gap: 15px;
  max-width: 600px;
  width: 100%;
  justify-content: space-between;
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
  line-height: 1.4;
}

.fontMedium {
  font-size: 1rem;
  line-height: 1.5;
}

.fontLarge {
  font-size: 1.2rem;
  line-height: 1.6;
}

.line-container {
  margin: 1em 0;
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
</style>
