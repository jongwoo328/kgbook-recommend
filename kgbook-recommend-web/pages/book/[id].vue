<script lang="ts" setup>
import { useRoute } from "vue-router";
import MainComponent from "~/components/main/MainComponent.vue";

const route = useRoute();
const bookId = route.params.id;

definePageMeta({
  layout: "book-list",
});
</script>

<template>
  <div class="pt-5 mt-10">
    <MainComponent />
  </div>
</template>

<style scoped></style>
