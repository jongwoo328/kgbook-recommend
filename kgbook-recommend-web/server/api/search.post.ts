import { aladinClient } from "../client";
import type { SearchItem } from "aladin-client";

export default defineEventHandler(
  async (event): Promise<{ response: SearchItem[] }> => {
    const body = await readBody<BookSearchRequest>(event);
    const { query, queryType, categoryId, sort } = body;
    if (!query || !queryType) {
      throw createError({
        statusCode: 400,
        statusMessage: "type, queryType is required.",
      });
    }

    try {
      const request = {
        query,
        queryType,
        categoryId,
        sort,
      };
      const result = await aladinClient.searchItems(request);
      if (!result.success) {
        throw Error(result.error.message);
      }

      return {
        response: result.data.item,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch book search from Aladin.";
      throw createError({
        statusCode: 500,
        statusMessage: message,
      });
    }
  },
);
