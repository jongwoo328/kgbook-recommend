import { agent } from "~/server/ai";
import { isAIMessage, isToolMessage } from "@langchain/core/messages";

export default defineEventHandler(async (event): Promise<void> => {
  const body = await readBody<ChatRequest>(event);
  const messageHistory = body.messagesBefore;

  // SSE 헤더 설정
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");
  setHeader(event, "Access-Control-Allow-Origin", "*");

  const userContextSystemMessage = `현재 유저가 사용중인 화면에 표시되는 데이터와 유저의 정보입니다.
- 현재 유저 화면에 표시되는 데이터
${JSON.stringify(body.context?.dataInDisplay)};
- 유저 정보
\t직업: ${body.context?.userPreferences?.job ?? "설정하지 않음"}
\t관심분야: ${body.context?.userPreferences?.interests?.toString() ?? "설정하지 않음"}
\t독서 시간: ${body.context?.userPreferences?.readTime ?? "설정하지 않음"}
\t독서 스타일: ${body.context?.userPreferences?.style?.toString() ?? "설정하지 않음"}
\t최근 읽은 책: ${body.context?.userPreferences?.recentBook ?? "설정하지 않음"}`;

  try {
    event.node.res.write(
      `data: ${JSON.stringify({
        type: "start",
      })}\n\n`,
    );

    const stream = await agent.stream(
      {
        messages: messageHistory.concat([
          {
            role: "system",
            content: userContextSystemMessage,
          },
          {
            role: "human",
            content: body.message,
          },
        ]),
      },
      { streamMode: "messages" },
    );

    let fullText = "";
    for await (const [message] of stream) {
      if (event.node.res.destroyed) {
        break;
      }

      if (isAIMessage(message) && Array.isArray(message.tool_call_chunks) && message.tool_call_chunks.length > 0) {
        event.node.res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: "",
            toolCalls: message.tool_call_chunks[0]?.name ?? "",
          })}\n\n`,
        );
      } else if (isAIMessage(message) && !isToolMessage(message)) {
        fullText += message.content;
        event.node.res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: message.content,
            toolCalls: "",
          })}\n\n`,
        );
      }
    }

    // 스트림 완료 신호
    event.node.res.write(
      `data: ${JSON.stringify({
        type: "done",
        finalText: fullText,
      })}\n\n`,
    );
  } catch (error) {
    console.error("SSE Error:", error);

    event.node.res.write(
      `data: ${JSON.stringify({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      })}\n\n`,
    );
  } finally {
    try {
      if (!event.node.res.destroyed) {
        event.node.res.end();
      }
    } catch (e) {
      console.error("Error closing SSE connection:", e);
    }
  }
});
