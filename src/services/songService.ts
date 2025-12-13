import { SongLyric, SongLyricsChinese, SongLyricsJapanese } from '../models/SongLyric';
import { SongInfo } from '../models/SongInfo';

const baseUrl = import.meta.env.DEV ? '' : '/utatomo';

export async function fetchSongInfos(): Promise<SongInfo[]> {
  try {
    const response = await fetch(`${baseUrl}/data/songInfos.json`);
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((s: any) => new SongInfo(s));
  } catch (error) {
    console.error('Error in fetchSongs:', error);
    return [];
  }
}

export const fetchSongById = async (songId: string): Promise<SongInfo | undefined> => {
  const songs = await fetchSongInfos();
  const song = songs.find((s) => s.id === songId);
  return song;
};

export const fetchLyricsById = async (songId: string, language: string): Promise<{ lyrics: SongLyric[], vocab: string[] } | null> => {
  try {
    const response = await fetch(`${baseUrl}/data/lyrics/${language.toLowerCase()}/${songId}.json`);
    if (!response.ok) {
      throw new Error(`Lyrics not found for ID: ${songId}`);
    }
    const data = await response.json();

    let lyrics: SongLyric[];
    if (language === 'chinese') {
      lyrics = data.lyrics.map((line: any) => new SongLyricsChinese(line));
    } else if(language === 'japanese') {
      lyrics = data.lyrics.map((line: any) => new SongLyricsJapanese(line));
    } else {
      lyrics = data.lyrics.map((line: any) => new SongLyric(line));
    }

    const vocab = data.ListVocab || [];

    return { lyrics, vocab };
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};
