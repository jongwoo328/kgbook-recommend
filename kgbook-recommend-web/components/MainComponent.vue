<script lang="ts" setup>
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";
import { SectionCategory } from "~/types/SectionCategory";
import { mainPageChangeDummy, mainPageDummy } from "~/data/dummy";

import BookPreferenceModal from "~/components/modal/BookPreferenceModal.vue";
import type { Preference } from "~/types/Preference";
import { useLocalStorage } from "@vueuse/core";

const defaultPreference: Preference = {
  isSubmitted: false,
  user: {
    job: "",
    interests: [],
    readTime: "",
    style: [],
    recentBook: "",
  },
};

const userPreference = useLocalStorage<Preference>(
  "userPreference",
  defaultPreference,
);
const showPreferenceModal = ref(false);

onMounted(() => {
  if (!userPreference.value.isSubmitted) {
    showPreferenceModal.value = true;
  }
});

interface Book {
  id: number;
  title: string;
  category: string;
  author: string;
  price: number;
  coverUrl: string;
}

interface TooltipInfo {
  message: string;
  icon: string;
}

type MainSectionCategory =
  (typeof SectionCategory)[keyof typeof SectionCategory];

interface MainPageBookCardSection {
  category: MainSectionCategory;
  showTooltip: boolean;
  tooltipInfo?: TooltipInfo;
  title: string;
  icon: string;
  books: Book[];
}

// TODO 현재는 더미데이터. 추후 통신으로 가져오게 변경
const dummyData = ref(mainPageDummy);
const personalizedSectionData = ref<MainPageBookCardSection>(
  dummyData.value.personalized,
);
const etcSectionData = ref<MainPageBookCardSection[]>(dummyData.value.etcList);

const bookCardSection = computed(() => [
  personalizedSectionData.value,
  ...etcSectionData.value,
]);

function getCategoryRoute(category: MainSectionCategory) {
  switch (category) {
    case "bestseller":
      return "/best-sellers?page=1";
    case "remarkable":
      return "/remakerable-new-books?page=1";
    default:
      console.error(`unknown category. category=(${category})`);
      return "";
  }
}

const isLoadingPersonalized = ref(false);
async function refreshPersonalizedBookList() {
  isLoadingPersonalized.value = true;
  try {
    // 3초 대기 (테스트용)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // TODO 실제 API로 교체
    const newBooks = mainPageChangeDummy.personalized.books;
    personalizedSectionData.value = {
      ...personalizedSectionData.value,
      books: newBooks,
    };
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingPersonalized.value = false;
  }
}
</script>

<template>
  <div>
    <div v-for="(section, idx) in bookCardSection" :key="idx" class="mb-8">
      <SectionHeader>
        <template #title>
          {{ section.title }}
          <Icon
            v-if="section.category === SectionCategory.Personalized"
            class="text-3xl cursor-pointer"
            name="line-md:cog-filled"
            @click="showPreferenceModal = true"
          />
        </template>

        <template #icon>
          <Icon
            v-if="section.category === SectionCategory.Personalized"
            :name="section.icon"
            class="text-4xl cursor-pointer"
            @click="refreshPersonalizedBookList"
          />
          <NuxtLink
            v-else
            :to="getCategoryRoute(section.category)"
            class="text-4xl cursor-pointer"
          >
            <Icon :name="section.icon" />
          </NuxtLink>
        </template>
      </SectionHeader>

      <!-- 로딩 중일 때 스켈레톤 표시 -->
      <div
        v-if="
          section.category === SectionCategory.Personalized &&
          isLoadingPersonalized
        "
        class="mt-4"
      >
        <Skeleton height="15rem" width="100%" />
      </div>

      <!-- 로딩 중이 아닐 때 또는 다른 섹션일 때 BookCard 표시 -->
      <div v-else>
        <div v-if="section.books.length === 0">
          <BookEmptyComponent />
        </div>
        <div
          v-else
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
        >
          <NuxtLink
            v-for="(book, bookIdx) in section.books"
            :key="bookIdx"
            :to="`/book/${book.id}`"
            class="cursor-pointer max-w-[180px] min-w-[140px] h-[270px] no-underline"
          >
            <BookCard>
              <template #image>
                <img
                  :alt="book.title"
                  :src="book.coverUrl"
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
    <BookPreferenceModal v-model:visible="showPreferenceModal" />
  </div>
</template>

<style scoped></style>
