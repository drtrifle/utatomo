<template>
  <div class="about-page">
    <div class="about-container">
      <h1>About Utatomo</h1>
      
      <section>
        <h2>What is Utatomo?</h2>
        <p>
          Utatomo (歌友, "Song Friend") is a web application designed to help users learn Chinese songs.
          It provides lyrics with pinyin annotations and English translations.
        </p>
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Pinyin annotations above Chinese characters</li>
          <li>English translations</li>
          <li>Adjustable font sizes</li>
          <li>Mobile-friendly design</li>
        </ul>
      </section>

      <section>
        <h2>Technical Details</h2>
        <p>Built with:</p>
        <ul>
          <li>Vue.js 3</li>
          <li>Vite</li>
          <li>GitHub Pages</li>
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Found a bug or have a suggestion? Please visit our 
          <a href="https://github.com/drtrifle/utatomo" target="_blank" rel="noopener">
            GitHub repository
          </a>.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.about-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2em;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #34495e;
  margin-bottom: 15px;
  font-size: 1.5em;
}

p {
  line-height: 1.6;
  color: #444;
  margin-bottom: 15px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
  line-height: 1.6;
  color: #444;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
