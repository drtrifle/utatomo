import { SongLyric } from '../models/SongLyric';
import { SongInfo } from '../models/SongInfo';

export async function fetchSongs() {
  try {
    const baseUrl = import.meta.env.DEV ? '' : '/utatomo';
    console.log('Fetching songs from:', `${baseUrl}/data/songs.json`);
    const response = await fetch(`${baseUrl}/data/songs.json`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched songs:', data);
    return data.map(s => new SongInfo(s));
  } catch (error) {
    console.error('Error in fetchSongs:', error);
    return [];
  }
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
    const baseUrl = import.meta.env.DEV ? '' : '/utatomo';
    const response = await fetch(`${baseUrl}/data/lyrics/${songId}.json`);
    if (!response.ok) {
      throw new Error(`Lyrics not found for ID: ${songId}`);
    }
    const data = await response.json();
    console.log(`Fetched lyrics for ID ${songId}:`, data);

    // Transform each line into a SongLyric object with Pinyin
    return data.lyrics.map(
      (line) => new SongLyric(line.ChnStr || '', line.EngStr || '', line.Pinyin || '')
    );
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};