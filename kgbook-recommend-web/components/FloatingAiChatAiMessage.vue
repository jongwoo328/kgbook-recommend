<script lang="ts" setup>
defineProps<{
  message: {
    content: string;
  };
}>();
</script>

<template>
  <div>
    <div class="flex">
      <Icon class="text-2xl mr-2" name="hugeicons:ai-chat-02" />
      <div class="flex-1">
        <pre class="text-gray-800">{{ message.content }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
