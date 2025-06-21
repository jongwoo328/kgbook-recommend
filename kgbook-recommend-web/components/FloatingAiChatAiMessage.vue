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
      <Icon class="text-2xl mr-2 mt-2" name="hugeicons:ai-chat-02" />
      <div class="flex-1">
        <MarkdownView :content="message.content" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
