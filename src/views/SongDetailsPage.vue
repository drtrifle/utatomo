<template>
  <div class="song-details-page">
    <button @click="$router.push('/songs')" class="back-button">← Back to Songs</button>

    <div v-if="song" class="song-details-container">
      <!-- Sticky Video -->
      <StickyVideo :youtubeUrl="song.youtubeUrl" />

      <!-- Widget Container -->
      <div class="widget-container">
        <ToggleWidget header="English Lyrics" :options="['On', 'Off']" v-model="engLyricsIdx" />
        <ToggleWidget header="Font Size" :options="['S', 'M', 'L']" v-model="fontSizeIdx" />
      </div>

      <!-- Scrollable Lyrics -->
      <ScrollableContainer :maxHeight="'calc(100vh - 300px)'">
        <h2 v-once>Lyrics</h2>
        <div v-if="lyrics">
          <div v-for="(line, index) in lyrics" :key="index" :class="fontSizeClass">
            <div v-if="!line.isEmpty()">
              <div class="line-container">
                <div class="chinese-line">
                  <template v-for="(char, idx) in parsePinyin(line.getPinyin())" :key="idx">
                    <div class="char-container">
                      <span class="pinyin">{{ char.pinyin }}</span>
                      <span class="hanzi">{{ char.hanzi }}</span>
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
    <div v-else>
      <!-- LoadingSpinner -->
      <LoadingSpinner message="Loading song details..."/>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { fetchSongById, fetchLyricsById } from '../services/songService';

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

export default {
  components: {
    StickyVideo,
    ScrollableContainer,
    ToggleWidget,
    LoadingSpinner,
  },
  data() {
    return {
      song: null,
      lyrics: null,
      engLyricsIdx: 0,
      fontSizeIdx: 1,
    };
  },
  computed: {
    fontSizeClass() {
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
        const songId = this.$route.params.id;
        this.song = await fetchSongById(songId);
        if (this.song) {
          this.lyrics = await fetchLyricsById(songId);
        }
      } catch (error) {
        console.error('Error loading song details:', error);
      }
    },
    parsePinyin(pinyinStr) {
      if (!pinyinStr) return [];
      const result = [];
      let tempStr = '';

      const isChineseChar = (char) => /[\u4e00-\u9fff]/.test(char);
      
      for (let i = 0; i < pinyinStr.length; i++) {
        const char = pinyinStr[i];
        
        if (isChineseChar(char)) {
          // If we have accumulated non-Chinese text, push it
          if (tempStr) {
            result.push({ hanzi: tempStr, pinyin: '' });
            tempStr = '';
          }
          
          // Find the pinyin annotation for this character
          const nextBracket = pinyinStr.indexOf('[', i);
          if (nextBracket === i + 1) { // Make sure bracket immediately follows the character
            const closeBracketIndex = pinyinStr.indexOf(']', nextBracket);
            if (closeBracketIndex !== -1) {
              const pinyin = pinyinStr.slice(nextBracket + 1, closeBracketIndex);
              result.push({ hanzi: char, pinyin });
              i = closeBracketIndex; // Skip to end of pinyin bracket
              continue;
            }
          }
          
          // If no pinyin annotation found, just add the character
          result.push({ hanzi: char, pinyin: '' });
        } else if (char !== '[' && char !== ']') {
          // Accumulate non-Chinese characters
          tempStr += char;
        }
      }
      
      // Push any remaining non-Chinese text
      if (tempStr) {
        result.push({ hanzi: tempStr, pinyin: '' });
      }
      
      return result;
    },
  },
  created() {
    this.fetchData();
  },
};
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
  gap: 15px;
  justify-content: space-between;
  margin-bottom: 20px;
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

.pinyin {
  font-size: 0.7em;
  color: #666;
  height: 1.2em;
  text-align: center;
}

.hanzi {
  font-size: 1.2em;
}

/* Update existing font size classes to affect the hanzi size */
.fontSmall .hanzi {
  font-size: 1em;
}

.fontMedium .hanzi {
  font-size: 1.2em;
}

.fontLarge .hanzi {
  font-size: 1.4em;
}
</style>
