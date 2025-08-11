<template>
  <div class="container">
    <h1>Bake Pinyin into Lyrics</h1>

    <!-- File Upload Zone -->
    <div class="upload-zone" 
         @dragover.prevent 
         @drop.prevent="handleFileDrop"
         :class="{ 'dragging': isDragging }">
      <input type="file" 
             @change="handleFileUpload" 
             accept=".json"
             id="fileInput"
             class="file-input" />
      <label for="fileInput" class="upload-label">
        <div class="upload-icon">📁</div>
        <span>Drop JSON file here or click to upload</span>
      </label>
    </div>

    <div class="content-wrapper" v-if="lyricsData">
      <!-- Preview Panel -->
      <div class="preview-panel">
        <h3>Original Lyrics</h3>
        <div class="preview-content">
          <div v-for="(line, index) in lyricsData.lyrics" 
               :key="index" 
               class="preview-line">
            <div class="chinese">{{ line.ChnStr }}</div>
            <div class="english">{{ line.EngStr }}</div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="bakePinyin" 
                class="btn primary"
                :disabled="isProcessing">
          {{ isProcessing ? 'Processing...' : 'Bake Pinyin' }}
        </button>
      </div>

      <!-- Output Section -->
      <div v-if="jsonOutput" class="output-section">
        <div class="output-header">
          <h3>Processed Output</h3>
          <button @click="exportJSON" 
                  class="btn export"
                  :disabled="isProcessing">
            Export JSON
          </button>
        </div>
        <textarea v-model="jsonOutput" 
                  rows="10" 
                  readonly 
                  class="output"
                  :disabled="isProcessing">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script>
import pinyin from "pinyin";

export default {
  name: 'DevTool',
  data() {
    return {
      lyricsData: null,
      jsonOutput: "",
      fileName: "baked_lyrics.json",
      isDragging: false,
      isProcessing: false
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.lyricsData = JSON.parse(e.target.result);
          this.jsonOutput = "";
        } catch (err) {
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    },
    handleFileDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/json') {
        this.handleFileUpload({ target: { files: [file] } });
      }
    },
    bakePinyin() {
      if (!this.lyricsData || !this.lyricsData.lyrics) {
        alert("Please load a valid lyrics JSON file first.");
        return;
      }
      const isChinese = (char) => /[\u4e00-\u9fff]/.test(char);

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

      this.isProcessing = true;

      const processedLyrics = this.lyricsData.lyrics.map((line) => {
        if (!line.ChnStr || !line.ChnStr.trim()) {
          return line;
        }

        const segments = segmentString(line.ChnStr);
        let bakedPinyin = '';

        segments.forEach(segment => {
          if (segment.isChinese) {
            const segmentPinyin = pinyin(segment.text, {
              style: pinyin.STYLE_TONE,
              segment: false,
            });

            for (let i = 0; i < segment.text.length; i++) {
              const char = segment.text[i];
              const py = segmentPinyin[i] ? segmentPinyin[i][0] : '';
              bakedPinyin += char + (py ? `[${py}]` : '');
            }
          } else {
            bakedPinyin += segment.text;
          }
        });

        return {
          ChnStr: line.ChnStr,
          Pinyin: bakedPinyin,
          EngStr: line.EngStr || ""
        };
      });

      const outputObj = { lyrics: processedLyrics };
      this.jsonOutput = JSON.stringify(outputObj, null, 2);

      this.isProcessing = false;
    },
    exportJSON() {
      if (!this.jsonOutput) return;
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

.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.upload-zone.dragging {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.file-input {
  display: none;
}

.upload-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 48px;
  color: #666;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.preview-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.preview-content {
  max-height: 300px;
  overflow-y: auto;
}

.preview-line {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.chinese {
  font-size: 1.1em;
  margin-bottom: 4px;
}

.english {
  font-size: 0.9em;
  color: #666;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background-color: #007bff;
}

.btn.primary:hover:not(:disabled) {
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

@media (min-width: 768px) {
  .container {
    max-width: 800px;
  }
}
</style>
