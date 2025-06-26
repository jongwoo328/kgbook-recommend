<script lang="ts" setup>
const props = defineProps<{ showTitle: boolean; title?: string }>();

const titleText = computed(() => props.title ?? "개인 맞춤 추천을 받아보세요.");

function goToBookTasteTestPage() {
  console.log(`@@ goToBookTasteTestPage.)`);
}
</script>

<template>
  <div class="footer text-center mt-10 pb-10">
    <h2 v-if="props.showTitle" class="py-3 font-bold text-2xl">
      {{ titleText }}
    </h2>
    <p class="py-3">
      간단한 질문을 통해 여러분의 독서 취향을 파악하고, AI가 분석한 책 추천을
      받아보세요.
    </p>
    <Button class="mt-3" label="지금 시작하기" @click="goToBookTasteTestPage" />
  </div>
</template>

<style scoped></style>
