<script lang="ts" setup>
import IconField from "primevue/iconfield";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import { ref } from "vue";

const router = useRouter();
const searchValue = ref<string>("");
const selectedCategory = ref<string>("카테고리");

const categoryOptions = [
  "카테고리",
  "제목+저자",
  "제목",
  "저자"
];

function searchBook() {
  if (!searchValue.value.trim()) {
    return;
  }
  router.push({
    path: "/search",
    query: {
      text: searchValue.value.trim(),
      category: selectedCategory.value === "카테고리" ? "all" : selectedCategory.value,
    },
  });
  console.log(`@@ searchBook search value=(${searchValue.value.trim()}), category=(${selectedCategory.value})`);
}
</script>

<template>
  <div class="my-5 flex flex-col justify-center items-center">
    <NuxtLink to="/">
      <h1 class="page-title cursor-pointer font-bold py-5 my-2 text-4xl">
        사이트 이름 뭐하징
      </h1>
    </NuxtLink>
    <div class="nav-bar-links text mb-2">
      <NuxtLink
        class="nav-bar-link text-gray-500"
        exact-active-class="!text-black dark:!text-white"
        to="/"
      >
        홈
      </NuxtLink>
      |
      <NuxtLink
        class="nav-bar-link text-gray-500"
        exact-active-class="!text-black dark:!text-white"
        to="/best-sellers?page=1"
      >
        베스트셀러
      </NuxtLink>
      |
      <NuxtLink
        class="nav-bar-link text-gray-500"
        exact-active-class="!text-black dark:!text-white"
        to="/remakerable-new-books?page=1"
      >
        주목할 만한 신간
      </NuxtLink>
    </div>
    <div class="flex items-center w-[70%] my-2 border-2 border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
      <Dropdown
        v-model="selectedCategory"
        :options="categoryOptions"
        class="border-none outline-none"
        style="min-width: 140px"
        :pt="{
          root: { class: 'border-none rounded-none' },
          trigger: { class: 'px-4 py-3 border-none rounded-none' },
          panel: { class: 'rounded-lg' }
        }"
      />
      <div class="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
      <IconField class="flex-1">
        <InputText
          v-model="searchValue"
          class="w-full px-4 py-3 border-none outline-none"
          placeholder="검색하여 책을 찾아보세요."
          style="border: none; box-shadow: none"
          @keydown.enter="searchBook"
        />
      </IconField>
      <Button
        class="px-4 py-3 bg-transparent border-none hover:bg-gray-50 dark:hover:bg-gray-800"
        :disabled="!searchValue.trim()"
        @click="searchBook"
      >
        <Icon class="text-xl text-gray-600 dark:text-gray-400" name="mdi-light:magnify" />
      </Button>
    </div>
  </div>
</template>
