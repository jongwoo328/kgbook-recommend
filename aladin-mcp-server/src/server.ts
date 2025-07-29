import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Aladin } from 'aladin-client';
import { z } from 'zod';
import { db } from './db';
import { log } from './log';
import { createEmbedding } from './service/openAiService';

export function createServer() {
  const server = new McpServer({
    name: 'Aladin MCP Server',
    version: '1.0.0',
  });
  const aladin = new Aladin({ ttbKey: process.env.TTB_KEY ?? '' });

  server.tool('get_new_books', async () => {
    log('get_new_books called');
    const results = await aladin.listItems({
      queryType: 'ItemNewAll',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_new_books_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      log(`get_new_books_by_category_id called with cid: ${cid}`);
      const results = await aladin.listItems({
        queryType: 'ItemNewAll',
        categoryId: cid,
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool('get_new_books_special', async () => {
    log('get_new_books_special called');
    const results = await aladin.listItems({
      queryType: 'ItemNewSpecial',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool('get_bestsellers_by_latest', async () => {
    log('get_bestsellers_by_latest called');
    const results = await aladin.listItems({
      queryType: 'Bestseller',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_bestsellers_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      log(`get_bestsellers_by_category_id called with cid: ${cid}`);
      const results = await aladin.listItems({
        queryType: 'Bestseller',
        categoryId: cid,
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool(
    'search_book_categories',
    {
      query: z.string(),
      page: z.number().optional(),
      size: z.number().optional(),
    },
    async ({ query, page = 1, size = 20 }) => {
      log(
        `search_book_categories called with query: ${query}, page: ${page}, size: ${size}`,
      );
      try {
        const sortField = 'category_vector';
        const sortOrder = 'desc';

        const offset = (page - 1) * size;

        const embeddedQuery = await createEmbedding(query);
        const result = await db.query(
          `
            SELECT cid, category, mall, depth1, depth2, depth3, depth4, depth5
            FROM (
                SELECT cid, category, mall, depth1, depth2, depth3, depth4, depth5,
                        1 - (category_vector <=> $1) AS cosine_similarity
                FROM kgbook.public.category
                ORDER BY ${sortField} ${sortOrder}
                LIMIT $2 OFFSET $3
            ) AS kgbook
        `,
          [JSON.stringify(embeddedQuery), size, offset],
        );
        return {
          content: result.rows.map((row) => ({
            type: 'text',
            text: JSON.stringify(row),
            mimeType: 'application/json',
          })),
        };
      } catch (err: unknown) {
        console.error(err);
        const message =
          err && typeof err === 'object' && 'message' in err
            ? err.message
            : String(err);
        return {
          content: [
            {
              type: 'text',
              text: `Error querying database: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'search_books_by_title_and_author',
    { query: z.string() },
    async ({ query }) => {
      log(`search_books_by_title_and_author called with query: ${query}`);
      const results = await aladin.searchItems({
        query: query,
        queryType: 'Keyword',
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool('get_book_by_item_id', { id: z.number() }, async ({ id }) => {
    log(`get_book_by_item_id called with id: ${id}`);
    const results = await aladin.lookupItem({
      itemId: id,
      itemIdType: 'ItemId',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool('get_book_by_isbn', { isbn: z.string() }, async ({ isbn }) => {
    log(`get_book_by_isbn called with isbn: ${isbn}`);
    const results = await aladin.lookupItem({
      itemId: isbn,
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool('get_editors_choice_books', async () => {
    log('get_editors_choice_books called');
    const results = await aladin.listItems({
      queryType: 'ItemEditorChoice',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }

    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_editors_choice_books_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      log(`get_editors_choice_books_by_category_id called with cid:) ${cid}`);
      const results = await aladin.listItems({
        queryType: 'ItemEditorChoice',
        categoryId: cid,
        searchTarget: 'Book',
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }

      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool('get_blog_bestseller', async () => {
    log('get_blog_bestseller called');
    const results = await aladin.listItems({
      queryType: 'BlogBest',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }

    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_blog_bestseller_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      log(`get_blog_bestseller_by_category_id called with cid: ${cid}`);
      const results = await aladin.listItems({
        queryType: 'BlogBest',
        categoryId: cid,
        searchTarget: 'Book',
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }

      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  return server;
}
