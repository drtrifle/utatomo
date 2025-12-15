<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h4">About Utatomo</v-card-title>
      <v-card-text>
        <section class="mb-4">
          <h2 class="text-h5 mb-2">What is Utatomo?</h2>
          <p>
            Utatomo (歌友, "Song Friend") is a web application designed to help users learn Chinese songs.
            It provides lyrics with pinyin annotations and English translations.
          </p>
        </section>

        <section class="mb-4">
          <h2 class="text-h5 mb-2">Features</h2>
          <v-list density="compact">
            <v-list-item>Pinyin annotations above Chinese characters</v-list-item>
            <v-list-item>English translations</v-list-item>
            <v-list-item>Adjustable font sizes</v-list-item>
            <v-list-item>Mobile-friendly design</v-list-item>
          </v-list>
        </section>

        <section class="mb-4">
          <h2 class="text-h5 mb-2">Technical Details</h2>
          <p>Built with:</p>
          <v-list density="compact">
            <v-list-item>Vue.js 3</v-list-item>
            <v-list-item>Vite</v-list-item>
            <v-list-item>GitHub Pages</v-list-item>
          </v-list>
        </section>

        <section>
          <h2 class="text-h5 mb-2">Contact</h2>
          <p>
            Found a bug or have a suggestion? Please visit our
            <a href="https://github.com/drtrifle/utatomo" target="_blank" rel="noopener">
              GitHub repository
            </a>.
          </p>
        </section>
      </v-card-text>
    </v-card>
  </v-container>
</template>