import { agent } from "~/server/ai";

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event);

  const r = await agent.invoke({
    messages: body.messagesBefore.concat({
      role: "user",
      content: body.message,
    }),
  });
  console.log(r);
  return {};
});
