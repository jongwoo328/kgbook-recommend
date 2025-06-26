<script lang="ts" setup>
defineProps<{
  message: {
    content: string;
  };
}>();
</script>

<template>
  <div class="flex flex-end bg-gray-50 dark:bg-gray-700 ml-10 p-4 rounded-lg">
    <pre class="text-gray-800 dark:text-slate-200">{{ message.content }}</pre>
  </div>
</template>

<style scoped></style>
