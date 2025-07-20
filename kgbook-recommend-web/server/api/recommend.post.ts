import { bookSchemaParser, jsonOutputParserAgent } from "~/server/ai";

export default defineEventHandler(
  async (event): Promise<RecommendBookResponse> => {
    const body = await readBody<RecommendRequest>(event);
    const { message } = body;
    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: "message is required.",
      });
    }

    const r = await jsonOutputParserAgent.invoke({
      messages: [
        {
          role: "human",
          content: message,
        },
      ],
    });
    if (r.messages.length == 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "No response from the agent.",
      });
    }

    const responseMessage = r.messages[r.messages.length - 1];
    const parsed = await bookSchemaParser.parse(responseMessage.text);

    return {
      response: parsed.books,
    };
  },
);
