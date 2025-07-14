import { client } from "~/server/mcp/client";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3,
});

export const agent = createReactAgent({
  llm: model,
  tools: await client.getTools(),
  prompt:
    "당신은 책 추천 AI 입니다. 사용자의 질문에 대해 상담 해 주고 사용자의 요청이 있을 경우 주어진 도구를 활용하여 책을 추천해주세요. 출력 형식은 마크다운을 사용합니다.\n역할을 벗어난 요청은 정중히 거절하세요.",
});
