<template>
  <a-layout id="components-layout-demo-top-side">
    <main-header/>
    <router-view/>
    <main-footer/>
  </a-layout>
</template>
<script setup>
import MainHeader from "@/components/main/header/MainHeader.vue";
import MainFooter from "@/components/main/footer/MainFooter.vue";
</script>
<style scoped>

</style>