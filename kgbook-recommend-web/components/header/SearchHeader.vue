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
      <Select
        v-model="selectedCategory"
        :options="categoryOptions"
        class="border-2 rounded-3xl border-black dark:border-white flex items-center w-[10rem]"
        option-label="label"
        option-value="value"
        size="large"
      />
      <InputText
        v-model="searchValue"
        class="w-[30rem] rounded-3xl px-8 py-3 border-2 border-black dark:border-white"
        placeholder="검색하여 책을 찾아보세요."
        @keydown.enter="searchBook"
      />
      <button
        class="h-12 w-12 flex justify-center items-center rounded-3xl border-black dark:border-white"
        @click="searchBook"
      >
        <Icon name="mdi-light:magnify" size="32" />
      </button>
    </div>
  </div>
</template>
