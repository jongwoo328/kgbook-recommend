<script lang="ts" setup>
import BookListComponent from "~/components/BookListComponent.vue";
import { SectionCategory } from "~/types/SectionCategory";

definePageMeta({
  layout: "etc",
});
</script>

<template>
  <div class="pt-5 mt-10">
    <BookListComponent :category="SectionCategory.Bestseller" />
  </div>
</template>

<style scoped></style>
