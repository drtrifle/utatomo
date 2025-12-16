<template>
  <div class="container mx-auto py-10">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Song List</h1>
      <div class="flex items-center space-x-2">
        <Input
          type="text"
          v-model="searchTerm"
          placeholder="Search..."
          class="w-64"
        />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              Sort by: {{ sortByText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4"><path d="m6 9 6 6 6-6"></path></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="setSortBy('artist')">Artist</DropdownMenuItem>
            <DropdownMenuItem @click="setSortBy('title')">Title</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" @click="toggleSortOrder">
          <span v-if="sortOrder === 'asc'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path></svg>
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path></svg>
          </span>
        </Button>
      </div>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-16">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead class="w-32">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(song, index) in filteredAndSortedSongs" :key="song.id" @click="goToSongDetails(song)" class="cursor-pointer">
          <TableCell>{{ index + 1 }}</TableCell>
          <TableCell class="flex items-center">
            <img :src="song.getThumbnailUrl()" alt="Thumbnail" class="w-12 h-12 mr-4 rounded-md" />
            <div>
              <div class="font-medium">{{ song.title }}</div>
              <div class="text-sm text-muted-foreground">{{ song.artist }}</div>
            </div>
          </TableCell>
          <TableCell>{{ song.duration }}</TableCell>
        </TableRow>
        <TableRow v-if="filteredAndSortedSongs.length === 0">
          <TableCell colspan="3" class="text-center">No results found</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SongInfo } from '../models/SongInfo';
import { fetchSongInfos } from '../services/songService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default defineComponent({
    name: 'SongListPage',
    components: {
      Button,
      Input,
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    },
    data() {
        return {
            songInfos: [] as SongInfo[],
            searchTerm: '',
            debouncedSearchTerm: '',
            sortBy: 'artist', // 'artist' or 'title'
            sortOrder: 'asc', // 'asc' or 'desc'
            debounceTimer: -1,
        };
    },
    watch: {
        searchTerm(newValue: string) {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = window.setTimeout(() => {
                this.debouncedSearchTerm = newValue;
            }, 300);
        },
    },
    async created() {
        this.songInfos = await fetchSongInfos();
    },
    methods: {
        goToSongDetails(song: SongInfo) {
            this.$router.push(`/songs/${song.language}/${song.id}`);
        },
        setSortBy(criteria: 'artist' | 'title') {
            this.sortBy = criteria;
        },
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },
    },
    computed: {
        sortByText(): string {
            return this.sortBy.charAt(0).toUpperCase() + this.sortBy.slice(1);
        },
        filteredAndSortedSongs(): SongInfo[] {
            let filtered = this.songInfos;

            if (this.debouncedSearchTerm) {
                const lowerCaseSearchTerm = this.debouncedSearchTerm.toLowerCase();
                filtered = this.songInfos.filter(song =>
                    song.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                    song.artist.toLowerCase().includes(lowerCaseSearchTerm) ||
                    song.language.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (song.tags && song.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
                );
            }

            const sorted = [...filtered].sort((a, b) => {
                let aValue: string;
                let bValue: string;

                if (this.sortBy === 'artist') {
                    aValue = a.artist.toLowerCase();
                    bValue = b.artist.toLowerCase();
                } else {
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                }

                if (aValue < bValue) {
                    return this.sortOrder === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return this.sortOrder === 'asc' ? 1 : -1;
                }

                // Secondary sort by title if artists are the same, and vice-versa
                if (this.sortBy === 'artist') {
                    return a.title.localeCompare(b.title);
                } else {
                    return a.artist.localeCompare(b.artist);
                }
            });

            return sorted;
        },
    },
});
</script>
