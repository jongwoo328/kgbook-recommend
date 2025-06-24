<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useRoute } from "#vue-router";
import { SectionCategory } from "~/types/SectionCategory";
import SectionHeader from "~/components/general/SectionHeader.vue";
import BookCard from "~/components/general/BookCard.vue";
import BookEmptyComponent from "~/components/general/BookEmptyComponent.vue";
import { dummyBookList2 } from "~/data/dummy";

const router = useRouter();

const route = useRoute();

type CategoryType = (typeof SectionCategory)[keyof typeof SectionCategory];
const props = defineProps<{
  category: CategoryType;
}>();

const pageTitle = computed(() => {
  switch (props.category) {
    case SectionCategory.Bestseller:
      return "BestSellers";
    case SectionCategory.Remarkable:
      return "Remarkable New Books";
    default:
      console.error(`Unknown category: ${props.category}`);
      return "Book List";
  }
});

// TODO api 호출 시에는 0부터 시작되게 해야겠지?
const currentPage = ref<number>(Number(route.query.page) || 1);
const perPageOptions = ref<number[]>([10, 20, 30, 50, 100]);

// TODO 현재는 더미데이터. 추후 통신으로 가져오게 변경
// const books = ref([]);
const books = ref(dummyBookList2);

function goToBookDetailPage(book) {
  router.push(`/book/${book.id}`);
}
</script>

<template>
  <div>
    <SectionHeader>
      <template #title> {{ pageTitle }} ({{ books.length }}) </template>
    </SectionHeader>

    <div v-if="books.length === 0">
      <BookEmptyComponent />
    </div>
    <div v-else>
      <div
          class="max-w-full min-h-[20rem] flex flex-wrap gap-3 mt-4 items-center justify-around"
      >
        <BookCard
          v-for="(book, idx) in books"
          :key="idx"
          :book="book"
          class="cursor-pointer max-w-[320px] min-w-[200px] h-[450px]"
          @click.native="goToBookDetailPage(book)"
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
      <div class="card mt-2">
        <Paginator
          v-model:first="currentPage"
          :rows="10"
          :rowsPerPageOptions="perPageOptions"
          :totalRecords="books.length"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
