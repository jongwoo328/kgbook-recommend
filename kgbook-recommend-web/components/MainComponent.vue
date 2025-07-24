<script lang="ts" setup>
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";

import BookPreferenceModal from "~/components/modal/BookPreferenceModal.vue";
import api from "~/api";
import type { BookListItem } from "~/types/BookListItem";

const { userPreference } = usePreference();
const contextStore = useContextStore();
const showPreferenceModal = ref(false);

const isLoadingPersonalized = ref(false);
const recommendedBooks = ref<BookListItem[]>([]);
async function refreshPersonalizedBookList() {
  if (isLoadingPersonalized.value) {
    return;
  }
  isLoadingPersonalized.value = true;
  try {
    const response = await api.recommendPersonalBooks({
      userPreference: userPreference.value.user,
    });

    recommendedBooks.value = response.response;
    contextStore.context.dataInDisplay.recommendedBooks =
      recommendedBooks.value;
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingPersonalized.value = false;
  }
}

const isLoadingBestSellers = ref(false);
const bestSellers = ref<BookItem[]>([]);
async function refreshBestSellers() {
  if (isLoadingBestSellers.value) {
    return;
  }
  isLoadingBestSellers.value = true;
  try {
    const response = await api.getBookList("Bestseller", 1, 6);
    bestSellers.value = response.response.item;
    contextStore.context.dataInDisplay.bestSellers = bestSellers.value;
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingBestSellers.value = false;
  }
}

const isLoadingRemarkableNewBooks = ref(false);
const remarkableNewBooks = ref<BookItem[]>([]);
async function refreshRemarkableNewBooks() {
  if (isLoadingRemarkableNewBooks.value) {
    return;
  }
  isLoadingRemarkableNewBooks.value = true;
  try {
    const response = await api.getBookList("ItemNewSpecial", 1, 6);
    remarkableNewBooks.value = response.response.item;
    contextStore.context.dataInDisplay.remarkableNewBooks =
      remarkableNewBooks.value;
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingRemarkableNewBooks.value = false;
  }
}

onMounted(() => {
  if (!userPreference.value.isSubmitted) {
    showPreferenceModal.value = true;
  }
  refreshPersonalizedBookList();
  refreshBestSellers();
  refreshRemarkableNewBooks();
  console.log(contextStore.context);
  console.log(bestSellers.value);
  console.log(remarkableNewBooks.value);
});

onUnmounted(() => {
  contextStore.context.dataInDisplay = null;
});
</script>

<template>
  <div>
    <div class="mb-8">
      <SectionHeader>
        <template #title>
          개인 맞춤 추천 책
          <Icon
            class="text-3xl cursor-pointer text-teal-700"
            name="line-md:cog-filled"
            @click="showPreferenceModal = true"
          />
        </template>
        <template #icon>
          <Icon
            class="text-4xl cursor-pointer"
            name="line-md:rotate-270"
            @click="refreshPersonalizedBookList"
          />
        </template>
      </SectionHeader>
      <div v-if="isLoadingPersonalized" class="mt-4">
        <Skeleton height="15rem" width="100%" />
      </div>
      <BookEmptyComponent
        v-else-if="recommendedBooks.length === 0"
        text="현재 추천가능한 책 목록이 없습니다. 개인설정 후 다시 시도해 주세요."
      />
      <div
        v-else
        class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
      >
        <NuxtLink
          v-for="(book, bookIdx) in recommendedBooks"
          :key="bookIdx"
          :to="`/book/${book.id}`"
          class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px] no-underline"
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
                  [{{ book.category.split(">").at(-1) }}]
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

      <div class="mb-8">
        <SectionHeader>
          <template #title> 베스트셀러 </template>
          <template #icon>
            <NuxtLink class="text-4xl cursor-pointer" to="/best-sellers?page=1">
              <Icon name="line-md:chevron-small-right" />
            </NuxtLink>
          </template>
        </SectionHeader>
        <div v-if="isLoadingBestSellers" class="mt-4">
          <Skeleton height="15rem" width="100%" />
        </div>
        <BookEmptyComponent v-else-if="bestSellers.length === 0" />
        <div
          v-else
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, bookIdx) in bestSellers"
            :key="bookIdx"
            :to="`/book/${book.itemId}`"
            class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px] no-underline"
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
                    [{{ book.categoryName.split(">").at(-1) }}]
                  </p>
                  <p class="font-bold truncate">{{ book.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.author }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.priceSales.toLocaleString() }}원
                  </p>
                </div>
              </template>
            </BookCard>
          </NuxtLink>
        </div>
      </div>

      <div class="mb-8">
        <SectionHeader>
          <template #title> 주목할 만한 신간 </template>
          <template #icon>
            <NuxtLink
              class="text-4xl cursor-pointer"
              to="/remakerable-new-books?page=1"
            >
              <Icon name="line-md:chevron-small-right" />
            </NuxtLink>
          </template>
        </SectionHeader>
        <div v-if="isLoadingRemarkableNewBooks" class="mt-4">
          <Skeleton height="15rem" width="100%" />
        </div>
        <BookEmptyComponent v-else-if="remarkableNewBooks.length === 0" />
        <div
          v-else
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, bookIdx) in remarkableNewBooks"
            :key="bookIdx"
            :to="`/book/${book.itemId}`"
            class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px] no-underline"
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
                    [{{ book.categoryName.split(">").at(-1) }}]
                  </p>
                  <p class="font-bold truncate">{{ book.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.author }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-500 truncate">
                    {{ book.priceSales.toLocaleString() }}원
                  </p>
                </div>
              </template>
            </BookCard>
          </NuxtLink>
        </div>

        <BookPreferenceModal v-model:visible="showPreferenceModal" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
