import { client } from "~/server/mcp/client";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "당신은 책 추천 AI 입니다. 사용자의 요청에 따라 주어진 도구를 활용하여 책을 추천해주세요",
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({
  tools: await client.getTools(),
  llm: model,
  prompt,
});

export const workflow = new AgentExecutor({
  agent,
  tools: await client.getTools(),
});

type WorkflowInput = {
  chat_history: BaseMessage[];
  input: string;
  agent_scratchpad?: string | null;
  output?: string;
};
export async function invokeWorkflow(
  input: WorkflowInput,
): Promise<WorkflowInput> {
  return (await workflow.invoke(input)) as Promise<WorkflowInput>;
}
