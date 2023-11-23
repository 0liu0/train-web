<template>
  <a-layout id="components-layout-demo-top-side">
    <main-header/>
    <main-content/>
    <main-footer/>
  </a-layout>
</template>
<script setup>
import {ref} from 'vue';
import MainHeader from "@/components/main/MainHeader.vue";
import MainContent from "@/components/main/MainContent.vue";
import MainFooter from "@/components/main/MainFooter.vue";
</script>
<style scoped>

</style>