<script lang="ts" setup>
defineProps<{
  message: {
    content: string;
  };
}>();
</script>

<template>
  <div class="flex flex-end bg-gray-50 ml-10 p-4">
    <pre class="text-gray-800">{{ message.content }}</pre>
  </div>
</template>

<style scoped></style>
