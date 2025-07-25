import { aladinClient } from "../client";
import type { SearchItemResponse } from "aladin-client";

export default defineEventHandler(
  async (event): Promise<SearchItemResponse> => {
    const body = await readBody<BookSearchRequest>(event);
    const { query, queryType, categoryId, sort, page, size } = body;
    if (!query || !queryType) {
      throw createError({
        statusCode: 400,
        statusMessage: "type, queryType is required.",
      });
    }

    try {
      const result = await aladinClient.searchItems({
        query,
        queryType,
        categoryId,
        sort,
        start: page,
        maxResults: size,
        cover: "Big",
      });
      if (!result.success) {
        throw Error(result.error.message);
      }

      return result.data;
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
