<script lang="ts" setup>
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import SearchEmptyComponent from "~/components/general/SearchEmptyComponent.vue";
import type { PageState } from "primevue/paginator";
import type { BookInfo } from "~/types/BookInfo";
import api from "~/api";
import BookSearchFilter from "~/components/BookSearchFilter.vue";

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
const filteredBooks = ref<BookInfo[]>([]);

const isSearchBookLoading = ref<boolean>(true);
async function searchBook(
  text: string,
  type: BookSearchType,
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
      query: text.trim(),
      queryType: type,
      sort: "Accuracy",
      page: page,
      size: size,
    });
    bookTotalRows.value = result.totalResults ?? 0;
    const bookList = result.item ?? [];

    searchResult.value = bookList.map((book: BookItem) => ({
      id: book.itemId,
      title: book.title,
      author: book.author,
      category: book.categoryName.split(">").reverse()[0] || "기타",
      price: book.priceStandard,
      cover: book.cover,
      priceSale: book.priceSales,
      stockstatus: book.stockStatus,
      description: book.description,
      isbn: book.isbn,
      link: book.link,
      publisher: book.publisher,
      pubDate: book.pubDate,
      customerReviewRank: book.customerReviewRank,
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

    <Accordion class="m-4" value="0">
      <AccordionPanel value="0">
        <AccordionHeader
          :pt="{
            root: {
              class:
                '!border-t-1 !border-l-0 !border-r-0 !border-b-1 !border-gray-300 hover:!bg-[#0d948821]',
            },
          }"
        >
          상세 검색
        </AccordionHeader>
        <AccordionContent
          :pt="{
            content: {
              class:
                'p-1 !border-t-0 !border-l-0 !border-r-0 !border-b-1 !border-gray-300',
            },
          }"
        >
          <BookSearchFilter v-model="filteredBooks" :books="searchResult" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

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
            v-for="(book, idx) in filteredBooks"
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
                    {{ book.price.toLocaleString() }}원
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
