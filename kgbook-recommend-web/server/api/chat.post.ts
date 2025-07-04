import { invokeWorkflow } from "~/server/ai";
import type { ChatRequest } from "~/shared/types/request";
import { ChatMessage } from "@langchain/core/messages";

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event);
  const messageHistory = body.messagesBefore;
  if (messageHistory.length === 0) {
    messageHistory.push(
      new ChatMessage({
        role: "system",
        content:
          "당신은 책 추천 AI 입니다. 사용자의 요청에 따라 주어진 도구를 활용하여 책을 추천해주세요. 답변은 마크다운 형식을 사용합니다.", // TODO 수정
      }),
    );
  }
  const r = await invokeWorkflow({
    input: body.message,
    chat_history: messageHistory.map((msg) => {
      return new ChatMessage({
        role: msg.role,
        content: msg.content,
      });
    }),
    agent_scratchpad: null,
  });

  return {
    response: r.output,
  };
});
