import { chatAgent } from "~/server/ai";
import {
  isAIMessage,
  isBaseMessage,
  isToolMessage,
} from "@langchain/core/messages";

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

    const stream = await chatAgent.stream(
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
      { streamMode: "values" },
    );

    let lastState = null;
    let toolCallCount = 0;

    for await (const state of stream) {
      if (event.node.res.destroyed) {
        break;
      }

      // 새로운 메시지가 추가되었는지 확인
      if (lastState && state.messages) {
        const lastMessages = lastState.messages || [];
        const currentMessages = state.messages;

        if (currentMessages.length > lastMessages.length) {
          const newMessage = currentMessages[currentMessages.length - 1];

          // 생각 과정 추적
          if (
            isBaseMessage(newMessage) &&
            !isToolMessage(newMessage) &&
            newMessage.response_metadata?.finish_reason !== "stop"
          ) {
            event.node.res.write(
              `data: ${JSON.stringify({
                type: "thinking",
                content:
                  newMessage.content || "응답을 생성하기 위해 생각 중입니다...",
              })}\n\n`,
            );
          }

          // Tool call 추적
          if (
            isBaseMessage(newMessage) &&
            isAIMessage(newMessage) &&
            Array.isArray(newMessage.tool_calls) &&
            newMessage.tool_calls.length > 0
          ) {
            toolCallCount++;
            const message = newMessage.tool_calls[0]?.name
              ? `${newMessage.tool_calls[0].name} 도구를 사용하여 필요한 정보를 가져오고 있습니다.`
              : "";
            event.node.res.write(
              `data: ${JSON.stringify({
                type: "thinking",
                content: message,
                toolCallCount: toolCallCount,
              })}\n\n`,
            );
          }

          // 최종 응답 감지: finish_reason이 'stop'인 AIMessage
          if (
            isAIMessage(newMessage) &&
            !isToolMessage(newMessage) &&
            newMessage.response_metadata?.finish_reason === "stop" &&
            newMessage.content
          ) {
            // 스트리밍인 척
            const content = newMessage.content;
            const chunkSize = 10;

            for (let i = 0; i < content.length; i += chunkSize) {
              if (event.node.res.destroyed) break;

              const chunk = content.slice(i, i + chunkSize);

              event.node.res.write(
                `data: ${JSON.stringify({
                  type: "chunk",
                  content: chunk,
                })}\n\n`,
              );
            }

            // 스트림 완료 신호
            event.node.res.write(
              `data: ${JSON.stringify({
                type: "done",
                finalText: content,
                toolCallCount: toolCallCount,
              })}\n\n`,
            );

            break;
          }
        }
      }

      lastState = state;
    }
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
