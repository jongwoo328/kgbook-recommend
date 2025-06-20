<script lang="ts" setup>
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import { SectionCategory } from "~/types/SectionCategory";
import { mainPageChangeDummy, mainPageDummy } from "~/data/dummy";

import { useRouter } from "vue-router";

const router = useRouter();

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

function goToBookListPage(category: MainSectionCategory) {
  switch (category) {
    case "bestseller":
      router.push("/best-sellers");
      return;
    case "remarkable":
      router.push("/remakerable-new-books");
      return;
    default:
      console.error(`unknown category. category=(${category})`);
      return;
  }
}

function goToBookDetailPage(book: Book) {
  router.push(`/book/${book.id}`);
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
            v-if="section.showTooltip"
            v-tooltip.top="{
              value: section.tooltipInfo.message,
            }"
            :name="section.tooltipInfo.icon"
            class="text-2xl"
          />
        </template>

        <template #icon>
          <Icon
            v-if="section.category === SectionCategory.Personalized"
            :name="section.icon"
            class="text-4xl cursor-pointer"
            @click="refreshPersonalizedBookList"
          />
          <Icon
            v-else
            :name="section.icon"
            class="text-4xl cursor-pointer"
            @click="goToBookListPage(section.category)"
          />
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
      <div
        v-else
        class="max-w-full min-h-[20rem] flex flex-wrap gap-5 mt-4 items-center justify-center"
      >
        <BookCard
          v-for="(book, idx) in section.books"
          :key="idx"
          class="cursor-pointer"
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
