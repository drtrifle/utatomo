export class SongLyric {
  constructor(data = {}) {
    this.ChnStr = data.ChnStr || '';
    this.EngStr = data.EngStr || '';
    this.Pinyin = data.Pinyin || '';
  }

  getAnnotatedText() {
    if (!this.Pinyin) return [];
    const result = [];
    let plainText = '';

    const isHanzi = (char) => /[\u4e00-\u9fff]/.test(char);
    
    for (let i = 0; i < this.Pinyin.length; i++) {
      const char = this.Pinyin[i];
      
      if (isHanzi(char)) {
        if (plainText) {
          result.push({ text: plainText, ruby: '' });
          plainText = '';
        }
        
        const nextBracket = this.Pinyin.indexOf('[', i);
        if (nextBracket === i + 1) {
          const closeBracketIndex = this.Pinyin.indexOf(']', nextBracket);
          if (closeBracketIndex !== -1) {
            const ruby = this.Pinyin.slice(nextBracket + 1, closeBracketIndex);
            result.push({ text: char, ruby });
            i = closeBracketIndex;
            continue;
          }
        }
        
        result.push({ text: char, ruby: '' });
      } else if (char !== '[' && char !== ']') {
        plainText += char;
      }
    }
    
    if (plainText) {
      result.push({ text: plainText, ruby: '' });
    }
    
    return result;
  }

  isEmpty() {
    return !this.ChnStr.trim() && !this.EngStr.trim();
  }
}
