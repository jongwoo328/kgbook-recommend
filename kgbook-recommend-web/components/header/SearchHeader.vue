<script lang="ts" setup>
import IconField from "primevue/iconfield";

import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchValue = ref<String>("");

function searchBook() {
  router.push({
    path: "/search",
    query: {
      text: searchValue.value,
    },
  });
  console.log(`@@ searchBook search value=(${searchValue.value})`);
}

function goToMainPage() {
  router.push("/");
}
</script>

<template>
  <div class="my-5 flex flex-col justify-center items-center">
    <NuxtLink to="/">
      <h1 class="page-title cursor-pointer font-bold py-5 my-2 text-4xl">
        사이트 이름 뭐하징
      </h1>
    </NuxtLink>
    <IconField class="search-input-container my-2">
      <InputIcon>
        <Icon class="text-xl" name="mdi-light:magnify" />
      </InputIcon>
      <InputText
        v-model="searchValue"
        class="search-input"
        placeholder="검색하여 책을 찾아보세요."
        @keydown.enter="searchBook"
      />
    </IconField>
  </div>
</template>

<style scoped>
.search-input-container {
  width: 70%;

  .search-input {
    width: 100%;
    border-radius: 1.5rem;
    padding: 1rem 2rem;
    border-width: 2px;
    border-color: black;
  }
}
</style>
