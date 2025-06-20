<script lang="ts" setup></script>

<template>
  <div class="flex flex-col items-center">
    <!-- 이미지 영역 -->
    <div
      class="bg-gray-300 w-full aspect-square flex items-center justify-center"
    >
      <slot name="image">Image Placeholder</slot>
    </div>

    <!-- 텍스트 영역 -->
    <div class="mt-2 text-center text-sm">
      <slot name="info">책이름 / 저자 (가격)</slot>
    </div>
  </div>
</template>

<style scoped></style>
