<script lang="ts" setup>
defineProps<{
  label: string;
  iconLeft: string;
}>();
</script>

<template>
  <div
    class="max-w-sm cursor-pointer rounded-lg border-[0.1rem] border-slate-300 bg-slate-50 transition-colors hover:border-teal-600 dark:border-slate-300/20 dark:bg-gray-700 dark:hover:border-teal-600"
  >
    <div class="flex w-full items-center justify-between px-2 py-2">
      <div
        class="flex items-center justify-start gap-2 text-slate-900 dark:text-slate-200"
      >
        <Icon :name="iconLeft" />
        <span class="inline-flex text-sm tracking-wide">{{ label }}</span>
      </div>
      <div class="text-slate-900 dark:text-slate-200">
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" stroke="none" />
          <path d="M5 12l14 0" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
