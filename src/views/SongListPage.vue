<template>
    <div>
        <h1>Song List</h1>
        <div :class="styles.controls">
            <input type="text" v-model="searchTerm" placeholder="Search by song, artist, language or tag" :class="styles.searchInput" />
            <div :class="styles.sortContainer">
                <div class="sort-dropdown">
                    <button @click="toggleSortDropdown" :class="styles.sortButton">Sort: {{ sortByText }}</button>
                    <div v-if="isSortDropdownOpen" :class="styles.dropdownContent">
                        <a href="#" @click.prevent="setSortBy('artist')">Artist</a>
                        <a href="#" @click.prevent="setSortBy('title')">Title</a>
                    </div>
                </div>
                <button @click="toggleSortOrder" :class="styles.sortOrderButton">
                    <span v-if="sortOrder === 'asc'">↑</span>
                    <span v-else>↓</span>
                </button>
            </div>
        </div>
        <table :class="styles.songTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(song, index) in filteredAndSortedSongs" :key="song.id" @click="goToSongDetails(song)">
                    <td>{{ index + 1 }}</td>
                    <td :class="styles.songTitle">
                        <img :src="song.getThumbnailUrl()" alt="Thumbnail" :class="styles.thumbnail" />
                        <div :class="styles.titleInfo">
                            <div :class="styles.title">{{ song.title }}</div>
                            <div :class="styles.artist">{{ song.artist }}</div>
                        </div>
                    </td>
                    <td>{{ song.duration }}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="filteredAndSortedSongs.length === 0" :class="styles.noResults">
            No results found
        </div>
        <router-link to="/">Go Back to Home</router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SongInfo } from '../models/SongInfo';
import { fetchSongInfos } from '../services/songService';
import styles from '../styles/songList.module.css'; // Import the CSS Module

export default defineComponent({
    name: 'SongListPage',
    data() {
        return {
            songInfos: [] as SongInfo[],
            searchTerm: '',
            debouncedSearchTerm: '',
            sortBy: 'artist', // 'artist' or 'title'
            sortOrder: 'asc', // 'asc' or 'desc'
            isSortDropdownOpen: false,
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
        window.addEventListener('click', this.closeSortDropdownOnClickOutside);
    },
    beforeUnmount() {
        window.removeEventListener('click', this.closeSortDropdownOnClickOutside);
    },
    methods: {
        goToSongDetails(song: SongInfo) {
            this.$router.push(`/song/${song.language}/${song.id}`);
        },
        toggleSortDropdown() {
            this.isSortDropdownOpen = !this.isSortDropdownOpen;
        },
        closeSortDropdownOnClickOutside(event: MouseEvent) {
            const dropdown = this.$el.querySelector('.sort-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.isSortDropdownOpen = false;
            }
        },
        setSortBy(criteria: 'artist' | 'title') {
            this.sortBy = criteria;
            this.isSortDropdownOpen = false;
        },
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        },
    },
    computed: {
        styles() {
            return styles;
        },
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