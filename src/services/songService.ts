import { SongLyric, SongLyricsChinese, SongLyricsJapanese } from '../models/SongLyric';
import { SongInfo } from '../models/SongInfo';

export async function fetchSongInfos(): Promise<SongInfo[]> {
  try {
    const baseUrl = import.meta.env.DEV ? '' : '/utatomo';
    console.log('Fetching songs from:', `${baseUrl}/data/songInfos.json`);
    const response = await fetch(`${baseUrl}/data/songInfos.json`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetched songs:', data);
    return data.map((s: any) => new SongInfo(s));
  } catch (error) {
    console.error('Error in fetchSongs:', error);
    return [];
  }
}

export const fetchSongById = async (songId: string): Promise<SongInfo | undefined> => {
  console.log(`Fetching song with ID: ${songId}`); // Debug log
  const songs = await fetchSongInfos();
  console.log('Fetched songs:', songs); // Debug log
  const song = songs.find((s) => s.id === songId);
  console.log('Found song:', song); // Debug log
  return song;
};

export const fetchLyricsById = async (songId: string, language: string): Promise<SongLyric[] | null> => {
  try {
    const baseUrl = import.meta.env.DEV ? '' : '/utatomo';
    const response = await fetch(`${baseUrl}/data/lyrics/${language}/${songId}.json`);
    if (!response.ok) {
      throw new Error(`Lyrics not found for ID: ${songId}`);
    }
    const data = await response.json();
    console.log(`Fetched lyrics for ID ${songId}:`, data);


    if (language === 'chinese')
      return data.lyrics.map((line: any) => new SongLyricsChinese(line));
    else if(language === 'japanese') 
      return data.lyrics.map((line: any) => new SongLyricsJapanese(line)); 
    else
      return data.lyrics.map((line: any) => new SongLyric(line));
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};