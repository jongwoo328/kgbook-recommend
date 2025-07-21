<script lang="ts" setup></script>

<template>
  <div class="flex flex-col items-center w-full">
    <!-- 이미지 영역 -->
    <div class="w-[150px] h-[150px] flex items-center justify-center">
      <slot name="image" />
    </div>

    <!-- 텍스트 영역 -->
    <div class="mt-2 text-center text-sm w-full">
      <slot name="info" />
    </div>
  </div>
</template>

<style scoped></style>
