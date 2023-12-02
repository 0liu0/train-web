<template>
  <a-layout-content style="padding: 0 50px">
    <a-layout style="padding: 24px 0; background: #fff">
      <AdminSider/>
      <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout-content>
</template>

<script setup>
import {ref} from "vue";
import AdminSider from "@/components/main/content/item/admin/AdminSider.vue";

const selectedKeys2 = ref(['1']);
const openKeys = ref(['sub1']);
</script>

<style scoped>

</style>