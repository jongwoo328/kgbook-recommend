<script lang="ts" setup>
import FloatingAiChatAiMessage from "~/components/FloatingAiChatAiMessage.vue";
import FloatingAiChatTemplateButton from "~/components/FloatingAiChatTemplateButton.vue";
import GradientButton from "~/components/general/GradientButton.vue";
import api from "~/api";

const { userPreference, userPreferenceWithSplitInterest } = usePreference();
const contextStore = useContextStore();

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

const messages = ref<{ role: string; content: string }[]>([]);
function resetMessages() {
  let startMessage =
    "안녕하세요! 책 추천을 도와드릴게요. 어떤 종류의 책을 찾고 계신가요?";
  let availableDataList = "";
  if (userPreference.value.isSubmitted) {
    if (userPreference.value.user.job) {
      availableDataList += "- 직무\n";
    }
    if (userPreference.value.user.interests.length > 0) {
      availableDataList += "- 관심사\n";
    }
    if (userPreference.value.user.readTime) {
      availableDataList += "- 독서 시간\n";
    }
    if (userPreference.value.user.style.length > 0) {
      availableDataList += "- 독서 스타일\n";
    }
    if (userPreference.value.user.recentBook) {
      availableDataList += "- 최근 읽은 책\n";
    }
  }
  if (availableDataList) {
    startMessage +=
      "\n\n제가 현재 참고할 수 있는 정보는 아래와 같습니다.\n" +
      availableDataList;
  }
  messages.value = [
    {
      role: "ai",
      content: startMessage,
    },
  ];
}

resetMessages();
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

const submitted = ref(false);
const loading = ref(false);
function submit() {
  submitted.value = true;

  if (!inputMessage.value.trim()) {
    return;
  } // 빈값 방지

  const userMessage = {
    role: "human",
    content: inputMessage.value,
  };

  // 사용자 메시지를 먼저 추가
  messages.value.push(userMessage);
  inputMessage.value = "";
  scheduleScroll();

  // AI 응답을 위한 빈 메시지 추가
  messages.value.push({
    role: "ai",
    content: "",
  });

  loading.value = true;

  // SSE 요청 생성
  const messageHistory = [...messages.value];
  messageHistory.pop(); // 마지막 빈 AI 메시지 제거

  api
    .chatStream({
      message: inputMessage.value,
      messagesBefore: messages.value,
      context: {
        ...contextStore.context,
        userPreferences: userPreferenceWithSplitInterest.value,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is not available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      async function readStream(): Promise<void> {
        return reader.read().then(({ done, value }) => {
          if (done) {
            loading.value = false;
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = JSON.parse(line.slice(6));

            switch (data.type) {
              case "chunk":
                if (data.content === "") {
                  continue; // 빈 내용은 무시
                }
                loading.value = false;
                messages.value[messages.value.length - 1].content +=
                  data.content;
                scheduleScroll();
                break;
              case "done":
                loading.value = false;
                break;
              case "error":
                throw new Error(data.message);
            }
          }
          return readStream();
        });
      }
      return readStream();
    })
    .catch((error) => {
      console.error("Error during chat API call:", error);
      messages.value[messages.value.length - 1].content =
        "죄송합니다. 책 추천 기능에 문제가 발생했어요. 나중에 다시 시도해주세요.";
      loading.value = false;
    })
    .finally(() => (submitted.value = false));
}

let scrollTimer: number | undefined;
function scheduleScroll() {
  if (scrollTimer) cancelAnimationFrame(scrollTimer);
  scrollTimer = requestAnimationFrame(() => nextTick(scrollToBottom));
}

function scrollToBottom() {
  const lastIdx = messages.value.length - 1;
  const el = messageElements.value[lastIdx]?.$el;

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  } else if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
}

function onClickTemplate(content: string) {
  inputMessage.value = content;
}

function startNewChat() {
  resetMessages();
  inputMessage.value = "";
  loading.value = false;
}

const templateDataList = ref([
  {
    id: 1,
    iconLeft: "tabler:book",
    label: "최근 읽은책으로 추천받기",
    content: () => "최근 읽은 책을 보고 새로운 책을 추천해 주세요.",
  },
  {
    id: 2,
    iconLeft: "hugeicons:job-search",
    label: "나의 직무 기반으로 추천받기",
    content: () => "제 직무에 맞는 책을 추천받고 싶어요.",
  },
  {
    id: 3,
    iconLeft: "uil:favorite",
    label: "나의 관심사 기반으로 추천받기",
    content: () => "제 관심사에 맞는 책을 추천해 주세요.",
  },
]);
</script>

<template>
  <Teleport to="#__nuxt">
    <GradientButton
      :border-radius="24"
      :border-width="2"
      bg-color="#FFF"
      class="fixed bottom-10 w-48 h-16 right-10 px-5 py-3 text-2xl dark:text-slate-100"
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
          header: { class: 'bg-[#0d948821]' },
        }"
        class="fixed bottom-28 right-10 w-[60vw] max-w-[55rem] h-[55rem] max-h-[85vh] border border-slate-400 shadow-lg shadow-slate-300"
      >
        <template #header>
          <div class="p-2 flex justify-between items-center">
            <Button
              class="rounded-md"
              severity="primary"
              size="small"
              variant="outlined"
              @click="startNewChat"
            >
              새 채팅 시작
            </Button>
            <Button
              aria-label="Close"
              class="border-none"
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
            <template v-for="(message, idx) in messages" :key="idx">
              <FloatingAiChatAiMessage
                v-if="message.role === 'ai'"
                ref="messageElements"
                :loading="loading && idx === messages.length - 1"
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
                <div class="flex gap-2 flex-wrap">
                  <FloatingAiChatTemplateButton
                    v-for="templateData in templateDataList"
                    :key="templateData.id"
                    :icon-left="templateData.iconLeft"
                    :label="templateData.label"
                    @click="onClickTemplate(templateData.content())"
                  />
                </div>
                <Button
                  :disabled="submitted"
                  class="p-0 flex-shrink-0 self-start"
                  rounded
                  size="small"
                  @click="submit"
                >
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
