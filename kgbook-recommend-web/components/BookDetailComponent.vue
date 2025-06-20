<script lang="ts" setup>
import { useRouter } from "vue-router";
import BookCard from "~/components/general/BookCard.vue";
import { dummyBookDetail, dummyBookList } from "~/data/dummy";
import { useRoute } from "#vue-router";

const router = useRouter();

const route = useRoute();
const bookId = route.params.id;

onMounted(() => {
  console.log(bookId);
});

interface bookInfo {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  priceSale: 10800;
  coverUrl: string;
  publisher: string;
  publishedAt: string;
  stockstatus: string;
  mallType: string;
  description: string;
  isbn: string;
  isbn13?: string;
  customerReviewRank: number;
  bestRank: number;
}

// TODO 현재는 더미데이터. 추후 통신으로 가져오게 변경
const bookInfo = ref(dummyBookDetail);

const otherBooksByAuthor = ref(dummyBookList);
const aiRecommendedBooks = ref(dummyBookList);

function goToBookDetailPage(book) {
  router.push(`/book/${book.id}`);
}
</script>

<template>
  <div>
    <!-- 책의 정보 -->
    <div
      class="flex items-center justify-around font-bold border-t-2 border-b-2 border-black px-2 py-3"
    >
      <div class="px-5 flex-1 flex items-center gap-10">
        <div class="w-[350px] h-[350px] flex-shrink-0 bg-gray-200">
          <img
            :alt="bookInfo.title"
            :src="bookInfo.coverUrl"
            class="object-cover w-full h-full rounded"
          />
        </div>
        <div class="flex-1 py-2">
          <div class="mb-1">
            <span class="px-2 py-0.5 bg-teal-300 text-sm text-gray-600 rounded">
              소설
            </span>
          </div>
          <h1 class="text-2xl">{{ bookInfo.title }}</h1>
          <div class="flex gap-x-1.5 py-2 border-b-2 border-gray-100">
            <span>{{ bookInfo.author }}(지은이)</span>
            |
            <span>{{ bookInfo.publisher }}</span>
            |
            <span> {{ bookInfo.publishedAt }}</span>
          </div>

          <div
            v-if="bookInfo.description"
            class="text-sm py-2 border-b-2 border-gray-100 text-gray-800"
          >
            {{ bookInfo.description }}
          </div>

          <div
            class="mb-1 pt-2 space-y-2 text-sm text-gray-800 leading-relaxed"
          >
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">재고</div>
              <div>{{ bookInfo.stockstatus }}</div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">정가</div>
              <div class="line-through">{{ bookInfo.price }}</div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">판매가</div>
              <div class="text-primary text-xl font-semibold">
                {{ bookInfo.priceSale }}
              </div>
            </div>
          </div>

          <div
            class="mb-1 pt-2 space-y-2 text-sm text-gray-800 leading-relaxed"
          >
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">평점</div>
              <div class="text-primary">
                ★ {{ bookInfo.customerReviewRank }} / 10
              </div>
            </div>
            <div class="flex items-baseline gap-2">
              <div class="w-20 text-gray-500">ISBN</div>
              <div>{{ bookInfo.isbn }}</div>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-end gap-2">
            <div v-if="bookInfo.bestRank" class="text-gray-600 text-sm italic">
              이 책은 현재 베스트셀러 {{ bookInfo.bestRank }}위 입니다!
            </div>
            <a
              href="https://naver.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button label="책 구매 링크" size="small" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 이 작가의 다른 책 추천 -->
    <div class="border-b-2 border-black px-2 py-3">
      <div
        class="my-2 px-5 text-2xl flex items-center justify-between font-semibold"
      >
        이 작가의 다른 책 ({{ otherBooksByAuthor.length }})
      </div>

      <div
        class="max-w-full min-h-[20rem] flex flex-wrap gap-4 mt-4 items-center justify-center"
      >
        <BookCard
          v-for="(book, idx) in otherBooksByAuthor"
          :key="idx"
          class="w-[40%] sm:w-[30%] md:w-[20%] xl:w-[15%] min-w-[140px] cursor-pointer"
          @click="goToBookDetailPage(book)"
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
    </div>

    <!-- 비슷한 분야의 책 추천 (ai) -->
    <div class="border-b-2 border-black px-2 py-3">
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
          GPT 4.5 기반으로 추천이 이뤄져요!
        </span>
      </div>

      <div
        class="max-w-full min-h-[20rem] flex flex-wrap gap-4 mt-4 items-center justify-center"
      >
        <BookCard
          v-for="(book, idx) in aiRecommendedBooks"
          :key="idx"
          class="w-[40%] sm:w-[30%] md:w-[20%] xl:w-[15%] min-w-[140px] cursor-pointer"
          @click="goToBookDetailPage(book)"
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
    </div>
  </div>
</template>

<style scoped></style>
