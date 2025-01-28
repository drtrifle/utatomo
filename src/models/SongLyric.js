import pinyin from 'pinyin';

export class SongLyric {
  constructor(chnStr = '', engStr = '') {
    this.ChnStr = chnStr;
    this.EngStr = engStr;
  }

  getPinyin() {
    if (!this.ChnStr.trim()) return '';
    return pinyin(this.ChnStr).join(' '); // Generate Pinyin with tone numbers
  }

  isEmpty() {
    return !this.ChnStr.trim() && !this.EngStr.trim();
  }
}
