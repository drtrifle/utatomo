export class SongInfo {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.artist = data.artist || '';
    this.youtubeUrl = data.youtubeUrl || '';
    this.duration = data.duration || '';
    this.language = data.language || '';
  }

  getThumbnailUrl() {
    const videoId = this.youtubeUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) {
        throw new Error('Invalid YouTube URL');
    }
    return `https://i3.ytimg.com/vi/${videoId}/default.jpg`;
  }
}
