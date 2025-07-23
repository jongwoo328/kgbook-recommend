<script lang="ts" setup>
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import SearchEmptyComponent from "~/components/general/SearchEmptyComponent.vue";
import type { PageState } from "primevue";
import type { BookInfo } from "~/types/BookInfo";
import api from "~/api";

const route = useRoute();
const router = useRouter();

const searchText = ref<string>("");
const searchSearchType = ref<BookSearchType>("Keyword");
watch(
  () => route.query.text,
  (newValue) => {
    searchText.value = (newValue as string) || "";
  },
  { immediate: true },
);
watch(
  () => route.query.type,
  (newValue) => {
    searchSearchType.value = newValue as BookSearchType;
  },
  { immediate: true },
);

const currentPage = ref<number>(Number(route.query.page) || 1);
const selectedPerPage = ref<number>(Number(route.query.size) || 30);
const perPageOptions = ref<number[]>([10, 20, 30, 50, 100]);

onMounted(async () => {
  await searchBook(
    route.query.text,
    route.query.type,
    currentPage.value,
    selectedPerPage.value,
  );
});

const bookTotalRows = ref<number>(0);
const searchResult = ref<BookInfo[]>([]);
const filteredResult = computed<BookInfo[]>(() => {
  // TODO 구현 필요
  return searchResult.value;
});

const isSearchBookLoading = ref<boolean>(true);
async function searchBook(
  text: string,
  type: string,
  page: number,
  size: number,
) {
  if (!text || text === "") {
    return;
  }
  if (!["Keyword", "Title", "Author", "Publisher"].includes(type)) {
    return;
  }

  isSearchBookLoading.value = true;
  try {
    const result = await api.searchBooks({
      query: searchText.value.trim(),
      queryType: searchSearchType.value,
      sort: "Accuracy",
      page: page,
      size: size,
    });
    bookTotalRows.value = result.response.totalResults ?? 0;
    const bookList = result.response.item ?? [];

    console.log(bookList);

    searchResult.value = bookList.map((book: BookItem) => ({
      id: book.itemId,
      title: book.title,
      author: book.author,
      category: book.categoryName.split(">").reverse()[0],
      price: book.priceStandard,
      cover: book.cover,
    }));
  } catch (error) {
    console.error("Failed to fetch search books: ", error);
    searchResult.value = [];
  } finally {
    isSearchBookLoading.value = false;
  }
}

async function onPageChange(pageState: PageState) {
  currentPage.value = pageState.page + 1; // PrimeVue는 0부터 시작하므로 +1
  selectedPerPage.value = pageState.rows;
  router.push({
    query: {
      ...route.query,
      page: String(currentPage.value),
      size: String(selectedPerPage.value),
    },
  });
  await searchBook(
    searchText.value,
    searchSearchType.value,
    currentPage.value,
    selectedPerPage.value,
  );
}
</script>

<template>
  <div>
    <SectionHeader>
      <template #title>
        <span class="text-teal-600">'{{ searchText }}'</span>
        검색 결과 총 {{ bookTotalRows }}건
      </template>
    </SectionHeader>

    <div v-if="isSearchBookLoading" class="mt-4">
      <Skeleton height="25rem" width="100%" />
    </div>
    <div v-else>
      <div v-if="bookTotalRows === 0">
        <SearchEmptyComponent />
      </div>
      <div v-else>
        <div
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, idx) in filteredResult"
            :key="idx"
            :to="`/book/${book.id}`"
            class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px]"
          >
            <BookCard>
              <template #image>
                <img
                  :alt="book.title"
                  :src="book.cover"
                  class="object-cover w-full h-full"
                />
              </template>

              <template #info>
                <div class="text-center text-sm">
                  <p class="text text-gray-800 dark:text-gray-300">
                    <span v-if="book.category !== ''">
                      [{{ book.category }}]
                    </span>
                    <span
                      v-else
                      class="italic text-gray-400 dark:text-gray-600"
                    >
                      [카테고리 없음]
                    </span>
                  </p>
                  <p class="font-bold truncate">{{ book.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.author }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.price }}원
                  </p>
                </div>
              </template>
            </BookCard>
          </NuxtLink>
        </div>
        <div class="card mt-2">
          <Paginator
            :first="(currentPage - 1) * selectedPerPage"
            :rows="selectedPerPage"
            :rows-per-page-options="perPageOptions"
            :total-records="bookTotalRows"
            @page="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
