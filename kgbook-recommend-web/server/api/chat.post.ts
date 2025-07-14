import { agent } from "~/server/ai";
import type { ChatRequest } from "#shared/types/request";

export default defineEventHandler(async (event): Promise<ChatResponse> => {
  const body = await readBody<ChatRequest>(event);
  const messageHistory = body.messagesBefore;

  const userContextSysemMessage = `현재 유저가 사용중인 화면에 표시되는 데이터와 유저의 정보입니다.
- 현재 유저 화면에 표시되는 데이터
${body.context?.dataInDisplay ?? "없음"}
- 유저 정보
\t직업: ${body.context?.userPreferences?.job ?? "설정하지 않음"}
\t관심분야: ${body.context?.userPreferences?.interests?.toString() ?? "설정하지 않음"}
\t독서 시간: ${body.context?.userPreferences?.readTime ?? "설정하지 않음"}
\t독서 스타일: ${body.context?.userPreferences?.style?.toString() ?? "설정하지 않음"}
\t최근 읽은 책: ${body.context?.userPreferences?.recentBook ?? "설정하지 않음"}`;

  const r = await agent.invoke({
    messages: messageHistory.concat([
      {
        role: "system",
        content: userContextSysemMessage,
      },
      {
        role: "human",
        content: body.message,
      },
    ]),
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
