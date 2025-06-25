<script lang="ts" setup>
import TestButton from "~/components/footer/TestButton.vue";
</script>

<template>
  <div class="px-14 pt-14 text-center text-gray-600 dark:text-gray-300">
    <Icon class="w-10 h-10 mx-auto mb-4" name="mdi:book-search-outline" />
    <p>검색 결과가 없습니다.</p>
    <TestButton
      :show-title="false"
      class="text-base text-gray-600 dark:text-gray-300"
    />
  </div>
</template>

<style scoped></style>
