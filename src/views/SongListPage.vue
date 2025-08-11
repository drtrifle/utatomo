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
                <tr v-for="(song, index) in songInfos" :key="song.id" @click="goToSongDetails(song.id)">
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

<script>
import { SongInfo } from '../models/SongInfo';
import { fetchSongInfos } from '../services/songService';
import styles from '../styles/songList.module.css'; // Import the CSS Module

export default {
    name: 'SongListPage',
    data() {
        return {
            /** @type {import('../models/SongInfo').SongInfo[]} */
            songInfos: [],
        };
    },
    async created() {
        this.songInfos = await fetchSongInfos();
    },
    methods: {
        goToSongDetails(songId) {
            this.$router.push(`/song/${songId}`);
        },
    },
    computed: {
        styles() {
            return styles;
        },
    },
};
</script>