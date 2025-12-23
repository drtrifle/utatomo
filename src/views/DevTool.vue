<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h4">Bake Pinyin into Lyrics</v-card-title>
      <v-card-text>
        <v-file-input
          label="Drop JSON file here or click to upload"
          @change="handleFileUpload"
          accept=".json"
          prepend-icon="mdi-paperclip"
        ></v-file-input>

        <div v-if="lyricsData" class="mt-4">
          <v-card outlined>
            <v-card-title>Original Lyrics</v-card-title>
            <v-card-text class="preview-content">
              <div v-for="(line, index) in lyricsData.lyrics" :key="index" class="preview-line">
                <div class="chinese">{{ line.ChnStr }}</div>
                <div class="english">{{ line.EngStr }}</div>
              </div>
            </v-card-text>
          </v-card>

          <div class="text-center my-4">
            <v-btn @click="bakePinyin" color="primary" :loading="isProcessing">
              {{ isProcessing ? 'Processing...' : 'Bake Pinyin' }}
            </v-btn>
          </div>

          <div v-if="jsonOutput">
            <div class="d-flex justify-space-between align-center mb-2">
              <h3 class="text-h6">Processed Output</h3>
              <v-btn @click="exportJSON" color="success" :disabled="isProcessing">
                Export JSON
              </v-btn>
            </div>
            <v-textarea
              v-model="jsonOutput"
              rows="10"
              readonly
              :disabled="isProcessing"
            ></v-textarea>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import pinyin from "pinyin";

interface LyricLine {
  ChnStr: string;
  EngStr: string;
  Pinyin?: string;
}

interface LyricsData {
  lyrics: LyricLine[];
}

const lyricsData = ref<LyricsData | null>(null);
const jsonOutput = ref("");
const fileName = ref("baked_lyrics.json");
const isProcessing = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      if (e.target?.result) {
        lyricsData.value = JSON.parse(e.target.result as string);
        jsonOutput.value = "";
      }
    } catch (_err) {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
};

const bakePinyin = () => {
  if (!lyricsData.value || !lyricsData.value.lyrics) {
    alert("Please load a valid lyrics JSON file first.");
    return;
  }
  const isChinese = (char: string) => /[\u4e00-\u9fff]/.test(char);

  const segmentString = (str: string) => {
    const segments: { text: string, isChinese: boolean }[] = [];
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

  isProcessing.value = true;

  const processedLyrics = lyricsData.value.lyrics.map((line) => {
    if (!line.ChnStr || !line.ChnStr.trim()) {
      return line;
    }

    const segments = segmentString(line.ChnStr);
    let bakedPinyin = '';

    segments.forEach(segment => {
      if (segment.isChinese) {
        const segmentPinyin = pinyin(segment.text, {
          style: pinyin.STYLE_TONE,
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
  jsonOutput.value = JSON.stringify(outputObj, null, 2);

  isProcessing.value = false;
};

const exportJSON = () => {
  if (!jsonOutput.value) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonOutput.value);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", fileName.value);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
};
</script>

<style scoped>
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
</style>