import type { ChatMessage } from "@langchain/core/messages";

type ChatRequest = {
  message: string;
  messagesBefore: ChatMessage[];
};
