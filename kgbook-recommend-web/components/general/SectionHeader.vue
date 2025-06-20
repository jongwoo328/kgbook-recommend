<script lang="ts" setup></script>

<template>
  <div
    class="flex items-center justify-between font-bold border-b-2 border-black px-2 py-3"
  >
    <span class="text-3xl flex items-center gap-1">
      <slot name="title">제목 없음</slot>
    </span>
    <span class="text-3xl">
      <slot name="icon" />
    </span>
  </div>
</template>

<style scoped></style>
