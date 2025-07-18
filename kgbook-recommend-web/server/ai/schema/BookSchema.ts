import { z } from "zod";

export const BookSchema = z.object({
  books: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      cover: z.string(),
      price: z.number(),
      category: z.string(),
      author: z.string(),
    }),
  ),
});
