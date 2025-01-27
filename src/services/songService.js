import { SongLyric } from '../models/SongLyric';

export async function fetchSongs() {
  try {
    const response = await fetch('/utatomo/data/songs.json');
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function getYouTubeThumbnail(youtubeUrl) {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0]; // Extract the video ID
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  return `https://i3.ytimg.com/vi/${videoId}/default.jpg`;
}

export const fetchSongById = async (songId) => {
  console.log(`Fetching song with ID: ${songId}`); // Debug log
  const songs = await fetchSongs();
  console.log('Fetched songs:', songs); // Debug log
  const song = songs.find((s) => s.id === songId);
  console.log('Found song:', song); // Debug log
  return song;
};

export const fetchLyricsById = async (songId) => {
  try {
    const response = await fetch(`/utatomo/data/lyrics/${songId}.json`);
    if (!response.ok) {
      throw new Error(`Lyrics not found for ID: ${songId}`);
    }
    const data = await response.json();
    console.log(`Fetched lyrics for ID ${songId}:`, data);

    // Transform each line into a SongLyric object
    return data.lyrics.map(
      (line) => new SongLyric(line.ChnStr || '', line.EngStr || '')
    );
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};