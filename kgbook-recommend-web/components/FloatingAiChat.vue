<script lang="ts" setup>
import FloatingAiChatAiMessage from "~/components/FloatingAiChatAiMessage.vue";

const showCard = ref(false);
function toggleChatCard() {
  showCard.value = !showCard.value;
}

function onCloseClick() {
  showCard.value = false;
}

const messages = ref([
  {
    role: "ai",
    content:
      "안녕하세요! 책 추천을 도와드릴게요. 어떤 종류의 책을 찾고 계신가요?\n예를 들어, 소설, 비소설, 자기계발서 등 다양한 장르가 있습니다.",
  },
]);
const inputMessage = ref("");
function onEnter(e: KeyboardEvent) {
  if (e.shiftKey || e.isComposing) {
    return;
  } // 줄바꿈 허용
  e.preventDefault();
  if (!inputMessage.value.trim()) {
    return;
  } // 빈값 방지
  messages.value.push({
    role: "human",
    content: inputMessage.value,
  });
  messages.value.push({
    role: "ai",
    content: "아직 책 추천 기능은 구현되지 않았어요. 곧 추가할게요!",
  });
  inputMessage.value = "";
}
</script>

<template>
  <Teleport to="#__nuxt">
    <Button
      class="absolute bottom-10 right-10"
      size="small"
      @click="toggleChatCard"
    >
      <Icon name="hugeicons:ai-chat-02" />
      책 추천받기
    </Button>
    <ClientOnly>
      <Card
        v-show="showCard"
        :pt="{
          body: { class: 'flex-1 flex flex-col min-h-0' },
          content: { class: 'flex-1 min-h-0' },
        }"
        class="absolute bottom-20 right-10 w-[50vw] max-w-[40rem] h-[55rem] max-h-[80vh]"
      >
        <template #header>
          <div class="p-2 flex justify-end">
            <Button
              aria-label="Close"
              rounded
              severity="secondary"
              size="small"
              variant="outlined"
              @click="onCloseClick"
            >
              <template #icon>
                <Icon name="grommet-icons:close" />
              </template>
            </Button>
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6 overflow-auto h-[100%]">
            <template v-for="message in messages" :key="message.content">
              <FloatingAiChatAiMessage
                v-if="message.role === 'ai'"
                :message="message"
              />
              <FloatingAiChatHumanMessage
                v-else-if="message.role === 'human'"
                :message="message"
              />
            </template>
          </div>
        </template>
        <template #footer>
          <div class="rounded p-2 bg-gray-100">
            <div class="flex flex-col w-100 gap-2">
              <Textarea
                v-model="inputMessage"
                auto-resize
                class="max-h-32 textarea-overflow"
                rows="1"
                @keydown.enter="onEnter"
              />
              <div class="flex justify-end">
                <Button class="p-0" rounded size="small">
                  <template #icon>
                    <Icon name="iconoir:arrow-up" />
                  </template>
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </ClientOnly>
  </Teleport>
</template>

<style scoped>
.textarea-overflow {
  overflow: scroll !important;
}
</style>
