<script lang="ts" setup>
import SearchHeader from "~/components/header/SearchHeader.vue";
import TextFooter from "~/components/footer/TextFooter.vue";
import TestButton from "~/components/footer/TestButton.vue";

const route = useRoute();
</script>

<template>
  <div>
    <header>
      <SearchHeader />
    </header>
    <main class="container min-h-[100vh] mx-auto px-4">
      <slot />
      <FloatingAiChat />
    </main>
    <footer
      v-if="route.path === '/'"
      class="mt-10 bg-black text-white dark:bg-[#333]"
    >
      <TestButton :show-title="true" class="py-14" />
      <TextFooter />
    </footer>
    <footer v-else class="mt-5">
      <TextFooter />
    </footer>
  </div>
</template>

<style scoped></style>
