export class SongLyric {
  constructor(chnStr = '', engStr = '', pinyin = '') {
    this.ChnStr = chnStr;
    this.EngStr = engStr;
    this.Pinyin = pinyin;
  }

  getPinyin() {
    return this.Pinyin || '';
  }

  isEmpty() {
    return !this.ChnStr.trim() && !this.EngStr.trim();
  }
}
