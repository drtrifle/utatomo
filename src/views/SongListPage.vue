<template>
  <v-container>
    <h1 class="text-h4 mb-4">Song List</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchTerm"
          label="Search by song, artist, language or tag"
          dense
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="d-flex">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Sort by"
          dense
          outlined
          class="mr-2"
        ></v-select>
        <v-btn icon @click="toggleSortOrder">
          <v-icon>{{ sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredAndSortedSongs"
      :items-per-page="-1"
      class="elevation-1"
      @click:row="goToSongDetails"
      hover
    >
      <template #[`item.title`]="{ item }">
        <div class="d-flex align-center py-2">
          <v-img
            :src="item.getThumbnailUrl()"
            alt="Thumbnail"
            class="mr-4"
            width="50"
            height="50"
            cover
          ></-img>
          <div>
            <div class="font-weight-bold">{{ item.title }}</div>
            <div class="text-caption">{{ item.artist }}</div>
          </div>
        </div>
      </template>

      <template #bottom></template>
    </v-data-table>

    <v-alert v-if="filteredAndSortedSongs.length === 0" type="info" class="mt-4">
      No results found
    </v-alert>

    <v-btn to="/" color="primary" class="mt-4">Go Back to Home</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SongInfo } from '../models/SongInfo';
import { fetchSongInfos } from '../services/songService';

const songInfos = ref<SongInfo[]>([]);
const searchTerm = ref('');
const debouncedSearchTerm = ref('');
const sortBy = ref('artist');
const sortOrder = ref('asc');
const debounceTimer = ref(-1);

const router = useRouter();

const sortOptions = [
  { title: 'Artist', value: 'artist' },
  { title: 'Title', value: 'title' },
];

import { VDataTable } from 'vuetify/components';

const headers: VDataTable['$props']['headers'] = [
  { title: '#', value: 'index', sortable: false },
  { title: 'Title', value: 'title', sortable: false },
  { title: 'Duration', value: 'duration', sortable: false, align: 'end' },
];

watch(searchTerm, (newValue: string) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = window.setTimeout(() => {
    debouncedSearchTerm.value = newValue;
  }, 300);
});

onMounted(async () => {
  songInfos.value = await fetchSongInfos();
});

const goToSongDetails = (
  _event: Event,
  { item }: { item: { raw: SongInfo } }
) => {
  const song = item.raw;
  router.push(`/songs/${song.language}/${song.id}`);
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

const filteredAndSortedSongs = computed(() => {
  let filtered = songInfos.value;

  if (debouncedSearchTerm.value) {
    const lowerCaseSearchTerm = debouncedSearchTerm.value.toLowerCase();
    filtered = songInfos.value.filter(song =>
      song.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      song.artist.toLowerCase().includes(lowerCaseSearchTerm) ||
      song.language.toLowerCase().includes(lowerCaseSearchTerm) ||
      (song.tags && song.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    let aValue = a[sortBy.value as keyof SongInfo] as string;
    let bValue = b[sortBy.value as keyof SongInfo] as string;

    if (aValue.toLowerCase() < bValue.toLowerCase()) {
      return sortOrder.value === 'asc' ? -1 : 1;
    }
    if (aValue.toLowerCase() > bValue.toLowerCase()) {
      return sortOrder.value === 'asc' ? 1 : -1;
    }

    if (sortBy.value === 'artist') {
      return a.title.localeCompare(b.title);
    } else {
      return a.artist.localeCompare(b.artist);
    }
  });

  return sorted.map((song, index) => ({
    ...song,
    index: index + 1,
  }));
});
</script>