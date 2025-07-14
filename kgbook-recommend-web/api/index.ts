import type { ChatRequest } from "#shared/types/request";

const commonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export default {
  chat: (body: ChatRequest) => {
    return $fetch<ChatResponse>("/api/chat", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
};
