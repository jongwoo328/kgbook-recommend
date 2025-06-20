<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useRoute } from "#vue-router";
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import { dummyBookList } from "~/data/dummy";
import SearchEmptyComponet from "~/components/general/SearchEmptyComponet.vue";

const router = useRouter();

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

function goToBookDetailPage(book) {
  router.push(`/book/${book.id}`);
}
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
      <SearchEmptyComponet />
    </div>
    <div v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
      >
        <BookCard
          v-for="(book, idx) in searchResult"
          :key="idx"
          :book="book"
          @click.native="goToBookDetailPage(book)"
        >
          <template #image>
            <img
              :alt="book.title"
              :src="book.coverUrl"
              class="object-cover w-full h-full"
            />
          </template>

          <template #info>
            <div class="text-center text-sm">
              <p class="text text-gray-800">[{{ book.category }}]</p>
              <span class="font-bold">{{ book.title }}</span>
              /
              <span class="text-sm text-gray-600">
                {{ book.author }} ({{ book.price.toLocaleString() }}원)
              </span>
            </div>
          </template>
        </BookCard>
      </div>
      <div class="card mt-2">
        <Paginator
          v-model:first="currentPage"
          :rows="10"
          :rowsPerPageOptions="perPageOptions"
          :totalRecords="searchResult.length"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
