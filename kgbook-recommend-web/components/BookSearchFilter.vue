<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { BookInfo } from "~/types/BookInfo";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
import Button from "primevue/button";

const props = defineProps<{
  books: BookInfo[];
  modelValue: BookInfo[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: BookInfo[]): void;
}>();

const filterState = ref<{
  category: string[];
  publisher: string[];
  priceRange: [number, number];
  sortOption: { name: string; value: string };
}>({
  category: ["전체"],
  publisher: [],
  priceRange: [0, 100000],
  sortOption: { name: "정렬 없음", value: "default" },
});

const availableCategories = computed(() => [
  "전체",
  ...Array.from(new Set(props.books.map((book) => book.category))),
]);

const availablePublishers = computed(() => [
  ...Array.from(new Set(props.books.map((book) => book.publisher))),
]);

const sortOptions = ref([
  { name: "정렬 없음", value: "default" },
  { name: "가격 낮은순", value: "priceAsc" },
  { name: "가격 높은순", value: "priceDesc" },
  { name: "제목순", value: "titleAsc" },
  { name: "평점 높은순", value: "rankDesc" },
  { name: "최신순", value: "pubDateDesc" },
]);

const minAvailablePrice = computed(() =>
  props.books.length > 0 ? Math.min(...props.books.map((b) => b.price)) : 0,
);
const maxAvailablePrice = computed(() =>
  props.books.length > 0
    ? Math.max(...props.books.map((b) => b.price))
    : 100000,
);

watch(
  () => props.books,
  () => {
    filterState.value.priceRange = [
      minAvailablePrice.value,
      maxAvailablePrice.value,
    ];
  },
  { immediate: true },
);

function handleCategoryClick(category: string) {
  if (category === "전체") {
    filterState.value.category = ["전체"];
    return;
  }

  const selectedCategories = new Set(
    filterState.value.category.filter((c) => c !== "전체"),
  );

  if (selectedCategories.has(category)) {
    selectedCategories.delete(category);
  } else {
    selectedCategories.add(category);
  }

  if (selectedCategories.size === 0) {
    filterState.value.category = ["전체"];
  } else {
    filterState.value.category = Array.from(selectedCategories);
  }
}

const filteredBooks = computed(() => {
  let books = [...props.books];

  // 카테고리 필터
  if (
    filterState.value.category.length > 0 &&
    !filterState.value.category.includes("전체")
  ) {
    books = books.filter((book) =>
      filterState.value.category.includes(book.category),
    );
  }

  // 출판사 필터
  if (filterState.value.publisher.length > 0) {
    books = books.filter((book) =>
      filterState.value.publisher.includes(book.publisher),
    );
  }

  // 가격 필터
  books = books.filter(
    (book) =>
      book.price >= filterState.value.priceRange[0] &&
      book.price <= filterState.value.priceRange[1],
  );

  // 정렬
  const sortValue = filterState.value.sortOption.value;
  if (sortValue === "priceAsc") {
    books.sort((a, b) => a.price - b.price);
  } else if (sortValue === "priceDesc") {
    books.sort((a, b) => b.price - a.price);
  } else if (sortValue === "titleAsc") {
    books.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "rankDesc") {
    books.sort((a, b) => b.customerReviewRank - a.customerReviewRank);
  } else if (sortValue === "pubDateDesc") {
    books.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );
  }

  return books;
});

watch(
  filteredBooks,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { immediate: true },
);

function resetFilters() {
  filterState.value.category = ["전체"];
  filterState.value.publisher = [];
  filterState.value.sortOption = sortOptions.value[0];
  filterState.value.priceRange = [
    minAvailablePrice.value,
    maxAvailablePrice.value,
  ];
}
</script>

<template>
  <div class="p-4 border rounded-lg shadow-sm my-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 카테고리 필터 -->
      <div class="flex flex-col gap-2 md:col-span-2">
        <label class="font-semibold text-gray-700 dark:text-gray-300">
          카테고리
        </label>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="category in availableCategories"
            :key="category"
            :class="[
              'p-button-sm',
              filterState.category.includes(category)
                ? 'p-button-primary'
                : 'p-button-secondary p-button-outlined',
            ]"
            :label="category"
            @click="handleCategoryClick(category)"
          />
        </div>
      </div>

      <!-- 출판사 필터 -->
      <div class="flex flex-col gap-2">
        <label
          class="font-semibold text-gray-700 dark:text-gray-300"
          for="publisher-filter"
        >
          출판사
        </label>
        <MultiSelect
          v-model="filterState.publisher"
          :max-selected-labels="5"
          :options="availablePublishers"
          class="w-full text-gray-600 dark:text-gray-400"
          filter
          placeholder="출판사 선택 (다중 선택 가능)"
        />
      </div>

      <!-- 정렬 옵션 -->
      <div class="flex flex-col gap-2">
        <label
          class="font-semibold text-gray-700 dark:text-gray-300"
          for="sort-filter"
        >
          정렬
        </label>
        <Dropdown
          v-model="filterState.sortOption"
          :options="sortOptions"
          class="w-full text-gray-600 dark:text-gray-400"
          option-label="name"
          placeholder="정렬 기준 선택"
        />
      </div>

      <!-- 가격 범위 -->
      <div class="flex flex-col gap-2">
        <label class="font-semibold text-gray-700 dark:text-gray-300"
          >가격 범위</label
        >
        <div class="flex items-center gap-2">
          <InputNumber
            v-model="filterState.priceRange[0]"
            :max="maxAvailablePrice"
            :min="minAvailablePrice"
            class="w-full text-gray-600 dark:text-gray-400"
            currency="KRW"
            locale="ko-KR"
            mode="currency"
          />
          <span class="text-gray-500">-</span>
          <InputNumber
            v-model="filterState.priceRange[1]"
            :max="maxAvailablePrice"
            :min="minAvailablePrice"
            class="w-full text-gray-600 dark:text-gray-400"
            currency="KRW"
            locale="ko-KR"
            mode="currency"
          />
        </div>
        <Slider
          v-model="filterState.priceRange"
          :max="maxAvailablePrice"
          :min="minAvailablePrice"
          class="mt-2"
          range
        />
      </div>
    </div>
    <div class="mt-4 flex justify-between items-center">
      <div class="mt-4 text-right text-gray-600 dark:text-gray-400">
        <p>현재 페이지 기준 선택 결과: {{ filteredBooks.length }}건</p>
      </div>
      <Button
        class="p-button-secondary rounded"
        icon="pi pi-refresh"
        label="필터 초기화"
        @click="resetFilters"
      >
        <template #icon>
          <Icon class="text-xl mr-2" name="hugeicons:refresh" />
        </template>
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
