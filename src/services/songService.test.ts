import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { fetchSongInfos, fetchSongById, fetchLyricsById } from './songService';
import { SongInfo } from '../models/SongInfo';
import { SongLyric, SongLyricsChinese, SongLyricsJapanese } from '../models/SongLyric';

// Mocking the global fetch function
global.fetch = vi.fn();

// Mock models
vi.mock('../models/SongInfo', () => {
  const SongInfo = vi.fn();
  return { SongInfo };
});
vi.mock('../models/SongLyric', () => {
  const SongLyric = vi.fn();
  const SongLyricsChinese = vi.fn();
  const SongLyricsJapanese = vi.fn();
  return { SongLyric, SongLyricsChinese, SongLyricsJapanese };
});

describe('songService', () => {
  const mockSongData = [
    { id: '1', title: 'Song 1', artist: 'Artist 1' },
    { id: '2', title: 'Song 2', artist: 'Artist 2' },
  ];
  const mockLyricsData = {
    lyrics: [{ original: 'lyric line' }],
    ListVocab: ['vocab1', 'vocab2'],
  };

  beforeEach(() => {
    vi.mocked(SongInfo).mockImplementation(data => ({ ...data }));
    vi.mocked(SongLyric).mockImplementation(data => ({ ...data }));
    vi.mocked(SongLyricsChinese).mockImplementation(data => ({ ...data }));
    vi.mocked(SongLyricsJapanese).mockImplementation(data => ({ ...data }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchSongInfos', () => {
    it('should fetch and return song infos', async () => {
      const mockResponse = { ok: true, json: async () => mockSongData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const songs = await fetchSongInfos();
      expect(fetch).toHaveBeenCalledWith('/data/songInfos.json');
      expect(songs).toHaveLength(2);
      expect(SongInfo).toHaveBeenCalledTimes(2);
      expect(songs[0]).toEqual(expect.objectContaining({ id: '1' }));
    });

    it('should return an empty array if the fetch fails', async () => {
      const mockResponse = { ok: false, statusText: 'Not Found' };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const songs = await fetchSongInfos();
      expect(songs).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('fetchSongById', () => {
    it('should return a song by id if found', async () => {
      const mockResponse = { ok: true, json: async () => mockSongData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const song = await fetchSongById('1');
      expect(fetch).toHaveBeenCalledWith('/data/songInfos.json');
      expect(song).toEqual(expect.objectContaining({ id: '1' }));
    });

    it('should return undefined if song not found', async () => {
      const mockResponse = { ok: true, json: async () => mockSongData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const song = await fetchSongById('3');
      expect(song).toBeUndefined();
    });

    it('should return undefined if fetch fails', async () => {
      const mockResponse = { ok: false };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const song = await fetchSongById('1');
      expect(song).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('fetchLyricsById', () => {
    it('should fetch and return lyrics and vocab for chinese', async () => {
      const mockResponse = { ok: true, json: async () => mockLyricsData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const result = await fetchLyricsById('1', 'chinese');
      expect(fetch).toHaveBeenCalledWith('/data/lyrics/chinese/1.json');
      expect(SongLyricsChinese).toHaveBeenCalledTimes(1);
      expect(result?.lyrics).toHaveLength(1);
      expect(result?.vocab).toHaveLength(2);
    });

    it('should fetch and return lyrics and vocab for japanese', async () => {
      const mockResponse = { ok: true, json: async () => mockLyricsData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const result = await fetchLyricsById('1', 'japanese');
      expect(fetch).toHaveBeenCalledWith('/data/lyrics/japanese/1.json');
      expect(SongLyricsJapanese).toHaveBeenCalledTimes(1);
      expect(result?.lyrics).toHaveLength(1);
      expect(result?.vocab).toHaveLength(2);
    });

    it('should use default lyric model for other languages', async () => {
      const mockResponse = { ok: true, json: async () => mockLyricsData };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const result = await fetchLyricsById('1', 'english');
      expect(fetch).toHaveBeenCalledWith('/data/lyrics/english/1.json');
      expect(SongLyric).toHaveBeenCalledTimes(1);
      expect(result?.lyrics).toHaveLength(1);
    });

    it('should return null if the fetch fails', async () => {
      const mockResponse = { ok: false };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await fetchLyricsById('1', 'chinese');
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
