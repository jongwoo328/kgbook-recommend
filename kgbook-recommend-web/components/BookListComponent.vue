<script lang="ts" setup>
import { SectionCategory } from "~/types/SectionCategory";
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";
import type { BookListItem } from "~/types/BookListItem";
import api from "~/api";
import type { PageState } from "primevue";

const route = useRoute();
const router = useRouter();

type CategoryType = (typeof SectionCategory)[keyof typeof SectionCategory];
const props = defineProps<{
  category: CategoryType;
}>();

const pageTitle = computed(() => {
  switch (props.category) {
    case SectionCategory.Bestseller:
      return "베스트셀러";
    case SectionCategory.Remarkable:
      return "주목할 만한 신간";
    default:
      console.error(`Unknown category: ${props.category}`);
      return "Book List";
  }
});

const currentPage = ref<number>(Number(route.query.page) || 1);
const selectedPerPage = ref<number>(Number(route.query.size) || 10);
const perPageOptions = ref<number[]>([10, 20, 30, 50, 100]);

const books = ref<BookListItem[]>([]);
const bookTotalRows = ref<number>(0);
onMounted(async () => {
  await fetchBookList();
});

const isBookListLoading = ref<boolean>(true);
async function fetchBookList() {
  try {
    isBookListLoading.value = true;

    const result = await api.getBookList(
      props.category as BookListQueryType,
      currentPage.value,
      selectedPerPage.value,
    );
    bookTotalRows.value = result.totalResults ?? 0;
    const bookList = result.item ?? [];

    books.value = bookList.map((book: BookItem) => ({
      id: book.itemId,
      title: book.title,
      author: book.author,
      category: (book.categoryName ?? "").split(">").reverse()[0],
      price: book.priceStandard,
      cover: book.cover,
    }));
  } catch (error) {
    console.error(`Error fetching ${props.category} book list:`, error);
    books.value = [];
  } finally {
    isBookListLoading.value = false;
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
  await fetchBookList();
}
</script>

<template>
  <div>
    <SectionHeader>
      <template #title> {{ pageTitle }} ({{ bookTotalRows }}) </template>
    </SectionHeader>

    <div v-if="isBookListLoading" class="mt-4">
      <Skeleton height="25rem" width="100%" />
    </div>
    <div v-else>
      <div v-if="books.length === 0">
        <BookEmptyComponent />
      </div>
      <div v-else>
        <div
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, idx) in books"
            :key="idx"
            :to="`/book/${book.id}`"
            class="cursor-pointer max-w-[320px] min-w-[200px] h-[270px]"
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
