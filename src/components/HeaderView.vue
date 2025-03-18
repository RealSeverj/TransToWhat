<script setup>
const title = "TransToWhat"
const subtitle = "你要翻译个啥"
</script>

<template>
  <header class="header">
    <div class="header-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  padding: 1rem 0;
  background-color: #1a1a2e;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #4a6cf7, #7755e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
  opacity: 0.85;
}
</style>