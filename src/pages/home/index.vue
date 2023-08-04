<template>
  <div>hello world,{{ userStore.name }}</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
</script>
