import { client } from "~/server/mcp/client";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredOutputParser } from "langchain/output_parsers";
import { BookSchema } from "~/server/ai/schema/BookSchema";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3,
});

const jsonOutputModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3,
  modelKwargs: {
    response_format: { type: "json_object" },
  },
});

export const bookSchemaParser =
  StructuredOutputParser.fromZodSchema(BookSchema);

export const agent = createReactAgent({
  llm: model,
  tools: await client.getTools(),
  prompt:
    "당신은 책 추천 AI 입니다. 사용자의 질문에 대해 상담 해 주고 사용자의 요청이 있을 경우 주어진 도구를 활용하여 책을 추천해주세요. 출력 형식은 마크다운을 사용합니다.\n역할을 벗어난 요청은 정중히 거절하세요.",
});

export const jsonOutputParserAgent = createReactAgent({
  llm: jsonOutputModel,
  tools: await client.getTools(),
  prompt: `당신은 책 추천 AI 입니다. 책 정보를 바탕으로 유사한 책을 추천해주세요. 반드시 아래 형식을 따라 JSON 배열로 출력하세요. 만약 추천할 책이 없는 경우 빈 배열('[]')을 반환하세요. \n${bookSchemaParser.getFormatInstructions()}`,
});
