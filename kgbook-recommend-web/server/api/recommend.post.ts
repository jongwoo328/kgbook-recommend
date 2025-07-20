import { bookSchemaParser, jsonOutputParserAgent } from "~/server/ai";

export default defineEventHandler(
  async (event): Promise<RecommendBookResponse> => {
    const body = await readBody<RecommendRequest>(event);
    const { title, author, category, description } = body;

    if (!title || !author || !category || !description) {
      throw createError({
        statusCode: 400,
        statusMessage: "title, author, category, description are required.",
      });
    }

    const message = `- 책 제목: ${title}\n- 작가: ${author}\n-카테고리: ${category}\n- 책 설명: ${description};`;
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
