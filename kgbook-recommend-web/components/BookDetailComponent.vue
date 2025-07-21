<script lang="ts" setup>
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";
import api from "~/api";
import type { BookInfo } from "~/types/BookInfo";
import type { BookListItem } from "~/types/BookListItem";

const route = useRoute();
const bookId = route.params.id;

const store = useContextStore();

const bookInfo = ref<BookInfo>({
  title: "",
  author: "",
  publisher: "",
  pubDate: "",
  description: "",
  category: "",
  cover: "",
  price: 0,
  priceSale: 0,
  stockstatus: "",
  customerReviewRank: 0,
  isbn: "",
  link: "",
  id: 0,
});

const otherBooksByAuthor = ref<BookListItem[]>([]);
const aiRecommendedBooks = ref<BookListItem[]>([]);

const isBookInfoLoading = ref<boolean>(true);
const isOtherBooksByAuthorLoading = ref<boolean>(true);
const isAiRecommendedBooksLoading = ref<boolean>(true);

onMounted(async () => {
  await getBookDetailInfo(Number(bookId)).then(async () => {
    await Promise.all([
      getOtherBooksByAuthor(bookInfo.value.author),
      getAiRecommendedBooks(bookInfo.value.id),
    ]);
  });
});

onUnmounted(() => {
  delete store.context.dataInDisplay.bookInfo;
  delete store.context.dataInDisplay.otherBooksByAuthor;
  delete store.context.dataInDisplay.aiRecommendedBooks;
});

// TODO issue/7 작업 머지되면 useContextStore에 저장로직 추가하기
async function getBookDetailInfo(bookId: number) {
  try {
    isBookInfoLoading.value = true;

    const result = await api.getBookDetail(bookId);
    const book = result.response.item[0] as BookItem;

    bookInfo.value = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubDate: book.pubDate,
      description: book.description,
      category: book.categoryName.trim(),
      cover: book.cover,
      price: book.priceStandard,
      priceSale: book.priceSales,
      stockstatus: book.stockStatus,
      customerReviewRank: book.customerReviewRank,
      id: book.itemId,
      isbn: book.isbn,
      link: book.link,
    };
    store.context.dataInDisplay.bookInfo = bookInfo.value;
    isBookInfoLoading.value = false;
  } catch (error) {
    console.error("Failed to fetch book details:", error);
  }
}

async function getOtherBooksByAuthor(author: string) {
  if (!author || author.trim().length === 0) {
    return;
  }

  isOtherBooksByAuthorLoading.value = true;
  try {
    const result = await api.searchBooks({
      query: author.replace("외", "").replace("지음", "").trim(),
      queryType: "Author",
    });
    const bookList = result.response ?? [];

    otherBooksByAuthor.value = bookList.map((book: BookItem) => ({
      id: book.itemId,
      title: book.title,
      author: book.author,
      category: book.categoryName.split(">").reverse()[0],
      price: book.priceStandard,
      cover: book.cover,
    }));

    store.context.dataInDisplay.otherBooksByAuthor = otherBooksByAuthor.value;
  } catch (error) {
    console.error("Failed to fetch other books by author:", error);
    otherBooksByAuthor.value = [];
  } finally {
    isOtherBooksByAuthorLoading.value = false;
  }
}

async function getAiRecommendedBooks(itemId: number) {
  isAiRecommendedBooksLoading.value = true;

  try {
    const result = await api.recommendBooks(itemId);
    const bookList = result.response ?? [];

    aiRecommendedBooks.value = bookList.map((book: RecommendBookItem) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category.split(">").reverse()[0],
      price: book.price,
      cover: book.cover,
    }));
    store.context.dataInDisplay.aiRecommendedBooks = aiRecommendedBooks.value;
  } catch (error) {
    console.error("Failed to fetch AI recommended books:", error);
    aiRecommendedBooks.value = [];
  } finally {
    isAiRecommendedBooksLoading.value = false;
  }
}
</script>

<template>
  <div>
    <!-- 책의 정보 -->
    <div
      class="flex flex-col font-bold border-t-2 border-b-2 border-black dark:border-white px-2 py-3"
    >
      <div
        class="my-2 px-5 text-2xl flex items-center justify-between font-semibold"
      >
        <div class="flex items-center">
          <span> 책 정보 </span>
        </div>
      </div>

      <div v-if="isBookInfoLoading" class="mt-4">
        <Skeleton height="25rem" width="100%" />
      </div>
      <div v-else class="px-5 flex-1 flex items-center gap-10">
        <div class="w-[350px] h-[350px] flex-shrink-0 bg-gray-200">
          <img
            :alt="bookInfo.title"
            :src="bookInfo.cover"
            class="object-cover w-full h-full rounded"
          />
        </div>
        <div class="flex-1 py-2">
          <div class="mb-1">
            <span class="px-2 py-0.5 bg-teal-300 text-sm text-gray-600 rounded">
              {{ bookInfo.category }}
            </span>
          </div>
          <h1 class="text-2xl">{{ bookInfo.title }}</h1>
          <div
            class="flex gap-x-1.5 py-2 border-b-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-300"
          >
            <span>{{ bookInfo.author }}(지은이)</span>
            |
            <span>{{ bookInfo.publisher }}</span>
            |
            <span> {{ bookInfo.pubDate }}</span>
          </div>

          <div
            v-if="bookInfo.description"
            class="text-sm py-2 border-b-2 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-300"
          >
            {{ bookInfo.description }}
          </div>

          <div
            class="mb-1 pt-2 space-y-2 text-sm border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-300 leading-relaxed"
          >
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">재고</div>
              <div class="dark:text-gray-200">
                <span v-if="bookInfo.stockstatus === ''">-</span>
                <span v-else>{{ bookInfo.stockstatus }}</span>
              </div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">정가</div>
              <div class="line-through dark:text-gray-200">
                {{ bookInfo.price }}
              </div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">판매가</div>
              <div class="text-teal-600 text-xl font-semibold">
                {{ bookInfo.priceSale }}
              </div>
            </div>
          </div>

          <div
            class="mb-1 pt-2 space-y-2 text-sm text-gray-800 leading-relaxed"
          >
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">평점</div>
              <div class="text-teal-600 text-xl font-semibold">
                ★ {{ bookInfo.customerReviewRank }} / 10
              </div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">ISBN</div>
              <div class="dark:text-gray-200">{{ bookInfo.isbn }}</div>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-end gap-2">
            <a :href="bookInfo.link" rel="noopener noreferrer" target="_blank">
              <Button label="책 구매 링크" size="small" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 비슷한 분야의 책 추천 (ai) -->
    <div class="border-b-2 border-black dark:border-white px-2 py-3">
      <div
        class="my-2 px-5 text-2xl flex items-center justify-between font-semibold"
      >
        <div class="flex items-center">
          <Icon class="text-2xl mr-2 text-teal-600" name="hugeicons:robotic" />
          <span class="text-teal-600">
            AI 기반의 비슷한 책 추천 ({{ aiRecommendedBooks.length }})
          </span>
        </div>
        <span class="italic text-sm text-gray-400">
          GPT 4.0 기반의 AI가 분석한 추천 목록입니다.
        </span>
      </div>

      <div v-if="isAiRecommendedBooksLoading" class="mt-4">
        <Skeleton height="15rem" width="100%" />
      </div>
      <div v-else>
        <div v-if="aiRecommendedBooks.length === 0">
          <BookEmptyComponent />
        </div>
        <div
          v-else
          class="max-w-full min-h-[20rem] flex flex-wrap gap-4 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, idx) in aiRecommendedBooks"
            :key="idx"
            :to="`/book/${book.id}`"
            class="max-w-[180px] min-w-[140px] h-[270px] cursor-pointer"
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
      </div>
    </div>

    <!-- 이 작가의 다른 책 추천 -->
    <div class="border-b-2 border-black dark:border-white px-2 py-3">
      <div
        class="my-2 px-5 text-2xl flex items-center justify-between font-semibold"
      >
        이 작가의 다른 책 ({{ otherBooksByAuthor.length }})
      </div>

      <div v-if="isOtherBooksByAuthorLoading" class="mt-4">
        <Skeleton height="15rem" width="100%" />
      </div>
      <div v-else>
        <div v-if="otherBooksByAuthor.length === 0">
          <BookEmptyComponent />
        </div>
        <div
          v-else
          class="max-w-full min-h-[20rem] flex flex-wrap gap-4 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, idx) in otherBooksByAuthor"
            :key="idx"
            :to="`/book/${book.id}`"
            class="max-w-[180px] min-w-[140px] h-[270px] cursor-pointer"
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
