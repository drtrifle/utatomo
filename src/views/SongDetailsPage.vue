<template>
    <div>
      <div v-if="song" class="song-details-container">
        <div class="video-container">
          <iframe
            :src="`https://www.youtube.com/embed/${extractYouTubeId(song.youtubeUrl)}`"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
        <div class="lyrics-container">
          <h2>Lyrics</h2>
          <p v-if="lyrics">{{ lyrics }}</p>
          <p v-else class="loading">Loading lyrics...</p>
        </div>
      </div>
      <div v-else class="loading">Loading...</div>
    </div>
  </template>
  
  <script>
  import { fetchSongById, fetchLyricsById } from '../services/songService';
  
  export default {
    data() {
      return {
        song: null,
        lyrics: null,
      };
    },
    methods: {
      extractYouTubeId(url) {
        const match = url.match(/v=([^&]+)/);
        return match ? match[1] : null;
      },
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
  .video-container {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    padding: 10px;
  }
  .lyrics-container {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(100vh - 300px);
  }
  .loading {
    text-align: center;
    font-size: 18px;
  }
  </style>
  