<script lang="ts" setup>
import { useRoute } from "#vue-router";
import { SectionCategory } from "~/types/SectionCategory";
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";
import type { BookListItem } from "~/types/BookListItem";
import api from "~/api";
import type { PageState } from "primevue";

const route = useRoute();

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

// TODO api 호출 시에는 0부터 시작되게 해야겠지?
const currentPage = ref<number>(Number(route.query.page) || 1);
const selectedPerPage = ref<number>(10);
const perPageOptions = ref<number[]>([10, 20, 30, 50, 100]);

const books = ref<BookListItem[]>([]);
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
    const bookList = result.response.item ?? [];

    books.value = bookList.map((book: BookItem) => ({
      id: book.itemId,
      title: book.title,
      author: book.author,
      category: book.categoryName.split(">").reverse()[0],
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
  currentPage.value = pageState.page;
  selectedPerPage.value = pageState.rows;

  await fetchBookList();
}
</script>

<template>
  <div>
    <SectionHeader>
      <template #title> {{ pageTitle }} ({{ books.length }}) </template>
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
            class="cursor-pointer max-w-[320px] min-w-[200px] h-[450px]"
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
                    [{{ book.category }}]
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
            v-model:first="currentPage"
            v-model:rows="selectedPerPage"
            :rows-per-page-options="perPageOptions"
            :total-records="books.length"
            @page="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
