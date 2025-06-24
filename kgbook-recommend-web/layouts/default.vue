<script lang="ts" setup>
import SearchHeader from "~/components/header/SearchHeader.vue";
import TextFooter from "~/components/footer/TextFooter.vue";
</script>

<template>
  <div>
    <header>
      <SearchHeader />
    </header>
    <main class="container min-h-[100vh] mx-auto px-4">
      <slot />
    </main>
    <footer class="mt-5">
      <TextFooter />
    </footer>
  </div>
</template>

<style scoped></style>
