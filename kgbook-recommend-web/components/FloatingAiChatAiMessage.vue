<script lang="ts" setup>
defineProps<{
  message: {
    thinking: string;
    content: string;
  };
  loading: boolean;
}>();
</script>

<template>
  <div>
    <div class="flex">
      <Icon class="text-2xl mr-2 mt-2" name="hugeicons:ai-chat-02" />
      <div v-if="loading" class="flex-1 flex items-center">
        <Icon class="text-3xl" name="eos-icons:bubble-loading" />
      </div>
      <div
        v-else-if="!loading && message.thinking && !message.content"
        class="flex-1 pl-[.5rem]"
      >
        <!--  생각 과정은 기울임체로 표시  -->
        <MarkdownView
          :content="`*${message.thinking}*`"
          class="p-2 dark:bg-[#121212] rounded-lg"
        />
      </div>
      <div v-else-if="!loading && message.content" class="flex-1 pl-[.5rem]">
        <MarkdownView
          :content="message.content"
          class="p-2 dark:bg-[#121212] rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
