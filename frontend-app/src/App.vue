<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
/* Reset css mặc định */
body {
  margin: 0;
  padding: 0;
}
</style>