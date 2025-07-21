<script lang="ts" setup>
import { ref } from "vue";

const router = useRouter();
const searchValue = ref<string>("");

const categoryOptions = [
  {
    label: "제목+저자",
    value: "Keyword",
  },
  {
    label: "제목",
    value: "Title",
  },
  {
    label: "저자",
    value: "Author",
  },
  {
    label: "출판사",
    value: "Publisher",
  },
];
const selectedCategory = ref("Keyword");

function searchBook() {
  if (!searchValue.value.trim()) {
    return;
  }
  router.push({
    path: "/search",
    query: {
      text: searchValue.value,
      category: selectedCategory.value,
    },
  });
  console.log(`@@ searchBook search value=(${searchValue.value})`);
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
    <div class="my-2 w-full flex justify-center items-center gap-2">
      <div
        class="flex items-center w-[70%] my-2 border-2 border-black dark:border-white rounded-full overflow-hidden"
      >
        <Select
          v-model="selectedCategory"
          :options="categoryOptions"
          :pt="{
            trigger: { class: 'px-4 py-3 border-none rounded-none' },
            panel: { class: 'rounded-lg' },
          }"
          class="border-none !outline-0"
          option-label="label"
          option-value="value"
          style="min-width: 140px"
        />
        <div class="h-8 w-px bg-black dark:bg-white" />
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
          id="searchButton"
          :disabled="!searchValue.trim()"
          class="px-4 py-3 hover:cursor-pointer bg-transparent border-none"
          @click="searchBook"
        >
          <Icon
            class="text-xl text-gray-950 dark:text-gray-300"
            name="mdi-light:magnify"
          />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#searchButton:hover {
  background-color: transparent;
  border: none;
}
</style>
