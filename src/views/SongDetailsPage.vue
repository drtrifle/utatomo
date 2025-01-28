<template>
  <div class="song-details-page">
    <button @click="$router.push('/songs')" class="back-button">← Back to Songs</button>

    <div v-if="song" class="song-details-container">
      <!-- Sticky Video -->
      <StickyVideo :youtubeUrl="song.youtubeUrl" />

      <!-- Widget Container -->
      <div class="widget-container">
        <ToggleWidget 
          header="English Lyrics" 
          :options="['On', 'Off']" 
          v-model="engLyricsIdx" 
        />
        <ToggleWidget 
          header="Font Size" 
          :options="['S', 'M', 'L']" 
          v-model="fontSizeIdx" 
        />
      </div>

      <!-- Scrollable Lyrics -->
      <ScrollableContainer :maxHeight="'calc(100vh - 300px)'">
        <h2>Lyrics</h2>
        <div v-if="lyrics">
          <p 
            v-for="(line, index) in lyrics" 
            :key="index" 
            :class="fontSizeClass"
          >
            <span v-if="!line.isEmpty()">
              {{ line.ChnStr }}
              <br v-if="line.EngStr && engLyricsIdx == 0" />
              <small v-if="line.EngStr && engLyricsIdx == 0">{{ line.EngStr }}</small>
            </span>
            <span v-else>&nbsp;</span>
          </p>
        </div>
        <p v-else class="loading">Loading lyrics...</p>
      </ScrollableContainer>
    </div>
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script>
import { fetchSongById, fetchLyricsById } from '../services/songService';
import StickyVideo from '../components/StickyVideo.vue';
import ScrollableContainer from '../components/ScrollableContainer.vue';
import ToggleWidget from '../components/ToggleWidget.vue';

export default {
  components: {
    StickyVideo,
    ScrollableContainer,
    ToggleWidget,
  },
  data() {
    return {
      song: null,
      lyrics: null,
      engLyricsIdx :0,
      fontSizeIdx: 1, // Controls the selected option in the ToggleWidget
    };
  },
  computed: {
    fontSizeClass() {
      return {
        small: this.fontSizeIdx === 0,
        medium: this.fontSizeIdx === 1,
        large: this.fontSizeIdx === 2,
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
  margin-bottom: 20px; /* Adjust the value to control space */
  font-size: 16px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

p {
  margin: 0 0 10px;
  white-space: pre-wrap; /* Preserve formatting */
}

p.small {
  font-size: 0.8rem;
}

p.medium {
  font-size: 1rem;
}

p.large {
  font-size: 1.2rem;
}

/* Responsive font sizes */
@media (max-width: 768px) {
  p.small {
    font-size: 0.7rem;
  }

  p.medium {
    font-size: 0.9rem;
  }

  p.large {
    font-size: 1.1rem;
  }
}
</style>
