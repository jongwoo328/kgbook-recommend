<script lang="ts" setup>
import { useRoute } from "#vue-router";
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import { dummyBookList } from "~/data/dummy";
import SearchEmptyComponent from "~/components/general/SearchEmptyComponent.vue";

const route = useRoute();

onMounted(() => {
  console.log(route.query.text);
});

const searchValue = ref<string>("");
watch(
  () => route.query.text,
  (newValue) => {
    searchValue.value = newValue as string;
  },
  { immediate: true },
);

// TODO 현재는 더미데이터. 추후 통신으로 가져오게 변경
const searchResult = computed(() => {
  if (!searchValue.value || searchValue.value === "") return [];
  return dummyBookList;
});

const currentPage = ref<number>(Number(route.query.page) || 1);
const perPageOptions = ref<number[]>([10, 20, 30, 50, 100]);
</script>

<template>
  <div>
    <SectionHeader>
      <template #title>
        <span class="text-teal-600">'{{ searchValue }}'</span>
        검색 결과 총 {{ searchResult.length }}건
      </template>
    </SectionHeader>

    <div v-if="searchResult.length === 0">
      <SearchEmptyComponent />
    </div>
    <div v-else>
      <div
        class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
      >
        <NuxtLink
          v-for="(book, idx) in searchResult"
          :key="idx"
          :to="`/book/${book.id}`"
          class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px]"
        >
          <BookCard>
            <template #image>
              <img
                :alt="book.title"
                :src="book.coverUrl"
                class="object-cover w-full h-full"
              >
            </template>

            <template #info>
              <div class="text-center text-sm">
                <p class="text text-gray-800">[{{ book.category }}]</p>
                <p class="font-bold">{{ book.title }}</p>
                <p class="text-sm text-gray-600">
                  {{ book.author }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ book.price.toLocaleString() }}원
                </p>
              </div>
            </template>
          </BookCard>
        </NuxtLink>
      </div>
      <div class="card mt-2">
        <Paginator
          v-model:first="currentPage"
          :rows="10"
          :rows-per-page-options="perPageOptions"
          :total-records="searchResult.length"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
