<script lang="ts" setup>
import IconField from "primevue/iconfield";

import { ref } from "vue";

const searchValue = ref<String>("");

function searchBook() {
  if (searchValue.value === "" || !searchValue.value) {
    return;
  }
  console.log(`@@ searchBook. name=(${searchValue.value})`);
}
</script>

<template>
  <div class="my-5 flex flex-col justify-center items-center">
    <h1 class="page-title font-bold py-5 my-2 text-4xl">사이트 이름 뭐하징</h1>
    <IconField class="search-input-container my-2">
      <InputIcon>
        <Icon class="text-xl" name="mdi-light:magnify" />
      </InputIcon>
      <InputText
        v-model="searchValue"
        class="search-input"
        placeholder="책 이름을 검색해보세요."
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
