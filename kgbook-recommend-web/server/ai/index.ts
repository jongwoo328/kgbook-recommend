import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { client } from "~/server/mcp/client";
import { ChatOpenAI } from "@langchain/openai";

const tools = await client.getTools();
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.3,
});

export const agent = createReactAgent({
  tools,
  llm: model,
});
