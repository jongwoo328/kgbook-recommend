import { getAgent } from "~/server/ai";

export default defineEventHandler(async (event): Promise<ChatResponse> => {
  const body = await readBody<ChatRequest>(event);
  const messageHistory = body.messagesBefore;

  const agent = await getAgent();
  const r = await agent.invoke({
    messages: messageHistory.concat({
      role: "human",
      content: body.message,
    }),
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
