import { bookSchemaParser, bookRecommendAgent } from "~/server/ai";
import { aladinClient } from "~/server/client";

export default defineEventHandler(
  async (event): Promise<RecommendBookItem[]> => {
    const itemId = getRouterParam(event, "itemId");
    if (!itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: "itemId is required.",
      });
    }

    try {
      const getBookItem = await aladinClient.lookupItem({
        itemId: itemId,
        itemIdType: "ItemId",
        cover: "Big",
      });

      if (!getBookItem.success) {
        throw Error(getBookItem.error.message);
      }

      const bookInfo = getBookItem.data.item[0];

      const message = `- 책 제목: ${bookInfo.title}\n- 작가: ${bookInfo.author}\n-카테고리: ${bookInfo.categoryName}\n- 책 설명: ${bookInfo.description};`;
      const result = await bookRecommendAgent.invoke({
        messages: [
          {
            role: "human",
            content: message,
          },
        ],
      });
      if (result.messages.length == 0) {
        throw Error("No response from the agent.");
      }

      const responseMessage = result.messages[result.messages.length - 1];
      const parsed = await bookSchemaParser.parse(responseMessage.text);

      return parsed.books;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch book recommend from Aladin.";
      throw createError({
        statusCode: 500,
        statusMessage: message,
      });
    }
  },
);
