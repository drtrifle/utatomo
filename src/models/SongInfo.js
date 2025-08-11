export class SongInfo {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.artist = data.artist || '';
    this.youtubeUrl = data.youtubeUrl || '';
    this.duration = data.duration || '';
  }

  getThumbnailUrl() {
    const videoId = this.youtubeUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      return 'https://placehold.co/120x90?text=No+Image';
    }
    return `https://i3.ytimg.com/vi/${videoId}/default.jpg`;
  }
}
