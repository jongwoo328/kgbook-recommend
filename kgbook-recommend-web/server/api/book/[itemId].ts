import { aladinClient } from "../../client";
import type { LookupItemResponse } from "aladin-client";

export default defineEventHandler(
  async (event): Promise<LookupItemResponse> => {
    const itemId = getRouterParam(event, "itemId");
    if (!itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: "itemId is required.",
      });
    }

    try {
      const result = await aladinClient.lookupItem({
        itemId: itemId,
        itemIdType: "ItemId",
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
          : "Failed to fetch book details from Aladin.";
      throw createError({
        statusCode: 500,
        statusMessage: message,
      });
    }
  },
);
