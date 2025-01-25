<template>
  <div class="song-details-page">
    <button @click="$router.push('/songs')" class="back-button">← Back to Songs</button>

    <div v-if="song" class="song-details-container">
      <!-- Use the StickyVideo component -->
      <StickyVideo :youtubeUrl="song.youtubeUrl" />

      <!-- Use the ScrollableContainer component -->
      <ScrollableContainer :maxHeight="'calc(100vh - 300px)'">
        <h2>Lyrics</h2>
        <div v-if="lyrics">
          <p v-for="(line, index) in lyrics" :key="index">
            {{ line.trim() === '' ? '\u00A0' : line }}
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

export default {
  components: {
    StickyVideo,
    ScrollableContainer,
  },
  data() {
    return {
      song: null,
      lyrics: null,
    };
  },
  async created() {
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
</style>
