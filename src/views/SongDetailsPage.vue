<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="container mx-auto py-8">
      <Button @click="$router.push('/songs')" variant="outline" class="mb-4">← Back to Songs</Button>

      <div v-if="song" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <StickyVideo :youtubeUrl="song.youtubeUrl" />

        <div class="p-6">
          <TabContainer :tabs="tabs" v-if="lyrics">
            <template #tab-0>
              <div class="flex justify-center my-4">
                <div class="flex flex-wrap gap-4">
                  <div class="flex flex-col items-center">
                    <Label class="mb-2 text-sm font-medium">English Lyrics</Label>
                    <ToggleGroup v-model="engLyrics" type="single" variant="outline">
                      <ToggleGroupItem value="on">On</ToggleGroupItem>
                      <ToggleGroupItem value="off">Off</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div class="flex flex-col items-center">
                    <Label class="mb-2 text-sm font-medium">Font Size</Label>
                    <ToggleGroup v-model="fontSize" type="single" variant="outline">
                      <ToggleGroupItem value="sm">S</ToggleGroupItem>
                      <ToggleGroupItem value="md">M</ToggleGroupItem>
                      <ToggleGroupItem value="lg">L</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div class="flex flex-col items-center">
                    <Label class="mb-2 text-sm font-medium">Alignment</Label>
                    <ToggleGroup v-model="textAlign" type="single" variant="outline">
                      <ToggleGroupItem value="left" v-html="alignmentOptions[0]"></ToggleGroupItem>
                      <ToggleGroupItem value="center" v-html="alignmentOptions[1]"></ToggleGroupItem>
                      <ToggleGroupItem value="right" v-html="alignmentOptions[2]"></ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
              <ScrollableContainer :maxHeight="'calc(100vh - 450px)'">
                <div v-if="lyrics" :class="[fontSizeClass, textAlignClass]">
                  <div v-for="(line, index) in lyrics" :key="index">
                    <div v-if="!line.isEmpty()" class="mb-2">
                      <div class="flex flex-wrap gap-1" :class="textAlignClass">
                        <div v-for="(segment, idx) in line.getAnnotatedText()" :key="idx" class="inline-flex flex-col items-center">
                          <span class="text-xs text-muted-foreground">{{ segment.ruby }}</span>
                          <span class="text-lg">{{ segment.text }}</span>
                        </div>
                      </div>
                      <small v-if="engLyrics === 'on'" class="text-muted-foreground">{{ line.EngStr }}</small>
                    </div>
                    <div v-else>&nbsp;</div>
                  </div>
                </div>
              </ScrollableContainer>
            </template>
            <template #tab-1>
              <VocabList v-if="vocab" :vocab="vocab" :language="language" />
            </template>
          </TabContainer>
          <div v-else class="text-center p-8">
            <LoadingSpinner message="Loading lyrics..." />
          </div>
        </div>
      </div>
      <div v-else class="text-center p-8">
        <LoadingSpinner message="Loading song details..." />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { fetchSongById, fetchLyricsById } from '../services/songService';
import { SongInfo } from '../models/SongInfo';
import { SongLyric } from '../models/SongLyric';

import LoadingSpinner from '@/components/widgets/LoadingSpinner.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
const StickyVideo = defineAsyncComponent(() => import('../components/StickyVideo.vue'));
const ScrollableContainer = defineAsyncComponent(() => import('../components/ScrollableContainer.vue'));
const TabContainer = defineAsyncComponent(() => import('../components/TabContainer.vue'));
const VocabList = defineAsyncComponent(() => import('../components/VocabList.vue'));

export default defineComponent({
  components: {
    StickyVideo,
    ScrollableContainer,
    LoadingSpinner,
    TabContainer,
    VocabList,
    Button,
    Label,
    ToggleGroup,
    ToggleGroupItem,
  },
  data() {
    return {
      song: null as SongInfo | null,
      lyrics: null as SongLyric[] | null,
      vocab: null as string[] | null,
      language: '' as string,
      engLyrics: 'on',
      fontSize: 'md',
      textAlign: 'left',
      alignmentOptions: [
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Zm0-200v-80h480v80H120Z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M240-240v-80h480v80H240Zm-120-200v-80h720v80H120Zm120-200v-80h480v80H240Zm-120-200v-80h720v80H120Z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M120-240v-80h720v80H120Zm240-200v-80h480v80H360Zm-240-200v-80h720v80H120Zm240-200v-80h480v80H360Z"/></svg>',
      ]
    };
  },
  computed: {
    tabs() {
      const tabList = ['Lyrics'];
      if (this.vocab && this.vocab.length > 0) {
        tabList.push('Vocabulary');
      }
      return tabList;
    },
    fontSizeClass(): string {
      switch (this.fontSize) {
        case 'sm': return 'text-sm';
        case 'lg': return 'text-lg';
        default: return 'text-base';
      }
    },
    textAlignClass(): string {
      switch (this.textAlign) {
        case 'center': return 'justify-center text-center';
        case 'right': return 'justify-end text-right';
        default: return 'justify-start text-left';
      }
    },
  },
  methods: {
    async fetchData() {
      try {
        const songId = this.$route.params.id as string;
        this.language = this.$route.params.language as string;

        const fetchedSong = await fetchSongById(songId);
        if (fetchedSong) {
          this.song = fetchedSong;

          const lyricsAndVocab = await fetchLyricsById(songId, this.language);

          if (lyricsAndVocab) {
            this.lyrics = lyricsAndVocab.lyrics;
            this.vocab = lyricsAndVocab.vocab;
          }
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    },
  },
  created() {
    this.fetchData();
  },
});
</script>
