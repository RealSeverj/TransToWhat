<script setup>
import HeaderView from './components/HeaderView.vue';
import TranslatoerView from './views/TranslatoerView.vue';
</script>

<template>
  <div class="app-container">
    <HeaderView />
    <main>
      <TranslatoerView />
    </main>
    <footer>
      <p>© 2025 TransToWhat | 你要翻译个啥</p>
    </footer>
  </div>
</template>

<style>
/* 全局样式 */
#app {
  max-width: 100% !important;
  margin: 0 auto;
  padding: 0 !important;
  text-align: left !important;
}

body {
  margin: 0;
  padding: 0;
  display: block;
  min-height: 100vh;
  place-items: normal;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

/* 添加一个半透明层，提高内容可读性 */
.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: -1;
}

main {
  flex: 1;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: rgba(26, 26, 46, 0.9);
  color: #f0f0f0;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}
</style>