<template>
  <div>hello world,{{ userStore.name }}</div>
  {{ a }}
  <HelloWorld msg="hhh" />
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const a = ref(1);
</script>
