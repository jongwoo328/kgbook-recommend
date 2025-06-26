<script lang="ts" setup>
import IconField from "primevue/iconfield";

import { ref } from "vue";

const router = useRouter();
const searchValue = ref<string>("");

function searchBook() {
  router.push({
    path: "/search",
    query: {
      text: searchValue.value,
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
    <IconField class="w-[70%] my-2">
      <InputIcon>
        <Icon class="text-xl" name="mdi-light:magnify" />
      </InputIcon>
      <InputText
        v-model="searchValue"
        class="w-full rounded-3xl px-8 py-4 border-2 border-black dark:border-white"
        placeholder="검색하여 책을 찾아보세요."
        @keydown.enter="searchBook"
      />
    </IconField>
  </div>
</template>
