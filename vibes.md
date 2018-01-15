---
layout: page
title: Vibes
---

> Some chill vibes to capture a mood.

<style>
  .vibes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: -0.5em;
  }

  .vibe {
    flex: 1;
    margin: 0.5em;
  }
</style>

<div class="vibes">
  <iframe class="vibe" v-for="video of videos" :src="`https://www.youtube-nocookie.com/embed/${video}`" width="560" height="315"
    frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
</div>

<script>
  (() => {
    const vm = new Vue({
      el: document.querySelector('.vibes'),
      data: {
        index: 0,
        videos: [
          'osVlUMRZ2so',
          '1wa1KDM0P6w',
          'W3Pc7ZQggoE',
          'EU8j-gDtC18',
          'H8l7JA-LQVA',
          'qIN4jQ7TgmY',
          'TdBSoy9F9NA',
          'jww3TshT9ZM',
          'JPfE3JJkot0',
          'nPiQJfyK_i8',
          '7Cfu39jnQhE',
          '_WTCIK9SkKU',
          'nPyihvohLPY',
          'wbBSeyHYv8c',
          'yUf8ErSyvys',
          'gOgwZk_e4TA',
          'k9e0caOz1ww',
          'qUFBP2hI2jU',
          'j1oCi5VrEtA',
          '3txqEEE0zeg',
          '0ILnF7p2eiw',
          'sBZ78RBQ6ZI',
          'eq2pja3_vaA',
          '-TGNIh4XeaY',
          'YaJ3exPculA',
          '8d82SrPn_Ss',
          'ISUmbcFsWpM',
        ],
      },
      methods: {
        next() {
          this.index = (this.index + 1) % this.videos.length;
        },
        prev() {
          const newVal = this.index - 1;
          this.index = newVal >= 0 ? newVal : this.videos.length;
        },
      },
    });
  })();
</script>
