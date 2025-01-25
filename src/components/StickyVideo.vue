<template>
    <div class="sticky-video">
        <iframe :src="`https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}`" frameborder="0"
            allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
</template>

<script>
export default {
    props: {
        youtubeUrl: {
            type: String,
            required: true,
        },
    },
    methods: {
        extractYouTubeId(url) {
            const match = url.match(/v=([^&]+)/);
            return match ? match[1] : null;
        },
    },
};
</script>

<style scoped>
.sticky-video {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-bottom: 1px solid #ddd;
}

iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
