import { agent } from "~/server/ai";
import type { ChatRequest } from "~/shared/types/request";

export default defineEventHandler(async (event): Promise<ChatResponse> => {
  const body = await readBody<ChatRequest>(event);
  const messageHistory = body.messagesBefore;

  const r = await agent.invoke({
    messages: messageHistory,
  });
  if (r.messages.length == 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "No response from the agent.",
    });
  }

  const responseMessage = r.messages[r.messages.length - 1];

  return {
    response: responseMessage.text,
  };
});
