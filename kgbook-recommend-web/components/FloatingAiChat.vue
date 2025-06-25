<script lang="ts" setup>
import FloatingAiChatAiMessage from "~/components/FloatingAiChatAiMessage.vue";
import FloatingAiChatTemplateButton from "~/components/FloatingAiChatTemplateButton.vue";
import GradientButton from "~/components/GradientButton.vue";

const showCard = ref(false);
function toggleChatCard() {
  showCard.value = !showCard.value;
  if (showCard.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
}

function onCloseClick() {
  showCard.value = false;
}

const messages = ref([
  {
    role: "ai",
    content:
      "# h1 제목\n" +
      "## h2 제목\n" +
      "### h3 제목\n" +
      "**굵은 글씨**\n" +
      "*기울임 글씨*\n" +
      "`인라인 코드`\n" +
      "```javascript\n" +
      "console.log('Hello, world!');\n" +
      "```\n" +
      "- 리스트 아이템 1\n" +
      "- 리스트 아이템 2\n\n" +
      "[링크 텍스트](https://example.com)\n" +
      "![이미지 설명](https://via.placeholder.com/150)\n" +
      "> 인용문\n" +
      "1. 순서 있는 리스트 아이템 1\n" +
      "2. 순서 있는 리스트 아이템 2\n\n" +
      "안녕하세요! 책 추천을 도와드릴게요. 어떤 종류의 책을 찾고 계신가요?\n예를 들어, 소설, 비소설, 자기계발서 등 다양한 장르가 있습니다.",
  },
]);
const inputMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const spacer = ref<HTMLElement | null>(null);
const messageElements = ref<ComponentPublicInstance[]>([]);

function onEnter(e: KeyboardEvent) {
  if (e.shiftKey || e.isComposing) {
    return;
  } // 줄바꿈 허용
  e.preventDefault();

  submit();
}

function submit() {
  if (!inputMessage.value.trim()) {
    return;
  } // 빈값 방지
  messages.value.push({
    role: "human",
    content: inputMessage.value,
  });
  messages.value.push({
    content: "아직 책 추천 기능은 구현되지 않았어요. 곧 추가할게요!",
    role: "ai",
  });
  inputMessage.value = "";

  requestAnimationFrame(() => {
    if (messagesContainer.value) {
      if (spacer.value) {
        spacer.value.style.minHeight = `${messagesContainer.value.clientHeight}px`;
      }

      scrollToBottom();
    }
  });
}

function scrollToBottom() {
  const lastHumanIdx = messages.value.map((m) => m.role).lastIndexOf("human");

  if (lastHumanIdx !== -1 && messageElements.value[lastHumanIdx]?.$el) {
    // 사용자 메시지가 있으면 거기로 스크롤
    messageElements.value[lastHumanIdx].$el.scrollIntoView({
      behavior: "smooth",
    });
  } else {
    // 사용자 메시지가 없으면 전체 컨테이너의 맨 아래로 스크롤
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: "smooth",
      });
    }
  }
}

function onClickTemplate(content: string) {
  inputMessage.value = content;
}
</script>

<template>
  <Teleport to="#__nuxt">
    <GradientButton
      :border-radius="16"
      :border-width="1"
      bg-color="#FFF"
      class="absolute bottom-10 right-10 px-5 py-3 text-xl dark:text-slate-100"
      @click="toggleChatCard"
    >
      <Icon class="mr-2" name="humbleicons:ai" />
      책 추천받기
    </GradientButton>
    <ClientOnly>
      <Card
        v-show="showCard"
        :pt="{
          body: { class: 'flex-1 flex flex-col min-h-0' },
          content: { class: 'flex-1 min-h-0' },
        }"
        class="absolute bottom-28 right-10 w-[60vw] max-w-[55rem] h-[55rem] max-h-[85vh] border border-slate-100 shadow-lg shadow-slate-300"
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
          <div
            ref="messagesContainer"
            class="flex flex-col gap-6 overflow-auto h-[100%] min-h-0"
          >
            <template v-for="message in messages" :key="message.content">
              <!--TODO key 수정할 것 -->
              <FloatingAiChatAiMessage
                v-if="message.role === 'ai'"
                ref="messageElements"
                :message="message"
              />
              <FloatingAiChatHumanMessage
                v-else-if="message.role === 'human'"
                ref="messageElements"
                :message="message"
              />
            </template>
            <div ref="spacer" />
          </div>
        </template>
        <template #footer>
          <div class="rounded p-2 bg-gray-50 dark:bg-gray-800">
            <div class="flex flex-col w-100 gap-2">
              <Textarea
                v-model="inputMessage"
                auto-resize
                class="max-h-32 textarea-overflow"
                rows="1"
                @keydown.enter="onEnter"
              />
              <div class="flex justify-between items-center">
                <div class="flex gap-2">
                  <FloatingAiChatTemplateButton
                    label="최근 읽은책으로 추천받기"
                    @click="onClickTemplate('예시 내용')"
                  />
                  <FloatingAiChatTemplateButton
                    label="나의 직무 기반으로 추천받기"
                    @click="onClickTemplate('예시 내용2')"
                  />
                </div>
                <Button class="p-0" rounded size="small" @click="submit">
                  <template #icon>
                    <Icon class="dark:text-slate-200" name="iconoir:arrow-up" />
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
