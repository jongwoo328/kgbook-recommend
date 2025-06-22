<script lang="ts" setup>
import FloatingAiChat from "~/components/FloatingAiChat.vue";
</script>

<template>
  <main class="container min-h-[100vh] mx-auto px-4">
    <slot />
    <FloatingAiChat />
  </main>
</template>

<style scoped></style>
