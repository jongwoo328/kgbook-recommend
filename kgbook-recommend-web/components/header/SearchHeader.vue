<script lang="ts" setup>
import IconField from "primevue/iconfield";

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
    <div class="flex items-center justify-center w-[70%] my-2 gap-0">
      <Dropdown
        v-model="selectedCategory"
        :options="categoryOptions"
        class="border-2 border-black dark:border-white rounded-l-full"
        style="min-width: 150px"
        :pt="{
          root: { class: 'rounded-l-full border-r-0' },
          trigger: { class: 'rounded-l-full px-4 py-4' },
          dropdown: { class: 'rounded-l-full' }
        }"
      />
      <IconField class="flex-1 relative">
        <InputText
          v-model="searchValue"
          class="w-full px-8 py-4 border-2 border-l-0 border-r-0 border-black dark:border-white"
          placeholder="검색하여 책을 찾아보세요."
          style="border-radius: 0"
          @keydown.enter="searchBook"
        />
      </IconField>
      <Button
        class="rounded-r-full px-4 py-4 min-w-[60px] border-2 border-black dark:border-white border-l-0"
        :disabled="!searchValue.trim()"
        :pt="{
          root: { class: 'rounded-r-full' }
        }"
        @click="searchBook"
      >
        <Icon class="text-xl" name="mdi-light:magnify" />
      </Button>
    </div>
  </div>
</template>
