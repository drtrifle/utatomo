<template>
    <div>
        <h1>Song List</h1>
        <table :class="styles.songTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(song, index) in songInfos" :key="song.id" @click="goToSongDetails(song)">
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
        };
    },
    async created() {
        this.songInfos = await fetchSongInfos();
    },
    methods: {
        goToSongDetails(song: SongInfo) {
            this.$router.push(`/song/${song.language}/${song.id}`);
        },
    },
    computed: {
        styles() {
            return styles;
        },
    },
});
</script>