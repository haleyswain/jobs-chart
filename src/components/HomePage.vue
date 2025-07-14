<script setup lang="ts">
import JobSearch from './JobSearch.vue';
</script>

<template>
  <div class="page-container">
    <JobSearch />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.page-container h1,
.page-container h3 {
  text-align: center;
}
</style>
