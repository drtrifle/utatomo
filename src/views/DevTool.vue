<template>
  <div class="container">
    <h1>Bake Pinyin into Lyrics</h1>

    <!-- File Upload -->
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" accept=".json" />
    </div>

    <!-- Bake Button -->
    <button @click="bakePinyin" class="btn">Bake Pinyin</button>

    <!-- Processed Output -->
    <div v-if="jsonOutput" class="output-section">
      <h2>Processed Lyrics</h2>
      <textarea v-model="jsonOutput" rows="10" readonly class="output"></textarea>
      <button @click="exportJSON" class="btn export">Export JSON</button>
    </div>
  </div>
</template>

<script>
// Import the pinyin library using ES module import
import pinyin from "pinyin";

export default {
  name: 'DevTool',
  data() {
    return {
      // Original JSON data loaded from a file
      lyricsData: null,
      // String version of the processed JSON
      jsonOutput: "",
      // Store the original file name
      fileName: "baked_lyrics.json"
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.fileName = file.name; // Save the original file name
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.lyricsData = JSON.parse(e.target.result);
          this.jsonOutput = ""; // Clear previous output
        } catch (err) {
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    },
    bakePinyin() {
      if (!this.lyricsData || !this.lyricsData.lyrics) {
        alert("Please load a valid lyrics JSON file first.");
        return;
      }
      // Helper function to determine if a character is Chinese.
      const isChinese = (char) => /[\u4e00-\u9fff]/.test(char);

      // Segment a string into an array of Chinese and non-Chinese segments
      const segmentString = (str) => {
        const segments = [];
        let currentSegment = '';
        let isCurrentChinese = false;

        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          const isCurrCharChinese = isChinese(char);

          if (i === 0) {
            currentSegment = char;
            isCurrentChinese = isCurrCharChinese;
            continue;
          }

          if (isCurrCharChinese === isCurrentChinese) {
            currentSegment += char;
          } else {
            segments.push({
              text: currentSegment,
              isChinese: isCurrentChinese
            });
            currentSegment = char;
            isCurrentChinese = isCurrCharChinese;
          }
        }

        if (currentSegment) {
          segments.push({
            text: currentSegment,
            isChinese: isCurrentChinese
          });
        }

        return segments;
      };

      // Process each lyric line to build the new format.
      const processedLyrics = this.lyricsData.lyrics.map((line) => {
        if (!line.ChnStr || !line.ChnStr.trim()) {
          return line;
        }

        // Segment the Chinese string
        const segments = segmentString(line.ChnStr);
        let bakedPinyin = '';
        let pinyinIndex = 0;

        // Process each segment
        segments.forEach(segment => {
          if (segment.isChinese) {
            // Get pinyin for Chinese segment
            const segmentPinyin = pinyin(segment.text, {
              style: pinyin.STYLE_TONE,
              segment: false,
            });

            // Add each character with its pinyin
            for (let i = 0; i < segment.text.length; i++) {
              const char = segment.text[i];
              const py = segmentPinyin[i] ? segmentPinyin[i][0] : '';
              bakedPinyin += char + (py ? `[${py}]` : '');
            }
          } else {
            // Non-Chinese segment, just add as is
            bakedPinyin += segment.text;
          }
        });

        return {
          ChnStr: line.ChnStr,
          Pinyin: bakedPinyin,
          EngStr: line.EngStr || ""
        };
      });

      // Build the output JSON object with the new format.
      const outputObj = { lyrics: processedLyrics };
      this.jsonOutput = JSON.stringify(outputObj, null, 2);
    },
    exportJSON() {
      if (!this.jsonOutput) return;
      // Use the original file name for export.
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.jsonOutput);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", this.fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.upload-section {
  margin-bottom: 20px;
}

.btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn:hover {
  background-color: #0056b3;
}

.export {
  background-color: #28a745;
}

.export:hover {
  background-color: #218838;
}

.output-section {
  margin-top: 20px;
}

.output {
  width: 100%;
  padding: 10px;
  font-family: monospace;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}
</style>
