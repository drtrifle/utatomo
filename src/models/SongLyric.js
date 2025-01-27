export class SongLyric {
  constructor(chnStr = '', engStr = '') {
    this.ChnStr = chnStr;
    this.EngStr = engStr;
  }

  isEmpty() {
    return !this.ChnStr.trim() && !this.EngStr.trim();
  }
}
