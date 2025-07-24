import { aladinClient } from "../../client";
import type { ListItem, ListItemResponse } from "aladin-client";

export default defineEventHandler(
  async (event): Promise<ListItemResponse<ListItem>> => {
    const query = getQuery(event);

    const allowedTypes: BookListQueryType[] = ["ItemNewSpecial", "Bestseller"];
    if (!allowedTypes.includes(query.type as BookListQueryType)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Invalid query type. only 'ItemNewSpecial' or 'Bestseller'",
      });
    }

    try {
      const result = await aladinClient.listItems({
        queryType: query.type,
        searchTarget: "Book",
        start: query.page || 1,
        maxResults: query.size || 10,
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
          : `Failed to fetch book list for ${query.type} from Aladin.`;
      throw createError({
        statusCode: 500,
        statusMessage: message,
      });
    }
  },
);
