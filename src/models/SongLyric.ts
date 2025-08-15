interface SongLyricData {
  ChnStr: string;
  EngStr: string;
  JpnStr: string;
  Pinyin: string;
}

interface AnnotatedText {
  text: string;
  ruby: string;
}

export class SongLyric {
  ChnStr: string;
  EngStr: string;
  JpnStr: string;
  Pinyin: string;

  constructor(data: Partial<SongLyricData> = {}) {
    this.ChnStr = data.ChnStr || '';
    this.EngStr = data.EngStr || '';
    this.JpnStr = data.JpnStr || '';
    this.Pinyin = data.Pinyin || '';
  }

  getAnnotatedText(): AnnotatedText[] {
    if (!this.Pinyin) return [];
    const result: AnnotatedText[] = [];
    let plainText = '';

    const isHanzi = (char: string) => /[\u4e00-\u9fff]/.test(char);

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

export class SongLyricsChinese extends SongLyric {
  constructor(data: Partial<SongLyricData> = {}) {
    super(data);
    this.ChnStr = data.ChnStr || '';
    this.Pinyin = data.Pinyin || '';
  }

  getAnnotatedText(): AnnotatedText[] {
    if (!this.Pinyin) return [];
    const result: AnnotatedText[] = [];
    let plainText = '';

    const isHanzi = (char: string) => /[\u4e00-\u9fff]/.test(char);

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

export class SongLyricsJapanese extends SongLyric {
  constructor(data: Partial<SongLyricData> = {}) {
    super(data);
    this.JpnStr = data.JpnStr || '';
  }

  getAnnotatedText(): AnnotatedText[] {
    if (!this.JpnStr) {
      return [];
    }

    const result: AnnotatedText[] = [];
    let plainText = '';

    const isKanji = (char: string) => (char === 'ヶ' || char === '々' || /[\u4E00-\u9FAF]/.test(char));
    const str = this.JpnStr;

    for (let i = 0; i < str.length; i++) {
      // Find the start of a potential Kanji segment
      if (isKanji(str[i])) {
        // First, push any preceding plain text
        if (plainText) {
          result.push({ text: plainText, ruby: '' });
          plainText = '';
        }

        // Find the end of the continuous Kanji segment
        let kanjiSegmentEnd = i;
        while (kanjiSegmentEnd < str.length && isKanji(str[kanjiSegmentEnd])) {
          kanjiSegmentEnd++;
        }
        const kanjiSegment = str.slice(i, kanjiSegmentEnd);

        // Check if this segment is immediately followed by a bracketed furigana
        if (str[kanjiSegmentEnd] === '[') {
          const closeBracketIndex = str.indexOf(']', kanjiSegmentEnd);
          if (closeBracketIndex !== -1) {
            const ruby = str.slice(kanjiSegmentEnd + 1, closeBracketIndex);
            result.push({ text: kanjiSegment, ruby });
            i = closeBracketIndex; // Move the index past the furigana
            continue;
          }
        }

        // If no furigana was found for the segment, treat it as plain text.
        result.push({ text: kanjiSegment, ruby: '' });
        i = kanjiSegmentEnd - 1; // The loop will increment it one more time
      } else {
        // If it's not a Kanji, accumulate it as plain text
        if (str[i] !== '[' && str[i] !== ']') {
          plainText += str[i];
        }
      }
    }

    // Push any remaining plain text at the end
    if (plainText) {
      result.push({ text: plainText, ruby: '' });
    }

    return result;
  }

  isEmpty() {
    return !this.JpnStr.trim() && !this.EngStr.trim();
  }
}
